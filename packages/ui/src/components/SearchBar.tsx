'use client';

import type { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export function SearchBar({ className, onSearch, onKeyDown, ...props }: SearchBarProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
        🔍
      </span>
      <input
        type="search"
        className="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === 'Enter') onSearch?.((e.target as HTMLInputElement).value);
        }}
        {...props}
      />
    </div>
  );
}
