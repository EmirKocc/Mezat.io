import { Injectable } from '@nestjs/common';
import { SelectRoleDto } from './dto/select-role.dto';

@Injectable()
export class UsersService {
  getCurrentUser(userId: string) {
    return {
      id: userId,
      email: 'user@example.com',
      role: 'buyer',
    };
  }

  selectRole(userId: string, payload: SelectRoleDto) {
    return {
      id: userId,
      role: payload.role,
      updatedAt: new Date().toISOString(),
    };
  }
}
