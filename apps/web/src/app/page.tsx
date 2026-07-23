import Link from 'next/link';
import { Button } from '@matho/ui';
import { APP_NAME, APP_TAGLINE, ROUTES } from '@matho/shared';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-brand-600 via-brand-700 to-gray-900 px-6 text-center text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-100">{APP_TAGLINE}</p>
      <h1 className="text-5xl font-bold">{APP_NAME}</h1>
      <p className="max-w-md text-brand-50/90">
        The AI-powered global live social commerce platform for the Pi ecosystem — where
        merchants, creators, and buyers meet without language barriers.
      </p>
      <div className="flex gap-3">
        <Link href={ROUTES.LOGIN}>
          <Button size="lg">Get started</Button>
        </Link>
        <Link href={ROUTES.MARKETPLACE}>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Browse marketplace
          </Button>
        </Link>
      </div>
    </main>
  );
}
