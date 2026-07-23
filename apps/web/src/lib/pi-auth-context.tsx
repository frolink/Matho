'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { authenticateWithPi, initializePiSdk, isPiSdkAvailable } from '@matho/sdk';

export interface SessionUser {
  id: string;
  piUid: string | null;
  username: string;
  role: string;
}

export type PiAuthStatus =
  | 'initializing'
  | 'authenticating'
  | 'authenticated'
  | 'unauthenticated';

interface PiAuthContextValue {
  status: PiAuthStatus;
  user: SessionUser | null;
  error: string | null;
  /** True only once the initial session check + auto-auth attempt has settled. */
  isReady: boolean;
  /** Manual trigger for the "Sign in with Pi" button. */
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextValue | null>(null);

async function checkExistingSession(): Promise<{ authenticated: boolean; user: SessionUser | null }> {
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' });
    const json = await res.json();
    return json?.data ?? { authenticated: false, user: null };
  } catch {
    return { authenticated: false, user: null };
  }
}

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PiAuthStatus>('initializing');
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bootstrapped = useRef(false);

  const performLogin = useCallback(async (): Promise<boolean> => {
    setStatus('authenticating');
    setError(null);

    try {
      // Pi.init(...) must complete before Pi.authenticate(...) is called.
      await initializePiSdk();
      const authResult = await authenticateWithPi();

      const res = await fetch('/api/auth/pi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: authResult.accessToken }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? 'Pi sign-in failed. Please try again.');
      }

      setUser(json.data.user);
      setStatus('authenticated');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pi sign-in failed. Please try again.');
      setStatus('unauthenticated');
      return false;
    }
  }, []);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    let cancelled = false;

    async function bootstrap() {
      setStatus('initializing');

      // Initialize the Pi SDK on startup. Best-effort: the app shell must
      // still render for visitors outside the Pi Browser (e.g. marketing
      // pages), so a failure here does not throw — it just skips auto-auth.
      try {
        await initializePiSdk();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[matho] Pi SDK initialization failed:', (err as Error).message);
      }
      if (cancelled) return;

      // Only attempt (re-)authentication if there is no existing session.
      const session = await checkExistingSession();
      if (cancelled) return;

      if (session.authenticated && session.user) {
        setUser(session.user);
        setStatus('authenticated');
        return;
      }

      if (isPiSdkAvailable()) {
        await performLogin();
      } else {
        if (!cancelled) setStatus('unauthenticated');
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [performLogin]);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setError(null);
      setStatus('unauthenticated');
    }
  }, []);

  const value: PiAuthContextValue = {
    status,
    user,
    error,
    isReady: status === 'authenticated' || status === 'unauthenticated',
    signIn: performLogin,
    signOut,
  };

  return <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>;
}

export function usePiAuth(): PiAuthContextValue {
  const ctx = useContext(PiAuthContext);
  if (!ctx) throw new Error('usePiAuth must be used within a <PiAuthProvider>');
  return ctx;
}
