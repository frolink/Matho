import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface NavbarProps {
  logo?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function Navbar({ logo, actions, className }: NavbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80',
        className,
      )}
    >
      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
        {logo ?? 'MATHO'}
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}
