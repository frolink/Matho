import { Badge } from './Badge';
import { Avatar } from './Avatar';
import { cn } from '../utils/cn';

export interface LiveCardProps {
  title: string;
  hostName: string;
  hostAvatarUrl?: string | null;
  thumbnailUrl?: string | null;
  viewerCount?: number;
  isLive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function LiveCard({
  title,
  hostName,
  hostAvatarUrl,
  thumbnailUrl,
  viewerCount = 0,
  isLive = true,
  className,
  onClick,
}: LiveCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-gray-900 text-left',
        className,
      )}
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-gray-900" />
      )}

      <div className="absolute left-2 top-2 flex items-center gap-1">
        {isLive ? <Badge variant="live">● LIVE</Badge> : null}
        <Badge variant="default" className="bg-black/50 text-white">
          👁 {viewerCount}
        </Badge>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-3">
        <Avatar name={hostName} src={hostAvatarUrl} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{title}</p>
          <p className="truncate text-xs text-gray-300">{hostName}</p>
        </div>
      </div>
    </button>
  );
}
