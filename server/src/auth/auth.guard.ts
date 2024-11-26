import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated = request.isAuthenticated();

    if (!isAuthenticated) {
      return false;
    }

    const requireAdmin = this.reflector.get<boolean>(
      'requireAdmin',
      context.getHandler(),
    );

    if (requireAdmin && !request.user.isAdmin) {
      return false;
    }

    return true;
  }
}
