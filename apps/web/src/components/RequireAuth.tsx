'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@matho/ui';
import { ROUTES } from '@matho/shared';
import { usePiAuth } from '@/lib/pi-auth-context';
import type { ReactNode } from 'react';

/**
 * Wrap any page that requires a signed-in user. Renders a loading state
 * while the session is being confirmed (initial session check and/or
 * automatic Pi authentication attempt), and only redirects to /login once
 * that confirmation has settled — never before.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, user, isReady } = usePiAuth();

  useEffect(() => {
    if (isReady && status === 'unauthenticated') {
      router.replace(ROUTES.LOGIN);
    }
  }, [isReady, status, router]);

  if (!isReady || !user) {
    return <Loading label="Confirming your session…" fullScreen />;
  }

  return <>{children}</>;
}
