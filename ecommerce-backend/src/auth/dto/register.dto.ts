import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../decorators/roles.decorator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
} 