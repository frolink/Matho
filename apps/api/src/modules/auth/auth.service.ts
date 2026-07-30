import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';

import { PiTokenVerificationError, verifyPiAccessToken } from '@matho/sdk';
import type { PiAuthResult } from '@matho/sdk';

import { UserRole } from '@matho/database';

import type { PrismaService } from '../../prisma/prisma.service';

import type { AuthSessionResult, AuthTokens, MathoJwtPayload } from './auth.types';

/**
 * AuthService — Pi Network authentication.
 *
 * Flow:
 *  1. Client sends the Pi `accessToken` obtained from `window.Pi.authenticate(...)`.
 *  2. We verify it server-side against Pi Platform's GET /v2/me.
 *  3. We upsert a User + Profile keyed by the verified Pi UID.
 *  4. We issue MATHO access & refresh JWTs.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async loginWithPi(accessToken: string): Promise<AuthSessionResult> {
    let piIdentity: PiAuthResult;

    try {
      piIdentity = await verifyPiAccessToken(accessToken);
    } catch (error) {
      if (error instanceof PiTokenVerificationError) {
        this.logger.warn(`Pi access token verification failed: ${error.message}`);
        throw new UnauthorizedException('Could not verify Pi access token.');
      }
      throw error;
    }

    const user = await this.prisma.client.user.upsert({
      where: { piUid: piIdentity.piUid },
      update: {
        profile: {
          upsert: {
            create: {
              displayName: piIdentity.username,
              languageCode: 'en',
            },
            update: {
              displayName: piIdentity.username,
            },
          },
        },
      },
      create: {
        piUid: piIdentity.piUid,
        role: UserRole.BUYER,
        profile: {
          create: {
            displayName: piIdentity.username,
            languageCode: 'en',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const tokens = this.issueTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        piUid: user.piUid,
        username: user.profile?.displayName ?? piIdentity.username,
        role: user.role,
      },
      tokens,
    };
  }

  async getById(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }

    return {
      id: user.id,
      piUid: user.piUid,
      username: user.profile?.displayName ?? 'Pioneer',
      role: user.role,
    };
  }

  verifyMathoToken(token: string): MathoJwtPayload {
    try {
      return this.jwtService.verify<MathoJwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired session token.');
    }
  }

  async refresh(refreshToken: string): Promise<AuthSessionResult> {
    const payload = this.verifyMathoToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Expected a refresh token.');
    }

    const user = await this.getById(payload.sub);
    const tokens = this.issueTokens(user.id, user.role);

    return {
      user,
      tokens,
    };
  }

  private issueTokens(userId: string, role: UserRole): AuthTokens {
    const secret = this.configService.get<string>('JWT_SECRET');
    const accessTtl = this.configService.get<string>('JWT_ACCESS_TTL') ?? '15m';
    const refreshTtl = this.configService.get<string>('JWT_REFRESH_TTL') ?? '30d';

    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        role,
        type: 'access',
      } satisfies MathoJwtPayload,
      {
        secret,
        expiresIn: accessTtl,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        role,
        type: 'refresh',
      } satisfies MathoJwtPayload,
      {
        secret,
        expiresIn: refreshTtl,
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.ttlToSeconds(accessTtl),
    };
  }

  private ttlToSeconds(ttl: string): number {
    const match = /^(\d+)([smhd])$/.exec(ttl);

    if (!match) return 900;

    const value = Number(match[1]);
    const unit = match[2];

    const multiplier = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    }[unit as 's' | 'm' | 'h' | 'd'];

    return value * multiplier;
  }
}
