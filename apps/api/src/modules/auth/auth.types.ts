import type { UserRole } from '@matho/database';

/** Public-facing user shape returned to the frontend after login. */
export interface AuthenticatedUser {
  id: string;
  piUid: string | null;
  username: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthSessionResult {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}

/** Decoded payload of MATHO's own session JWTs (not the Pi accessToken). */
export interface MathoJwtPayload {
  sub: string;
  role: UserRole;
  type: 'access' | 'refresh';
}
