import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as sdk from '@matho/sdk';
import { UserRole } from '@matho/types';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('@matho/sdk', () => ({
  ...jest.requireActual('@matho/sdk'),
  verifyPiAccessToken: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { client: { user: { upsert: jest.Mock; findUnique: jest.Mock } } };

  beforeEach(async () => {
    prisma = {
      client: {
        user: {
          upsert: jest.fn(),
          findUnique: jest.fn(),
        },
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(() => 'signed.jwt.token'), verify: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => ({ JWT_SECRET: 'test-secret' })[key] ?? '15m') },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('verifies the Pi access token, upserts the user, and issues MATHO tokens', async () => {
    (sdk.verifyPiAccessToken as jest.Mock).mockResolvedValue({
      accessToken: 'pi-token',
      piUid: 'pi-uid-123',
      username: 'pioneer_jane',
    });
    prisma.client.user.upsert.mockResolvedValue({
      id: 'user-1',
      piUid: 'pi-uid-123',
      role: UserRole.BUYER,
      profile: { displayName: 'pioneer_jane' },
    });

    const result = await service.loginWithPi('pi-token');

    expect(sdk.verifyPiAccessToken).toHaveBeenCalledWith('pi-token');
    expect(prisma.client.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { piUid: 'pi-uid-123' } }),
    );
    expect(result.user).toMatchObject({
      id: 'user-1',
      piUid: 'pi-uid-123',
      username: 'pioneer_jane',
      role: UserRole.BUYER,
    });
    expect(result.tokens.accessToken).toBe('signed.jwt.token');
  });

  it('throws UnauthorizedException when Pi token verification fails', async () => {
    (sdk.verifyPiAccessToken as jest.Mock).mockRejectedValue(
      new sdk.PiTokenVerificationError('invalid token', 401),
    );

    await expect(service.loginWithPi('bad-token')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
