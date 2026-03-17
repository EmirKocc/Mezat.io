import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import type { Model } from 'mongoose';
import {
  User,
  type UserDocument,
} from '../../shared/database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async register(payload: RegisterDto) {
    const existingUser = await this.userModel
      .findOne({ email: payload.email.toLowerCase() })
      .lean();

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await hash(payload.password, 10);
    const user = await this.userModel.create({
      email: payload.email.toLowerCase(),
      passwordHash,
      role: payload.role,
      isActive: true,
    });

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      accessToken: 'mock-jwt-token', // placeholder: replace with real JWT issue logic.
      refreshToken: 'mock-refresh-token', // placeholder for refresh token workflow.
    };
  }

  async login(payload: LoginDto) {
    const user = await this.userModel.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await compare(payload.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      email: user.email,
      accessToken: 'mock-jwt-token', // placeholder: replace with credential validation + JWT.
      refreshToken: 'mock-refresh-token',
    };
  }

  getGoogleAuthUrl() {
    return {
      provider: 'google',
      url: 'https://accounts.google.com/o/oauth2/v2/auth', // placeholder: generated OAuth URL.
    };
  }
}
