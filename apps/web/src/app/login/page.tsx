'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, Loading } from '@matho/ui';
import { APP_NAME, ROUTES } from '@matho/shared';
import { usePiAuth } from '@/lib/pi-auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { status, user, error, signIn } = usePiAuth();

  // Only redirect once authentication state is confirmed — never before.
  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.replace(ROUTES.HOME);
    }
  }, [status, user, router]);

  if (status === 'initializing' || status === 'authenticated') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loading label="Checking your session…" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <h1 className="text-xl font-semibold">Sign in to {APP_NAME}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Continue with your Pi Network account. We only request your Pi username — no
            payments scope is needed to sign in.
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => signIn()}
            isLoading={status === 'authenticating'}
          >
            Sign in with Pi
          </Button>
          {error ? (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          <p className="text-xs text-gray-400">
            Open this page inside the Pi Browser to sign in.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
