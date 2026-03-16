import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class SelectRoleDto {
  @ApiProperty({ enum: ['buyer', 'seller'] })
  @IsIn(['buyer', 'seller'])
  role!: 'buyer' | 'seller';
}
