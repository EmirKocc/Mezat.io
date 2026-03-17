import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SelectRoleDto } from './dto/select-role.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile from MongoDB' })
  me(@Param('userId') userId: string) {
    return this.usersService.getCurrentUser(userId);
  }

  @Patch(':userId/role')
  @ApiOperation({ summary: 'Switch active role (buyer/seller) for user' })
  selectRole(@Param('userId') userId: string, @Body() payload: SelectRoleDto) {
    return this.usersService.selectRole(userId, payload);
  }

  @Post(':userId/register-seller')
  @ApiOperation({ summary: 'Complete seller registration for existing user' })
  registerSeller(@Param('userId') userId: string) {
    return this.usersService.registerSellerProfile(userId);
  }
}
