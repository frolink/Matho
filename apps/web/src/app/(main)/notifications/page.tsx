import { EmptyState } from '@matho/ui';
import { RequireAuth } from '@/components/RequireAuth';

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Notifications</h1>
        <EmptyState icon="🔔" title="You're all caught up" description="New order, live, and commission alerts will appear here." />
      </div>
    </RequireAuth>
  );
}
