/**
 * Streaming — provider-agnostic interface.
 *
 * MATHO's live-commerce core must never hardcode a specific streaming
 * vendor (Agora, LiveKit, Mux, Cloudflare Stream, etc.). Every provider
 * implements this interface; the active one is selected at runtime via
 * `STREAMING_PROVIDER` in the environment. Phase 1 ships a no-op
 * placeholder provider only.
 */

export interface StreamSession {
  streamId: string;
  playbackUrl: string;
  ingestUrl: string;
  streamKey: string;
}

export interface StreamingProvider {
  readonly name: string;
  createStreamSession(hostId: string): Promise<StreamSession>;
  endStreamSession(streamId: string): Promise<void>;
  getPlaybackUrl(streamId: string): Promise<string>;
}

/**
 * Placeholder provider used until a real vendor is integrated.
 * All apps should depend on `StreamingProvider`, never on this class
 * directly, so swapping providers later touches only this file plus
 * one factory function (`getStreamingProvider`).
 */
export class PlaceholderStreamingProvider implements StreamingProvider {
  public readonly name = 'placeholder';

  async createStreamSession(_hostId: string): Promise<StreamSession> {
    throw new Error(
      '[@matho/sdk] Streaming is not yet implemented. Configure STREAMING_PROVIDER and implement a StreamingProvider.',
    );
  }

  async endStreamSession(_streamId: string): Promise<void> {
    throw new Error('[@matho/sdk] Streaming is not yet implemented.');
  }

  async getPlaybackUrl(_streamId: string): Promise<string> {
    throw new Error('[@matho/sdk] Streaming is not yet implemented.');
  }
}

/**
 * Factory — resolves the active provider from configuration.
 * Additional providers register here (e.g. `case 'agora': return new AgoraProvider()`).
 */
export function getStreamingProvider(providerName = 'placeholder'): StreamingProvider {
  switch (providerName) {
    case 'placeholder':
    default:
      return new PlaceholderStreamingProvider();
  }
}
