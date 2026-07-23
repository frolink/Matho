import { describe, expect, it } from 'vitest';
import { getStreamingProvider } from '../streaming/provider';

describe('getStreamingProvider', () => {
  it('resolves the placeholder provider by default', () => {
    const provider = getStreamingProvider();
    expect(provider.name).toBe('placeholder');
  });

  it('rejects until a real provider is implemented', async () => {
    const provider = getStreamingProvider();
    await expect(provider.createStreamSession('host_1')).rejects.toThrow();
  });
});
