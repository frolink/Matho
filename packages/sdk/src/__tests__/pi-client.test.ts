import { afterEach, describe, expect, it, vi } from 'vitest';

describe('pi client', () => {
  afterEach(() => {
    // @ts-expect-error -- test cleanup of the global stub
    delete globalThis.window;
    vi.resetModules();
  });

  it('rejects initializePiSdk when window.Pi is unavailable', async () => {
    const { initializePiSdk } = await import('../pi/client');
    await expect(initializePiSdk()).rejects.toThrow(/Pi SDK is not available/);
  });

  it('rejects authenticateWithPi when window.Pi is unavailable', async () => {
    const { authenticateWithPi } = await import('../pi/client');
    await expect(authenticateWithPi()).rejects.toThrow(/Pi SDK is not available/);
  });

  it('initializes and authenticates with the username scope only when window.Pi is present', async () => {
    const authenticate = vi.fn().mockResolvedValue({
      accessToken: 'abc123',
      user: { uid: 'uid-1', username: 'pioneer_jane' },
    });
    const init = vi.fn().mockResolvedValue(undefined);
    // @ts-expect-error -- minimal window stub for this test
    globalThis.window = { Pi: { init, authenticate } };

    const { initializePiSdk, authenticateWithPi } = await import('../pi/client');

    await initializePiSdk();
    expect(init).toHaveBeenCalledWith(expect.objectContaining({ version: '2.0' }));

    const result = await authenticateWithPi();
    expect(authenticate).toHaveBeenCalledWith(['username'], expect.any(Function));
    expect(result).toEqual({ accessToken: 'abc123', piUid: 'uid-1', username: 'pioneer_jane' });
  });
});
