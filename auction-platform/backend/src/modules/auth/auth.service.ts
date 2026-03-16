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
    const created = await this.userModel.create({
      email,
      passwordHash,
      role: payload.role,
    });

    return {
      userId: this.getUserId(created as UserWithId),
      email: created.email,
      role: created.role,
      accessToken: `mock-jwt-token-${randomUUID()}`,
      refreshToken: `mock-refresh-token-${randomUUID()}`,
    };
  }

  async login(payload: LoginDto) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email }).exec();

    if (!user?.passwordHash) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const isValidPassword = await this.verifyPassword(
      payload.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    return {
      userId: this.getUserId(user as UserWithId),
      email: user.email,
      role: user.role,
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

  private getUserId(user: UserWithId): string {
    return user._id.toString();
  }
}
