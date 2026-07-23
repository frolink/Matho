import { formatPi } from '@matho/shared';
import { Card } from './Card';
import { cn } from '../utils/cn';

export interface ProductCardProps {
  title: string;
  imageUrl?: string | null;
  priceInPi: number;
  storeName?: string;
  rating?: number;
  className?: string;
  onClick?: () => void;
}

export function ProductCard({
  title,
  imageUrl,
  priceInPi,
  storeName,
  rating,
  className,
  onClick,
}: ProductCardProps) {
  return (
    <Card
      className={cn('cursor-pointer overflow-hidden p-0 transition hover:shadow-md', className)}
      onClick={onClick}
    >
      <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        {storeName ? (
          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{storeName}</p>
        ) : null}
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-600">{formatPi(priceInPi)}</span>
          {typeof rating === 'number' ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">★ {rating.toFixed(1)}</span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
