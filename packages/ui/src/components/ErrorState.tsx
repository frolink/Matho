import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950',
        className,
      )}
      role="alert"
    >
      <div className="mb-1 text-3xl">⚠️</div>
      <p className="text-sm font-semibold text-red-700 dark:text-red-300">{title}</p>
      <p className="max-w-sm text-sm text-red-600/80 dark:text-red-400/80">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
