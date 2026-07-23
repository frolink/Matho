import { afterEach, describe, expect, it, vi } from 'vitest';
import { PiTokenVerificationError, verifyPiAccessToken } from '../pi/server';

describe('verifyPiAccessToken', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the verified identity when Pi Platform API confirms the token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ uid: 'uid-1', username: 'pioneer_jane' }),
      }),
    );

    const result = await verifyPiAccessToken('valid-token');

    expect(result).toEqual({ accessToken: 'valid-token', piUid: 'uid-1', username: 'pioneer_jane' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/me'),
      expect.objectContaining({ headers: { Authorization: 'Bearer valid-token' } }),
    );
  });

  it('throws PiTokenVerificationError when the Pi API rejects the token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) }),
    );

    await expect(verifyPiAccessToken('bad-token')).rejects.toBeInstanceOf(PiTokenVerificationError);
  });

  it('throws PiTokenVerificationError for a missing token without calling fetch', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    await expect(verifyPiAccessToken('')).rejects.toBeInstanceOf(PiTokenVerificationError);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
