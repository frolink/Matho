/**
 * Pi Network — shared types for the foundational `window.Pi` SDK
 * (https://sdk.minepi.com/pi-sdk.js) and our normalized wrappers around it.
 *
 * Reference: https://pi-apps.github.io/pi-sdk-docs/quick-start/genai/Authentication
 */

/** Scopes MATHO currently requests. Only `username` is used — no `payments`
 * or `wallet_address` scope is requested by the authentication flow. */
export type PiAuthScope = 'username';

export interface PiPlatformUser {
  uid: string;
  username: string;
}

/** Raw shape returned by `window.Pi.authenticate(...)`. */
export interface PiAuthenticateResponse {
  accessToken: string;
  user: PiPlatformUser;
}

/** Normalized result our own wrapper functions return. */
export interface PiAuthResult {
  accessToken: string;
  piUid: string;
  username: string;
}

export interface PiIncompletePayment {
  identifier: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

export interface PiInitOptions {
  version: string;
  sandbox?: boolean;
}

/** Result of GET https://api.minepi.com/v2/me — used server-side only. */
export interface PiMeResponse {
  uid: string;
  username: string;
  credentials?: {
    scopes?: string[];
    valid_until?: { timestamp: number; iso8601: string } | null;
  };
}

declare global {
  interface Window {
    Pi?: {
      init: (options: PiInitOptions) => Promise<void>;
      authenticate: (
        scopes: PiAuthScope[],
        onIncompletePaymentFound: (payment: PiIncompletePayment) => void,
      ) => Promise<PiAuthenticateResponse>;
      createPayment?: (...args: unknown[]) => unknown;
    };
  }
}

// Ensures this file is treated as a module (required for `declare global`).
export {};
