import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path = request.route?.path;
    
    // Skip authentication for auth endpoints
    if (path && path.startsWith('/auth/')) {
      return true;
    }
    
    return super.canActivate(context);
  }
} 