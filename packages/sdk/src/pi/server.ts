/**
 * Pi Network — server-side access token verification.
 *
 * Validates a Pi accessToken by calling Pi Platform's `/v2/me` endpoint
 * with it as a Bearer token. This requires NO Pi API key — the user's own
 * accessToken is the only credential needed to confirm their identity.
 *
 * Reference: https://pi-apps.github.io/pi-sdk-docs/quick-start/genai/Authentication
 */
import type { PiAuthResult, PiMeResponse } from './types';

const DEFAULT_PI_API_BASE_URL = 'https://api.minepi.com/v2';

export class PiTokenVerificationError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'PiTokenVerificationError';
  }
}

/**
 * Verifies a Pi accessToken against `GET {PI_API_BASE_URL}/me` and returns
 * the pioneer's identity. Throws `PiTokenVerificationError` if the token is
 * missing, invalid, or expired.
 */
export async function verifyPiAccessToken(accessToken: string): Promise<PiAuthResult> {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new PiTokenVerificationError('Missing Pi access token.');
  }

  const baseUrl = process.env.PI_API_BASE_URL ?? DEFAULT_PI_API_BASE_URL;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new PiTokenVerificationError(
      `Could not reach Pi Platform API to verify access token: ${(error as Error).message}`,
    );
  }

  if (!response.ok) {
    throw new PiTokenVerificationError(
      `Pi access token verification failed (${response.status}).`,
      response.status,
    );
  }

  const data = (await response.json()) as PiMeResponse;

  if (!data?.uid || !data?.username) {
    throw new PiTokenVerificationError('Pi Platform API returned an unexpected /me response.');
  }

  return {
    accessToken,
    piUid: data.uid,
    username: data.username,
  };
}
