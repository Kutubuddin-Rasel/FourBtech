import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // First validate the user credentials
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    // Then generate the JWT token and return user data
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // Temporary debug endpoint
  @Get('debug/user')
  async debugUser(@Request() req) {
    const email = req.query.email;
    if (!email) {
      return { error: 'Email parameter is required' };
    }
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { exists: false, email };
    }
    const { password, ...userWithoutPassword } = user;
    return {
      exists: true,
      email,
      user: userWithoutPassword
    };
  }

  // Temporary test endpoint to create a seller
  @Post('test/create-seller')
  async createTestSeller() {
    const testSeller = {
      email: 'sellertwo@gmail.com',
      password: 'Ami123456',
      name: 'sellertwo',
      role: UserRole.SELLER
    };
    
    try {
      // First check if user exists
      const existingUser = await this.usersService.findByEmail(testSeller.email);
      if (existingUser) {
        // If exists, update the password
        const hashedPassword = await bcrypt.hash(testSeller.password, 10);
        await this.usersService.update(existingUser.id, { password: hashedPassword });
        return { message: 'Seller password updated successfully' };
      }
      
      // If not exists, create new seller
      const result = await this.authService.register(testSeller);
      return { message: 'Test seller created successfully', user: result };
    } catch (error) {
      return { error: error.message };
    }
  }
} 