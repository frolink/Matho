import { cn } from '../utils/cn';

export interface LoadingProps {
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ label = 'Loading…', className, fullScreen }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400',
        fullScreen ? 'min-h-[60vh]' : 'py-10',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
