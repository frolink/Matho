import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700',
        className,
      )}
    >
      {icon ? <div className="mb-1 text-3xl">{icon}</div> : null}
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
