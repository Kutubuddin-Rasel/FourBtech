import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './decorators/roles.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${email}`);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.debug(`User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(user, password);
    this.logger.debug(`Password validation result for ${email}: ${isPasswordValid}`);

    if (!isPasswordValid) {
      this.logger.debug(`Invalid password for user: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    this.logger.debug(`User validated successfully: ${email}`);
    return result;
  }

  async login(user: any) {
    this.logger.debug(`Logging in user: ${user.email}`);
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role,
      name: user.name
    };
    
    this.logger.debug(`Creating JWT token with payload:`, payload);
    const accessToken = this.jwtService.sign(payload);
    
    this.logger.debug(`Login successful for user: ${user.email}`);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.debug(`Registering new user: ${createUserDto.email}`);
    const user = await this.usersService.create(createUserDto);
    this.logger.debug(`User registered successfully: ${user.email}`);
    return this.login(user);
    }

  async registerSeller(createUserDto: CreateUserDto) {
    this.logger.debug(`Registering new seller: ${createUserDto.email}`);
    const user = await this.usersService.createSeller(createUserDto);
    this.logger.debug(`Seller registered successfully: ${user.email}`);
    return this.login(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // TODO: Implement email service to send reset password link
    return { message: 'Password reset instructions sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // TODO: Validate reset token
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
    await this.usersService.update(user.id, { password: hashedPassword });

    return { message: 'Password reset successful' };
  }
} 