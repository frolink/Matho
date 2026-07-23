'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface BottomNavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface BottomNavigationProps {
  items: BottomNavItem[];
  activeHref: string;
  onNavigate?: (href: string) => void;
  /** Render prop so consuming apps can plug in next/link without this package depending on Next.js. */
  renderLink?: (item: BottomNavItem, isActive: boolean, children: ReactNode) => ReactNode;
}

export function BottomNavigation({ items, activeHref, onNavigate, renderLink }: BottomNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 sm:hidden">
      {items.map((item) => {
        const isActive = item.href === activeHref;
        const content = (
          <div
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
              isActive ? 'text-brand-600' : 'text-gray-500 dark:text-gray-400',
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </div>
        );

        if (renderLink) return <div key={item.href}>{renderLink(item, isActive, content)}</div>;

        return (
          <button
            key={item.href}
            onClick={() => onNavigate?.(item.href)}
            className="flex flex-1"
            aria-current={isActive ? 'page' : undefined}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
