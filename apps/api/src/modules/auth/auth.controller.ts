import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { PiLoginDto } from './dto/pi-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Verifies a Pi Network accessToken (GET https://api.minepi.com/v2/me under
   * the hood) and, on success, issues a MATHO session (access + refresh JWT).
   */
  @Post('pi')
  @HttpCode(HttpStatus.OK)
  async loginWithPi(@Body() dto: PiLoginDto) {
    const session = await this.authService.loginWithPi(dto.accessToken);
    return { success: true, data: session };
  }

  /** Exchanges a valid refresh token for a new access + refresh token pair. */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    const session = await this.authService.refresh(dto.refreshToken);
    return { success: true, data: session };
  }

  /** Returns the current session's user — used by the frontend BFF to
   * confirm an existing session is still valid on app load. */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@Req() req: Request) {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    const user = await this.authService.getById(userId as string);
    return { success: true, data: { user } };
  }
}
