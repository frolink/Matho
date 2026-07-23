/**
 * Pi Network — browser-side SDK client.
 *
 * Wraps the foundational `window.Pi` object (loaded via
 * `<script src="https://sdk.minepi.com/pi-sdk.js">`, see
 * apps/web/src/app/layout.tsx) in a small Promise-based API:
 *
 *  - `initializePiSdk()`  — must be awaited once, before any auth call.
 *  - `authenticateWithPi()` — runs the Pi.authenticate(...) flow.
 *
 * Reference: https://pi-apps.github.io/pi-sdk-docs/quick-start/genai/Authentication
 */
import type { PiAuthResult, PiAuthScope, PiIncompletePayment, PiInitOptions } from './types';

/** Memoized so concurrent callers (e.g. React StrictMode double-effects)
 * share a single in-flight `Pi.init()` call instead of racing two. */
let initPromise: Promise<void> | null = null;

export function isPiSdkAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.Pi !== 'undefined';
}

/**
 * Initializes the Pi SDK. Must be awaited to completion before calling
 * `authenticateWithPi()`. Safe to call multiple times — subsequent calls
 * reuse the first initialization's promise.
 */
export function initializePiSdk(options?: Partial<PiInitOptions>): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!isPiSdkAvailable()) {
      throw new Error(
        'Pi SDK is not available on window. Make sure https://sdk.minepi.com/pi-sdk.js is loaded ' +
          '(see apps/web/src/app/layout.tsx) and that the app is opened inside the Pi Browser.',
      );
    }

    await window.Pi!.init({
      version: options?.version ?? '2.0',
      sandbox: options?.sandbox ?? process.env.NEXT_PUBLIC_PI_SANDBOX === 'true',
    });
  })();

  // If init fails, allow a future call to retry instead of caching the rejection forever.
  initPromise.catch(() => {
    initPromise = null;
  });

  return initPromise;
}

/**
 * Runs the Pi.authenticate(...) flow with the `username` scope only.
 * Callers MUST await `initializePiSdk()` to completion first.
 */
export async function authenticateWithPi(
  onIncompletePaymentFound: (payment: PiIncompletePayment) => void = defaultIncompletePaymentHandler,
): Promise<PiAuthResult> {
  if (!isPiSdkAvailable()) {
    throw new Error('Pi SDK is not available. Open this app inside the Pi Browser to sign in.');
  }

  const scopes: PiAuthScope[] = ['username'];
  const response = await window.Pi!.authenticate(scopes, onIncompletePaymentFound);

  return {
    accessToken: response.accessToken,
    piUid: response.user.uid,
    username: response.user.username,
  };
}

function defaultIncompletePaymentHandler(payment: PiIncompletePayment): void {
  // eslint-disable-next-line no-console
  console.warn('[@matho/sdk] Incomplete Pi payment found during authentication:', payment.identifier);
}
