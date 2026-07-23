import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { MathoJwtPayload } from '../../modules/auth/auth.types';

/**
 * Validates the MATHO session JWT (issued by AuthService after a successful
 * Pi Network login — see apps/api/src/modules/auth) sent as:
 *   Authorization: Bearer <accessToken>
 *
 * On success, attaches the decoded payload to `request.user`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing Authorization: Bearer <token> header.');
    }

    try {
      const payload = this.jwtService.verify<MathoJwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('A refresh token cannot be used to authorize requests.');
      }

      (request as Request & { user?: MathoJwtPayload }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session token.');
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) return undefined;
    return header.slice('Bearer '.length).trim() || undefined;
  }
}
