import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { Model } from 'mongoose';
import { UserDocument } from '../../shared/database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const scryptAsync = promisify(scrypt);

type UserWithId = UserDocument & { _id: { toString(): string } };

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async register(payload: RegisterDto) {
    const email = payload.email.trim().toLowerCase();
    const existing = await this.userModel.findOne({ email }).exec();

    if (existing) {
      throw new ConflictException('Bu e-posta zaten kayıtlı.');
    }

    const passwordHash = await this.hashPassword(payload.password);
    const roles = this.resolveRoles(payload);
    const created = await this.userModel.create({
      email,
      passwordHash,
      roles,
      activeRole: roles[0],
    });

    return {
      userId: this.getUserId(created as UserWithId),
      email: created.email,
      roles: created.roles,
      activeRole: created.activeRole,
      accessToken: `mock-jwt-token-${randomUUID()}`,
      refreshToken: `mock-refresh-token-${randomUUID()}`,
    };
  }

  async login(payload: LoginDto) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email }).lean<UserWithId>().exec();

    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const isValidPassword = await this.verifyPasswordForUser(
      user as UserWithId,
      payload.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const userRoles = this.resolveUserRoles(user as UserWithId);
    const activeRole = this.resolveActiveRole(user as UserWithId, userRoles);

    if (!userRoles.includes(payload.role)) {
      throw new UnauthorizedException(
        'Bu hesap secilen role ile giris yapamaz.',
      );
    }

    return {
      userId: this.getUserId(user as UserWithId),
      email: user.email,
      roles: userRoles,
      activeRole,
      accessToken: `mock-jwt-token-${randomUUID()}`,
      refreshToken: `mock-refresh-token-${randomUUID()}`,
    };
  }

  getGoogleAuthUrl() {
    return {
      provider: 'google',
      url: 'https://accounts.google.com/o/oauth2/v2/auth', // placeholder: generated OAuth URL.
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const key = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${key.toString('hex')}`;
  }

  private async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [salt, hashHex] = storedHash.split(':');
    if (!salt || !hashHex) {
      throw new InternalServerErrorException('Kayıtlı parola verisi bozuk.');
    }

    const hashedBuffer = Buffer.from(hashHex, 'hex');
    const suppliedBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuffer, suppliedBuffer);
  }

  private async verifyPasswordForUser(
    user: UserWithId,
    password: string,
  ): Promise<boolean> {
    const legacyPassword = (user as unknown as { password?: string }).password;
    const storedHash = user.passwordHash;

    if (!storedHash && !legacyPassword) {
      return false;
    }

    if (storedHash?.includes(':')) {
      return this.verifyPassword(password, storedHash);
    }

    const legacyMatch = storedHash === password || legacyPassword === password;
    if (!legacyMatch) {
      return false;
    }

    // Legacy plain-text passwords are upgraded after a successful login.
    const migratedHash = await this.hashPassword(password);
    await this.userModel
      .updateOne(
        { _id: user._id },
        { $set: { passwordHash: migratedHash } },
      )
      .exec();

    return true;
  }

  private getUserId(user: UserWithId): string {
    return user._id.toString();
  }

  private resolveUserRoles(user: UserWithId): Array<'buyer' | 'seller'> {
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.includes('buyer') || roles.includes('seller')) {
      return Array.from(new Set(roles)) as Array<'buyer' | 'seller'>;
    }

    const legacyRole = (user as unknown as { role?: 'buyer' | 'seller' }).role;
    if (legacyRole === 'buyer' || legacyRole === 'seller') {
      return [legacyRole];
    }

    if (user.activeRole === 'buyer' || user.activeRole === 'seller') {
      return [user.activeRole];
    }

    return ['buyer'];
  }

  private resolveActiveRole(
    user: UserWithId,
    roles: Array<'buyer' | 'seller'>,
  ): 'buyer' | 'seller' {
    if (user.activeRole && roles.includes(user.activeRole)) {
      return user.activeRole;
    }

    return roles[0] ?? 'buyer';
  }

  private resolveRoles(payload: RegisterDto): Array<'buyer' | 'seller'> {
    return [payload.role];
  }
}
