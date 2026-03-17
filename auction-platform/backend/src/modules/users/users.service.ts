import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserDocument } from '../../shared/database/schemas/user.schema';
import { SelectRoleDto } from './dto/select-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getCurrentUser(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      roles: user.roles,
      activeRole: user.activeRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async selectRole(userId: string, payload: SelectRoleDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (payload.role !== user.activeRole) {
      throw new BadRequestException(
        'Bu hesap sabit role sahiptir. Farkli role gecis desteklenmiyor.',
      );
    }

    return {
      id: user.id,
      roles: user.roles,
      activeRole: user.activeRole,
      updatedAt: user.updatedAt,
    };
  }

  async registerSellerProfile(userId: string) {
    void userId;
    throw new BadRequestException(
      'Ayni hesap icin alici ve satici birlikte desteklenmiyor. Satici icin ayri hesap acin.',
    );
  }
}
