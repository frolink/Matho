export interface SessionCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
}

/**
 * MATHO stores its own session tokens (issued by apps/api after Pi
 * verification) in httpOnly cookies — never in localStorage — so client-side
 * JavaScript never has direct access to the token value.
 */
export const SESSION_COOKIE = 'matho_session';
export const REFRESH_COOKIE = 'matho_refresh';

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export function accessTokenCookieOptions(maxAgeSeconds: number): SessionCookieOptions {
  return { ...baseCookieOptions, maxAge: maxAgeSeconds };
}

export function refreshTokenCookieOptions(): SessionCookieOptions {
  // Refresh tokens live for 30 days server-side (JWT_REFRESH_TTL); mirror that here.
  return { ...baseCookieOptions, maxAge: 60 * 60 * 24 * 30 };
}

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
}
