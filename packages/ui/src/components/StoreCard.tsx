import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Card, CardContent } from './Card';
import { cn } from '../utils/cn';

export interface StoreCardProps {
  name: string;
  logoUrl?: string | null;
  isVerified?: boolean;
  followerCount?: number;
  productCount?: number;
  className?: string;
  onClick?: () => void;
}

export function StoreCard({
  name,
  logoUrl,
  isVerified,
  followerCount = 0,
  productCount = 0,
  className,
  onClick,
}: StoreCardProps) {
  return (
    <Card className={cn('cursor-pointer transition hover:shadow-md', className)} onClick={onClick}>
      <CardContent className="flex items-center gap-3">
        <Avatar name={name} src={logoUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate font-semibold text-gray-900 dark:text-white">{name}</p>
            {isVerified ? <Badge variant="success">Verified</Badge> : null}
          </div>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {followerCount.toLocaleString()} followers · {productCount.toLocaleString()} products
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
