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
 * Resolves the current MATHO session from httpOnly cookies. Used on app
 * load to check "is there already an authenticated session?" before
 * deciding whether to attempt automatic Pi authentication.
 */
export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(SESSION_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ success: true, data: { authenticated: false, user: null } });
  }

  if (accessToken) {
    const me = await fetchMe(accessToken);
    if (me) {
      return NextResponse.json({ success: true, data: { authenticated: true, user: me } });
    }
  }

  // Access token missing/expired — try a one-shot refresh before giving up.
  if (refreshToken) {
    const refreshed = await refreshSession(refreshToken);
    if (refreshed) {
      cookieStore.set(
        SESSION_COOKIE,
        refreshed.tokens.accessToken,
        accessTokenCookieOptions(refreshed.tokens.expiresIn),
      );
      cookieStore.set(REFRESH_COOKIE, refreshed.tokens.refreshToken, refreshTokenCookieOptions());
      return NextResponse.json({
        success: true,
        data: { authenticated: true, user: refreshed.user },
      });
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  return NextResponse.json({ success: true, data: { authenticated: false, user: null } });
}

async function fetchMe(accessToken: string) {
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.user ?? null;
  } catch {
    return null;
  }
}

async function refreshSession(refreshToken: string) {
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? json.data : null;
  } catch {
    return null;
  }
}
