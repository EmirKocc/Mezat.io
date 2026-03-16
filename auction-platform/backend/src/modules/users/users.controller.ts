import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SelectRoleDto } from './dto/select-role.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get current user profile (placeholder)' })
  me(@Param('userId') userId: string) {
    return this.usersService.getCurrentUser(userId);
  }

  @Patch(':userId/role')
  @ApiOperation({ summary: 'Select user role: buyer or seller' })
  selectRole(@Param('userId') userId: string, @Body() payload: SelectRoleDto) {
    return this.usersService.selectRole(userId, payload);
  }
}
