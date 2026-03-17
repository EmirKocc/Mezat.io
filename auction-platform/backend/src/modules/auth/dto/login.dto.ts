import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'buyer@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: ['buyer', 'seller'] })
  @IsIn(['buyer', 'seller'])
  role!: 'buyer' | 'seller';
}
