import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any): Promise<User> {
    console.log('[JwtStrategy] Validating payload:', payload);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'role', 'name', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      console.log('[JwtStrategy] User not found for payload:', payload);
      throw new UnauthorizedException();
    }

    console.log('[JwtStrategy] Found user:', user);
    return user;
  }
} 