'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, BottomNavigation, Button, Navbar } from '@matho/ui';
import type { BottomNavItem } from '@matho/ui';
import { ROUTES } from '@matho/shared';
import type { ReactNode } from 'react';
import { usePiAuth } from '@/lib/pi-auth-context';

const NAV_ITEMS: BottomNavItem[] = [
  { href: ROUTES.HOME, label: 'Home', icon: '🏠' },
  { href: ROUTES.LIVE, label: 'Live', icon: '🔴' },
  { href: ROUTES.MARKETPLACE, label: 'Market', icon: '🛍️' },
  { href: ROUTES.CART, label: 'Cart', icon: '🛒' },
  { href: ROUTES.PROFILE, label: 'Profile', icon: '👤' },
];

function NavbarAuthAction() {
  const { status, user } = usePiAuth();

  if (status === 'authenticated' && user) {
    return (
      <Link href={ROUTES.PROFILE} className="flex items-center gap-2" aria-label="Your profile">
        <Avatar name={user.username} size="sm" />
      </Link>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Link href={ROUTES.LOGIN}>
        <Button size="sm">Sign in with Pi</Button>
      </Link>
    );
  }

  // 'initializing' | 'authenticating' — avoid flashing either state before it's confirmed.
  return <span className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        logo={
          <Link href={ROUTES.HOME} className="flex items-center gap-1.5">
            <span className="text-brand-600">MATHO</span>
          </Link>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href={ROUTES.NOTIFICATIONS} aria-label="Notifications">
              🔔
            </Link>
            <NavbarAuthAction />
          </div>
        }
      />
      <main className="flex-1 pb-20 sm:pb-6">{children}</main>
      <BottomNavigation
        items={NAV_ITEMS}
        activeHref={pathname}
        renderLink={(item, _isActive, content) => <Link href={item.href}>{content}</Link>}
      />
    </div>
  );
}
