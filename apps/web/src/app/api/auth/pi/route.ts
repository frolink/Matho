import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  REFRESH_COOKIE,
  SESSION_COOKIE,
  accessTokenCookieOptions,
  getApiUrl,
  refreshTokenCookieOptions,
} from '@/lib/session';

/**
 * Receives the Pi `accessToken` obtained client-side from
 * `window.Pi.authenticate(['username'], ...)`, forwards it to the NestJS
 * backend (which verifies it against GET https://api.minepi.com/v2/me), and
 * — on success — stores the resulting MATHO session in httpOnly cookies.
 *
 * The raw session tokens never reach client-side JavaScript; only the
 * public `user` object is returned in the response body.
 */
export async function POST(request: Request) {
  let body: { accessToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid JSON body.' } },
      { status: 400 },
    );
  }

  if (!body.accessToken) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'accessToken is required.' } },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${getApiUrl()}/api/v1/auth/pi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: body.accessToken }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'UPSTREAM_UNREACHABLE', message: 'Could not reach the MATHO API.' },
      },
      { status: 502 },
    );
  }

  const payload = await upstream.json();

  if (!upstream.ok || !payload.success) {
    return NextResponse.json(
      {
        success: false,
        error: payload.error ?? {
          code: 'AUTH_FAILED',
          message: 'Pi authentication failed.',
        },
      },
      { status: upstream.status || 401 },
    );
  }

  const { user, tokens } = payload.data;

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, tokens.accessToken, accessTokenCookieOptions(tokens.expiresIn));
  cookieStore.set(REFRESH_COOKIE, tokens.refreshToken, refreshTokenCookieOptions());

  return NextResponse.json({ success: true, data: { user } });
}
