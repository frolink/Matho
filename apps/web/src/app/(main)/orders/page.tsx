import { EmptyState } from '@matho/ui';
import { RequireAuth } from '@/components/RequireAuth';

export default function OrdersPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Your orders</h1>
        <EmptyState icon="📋" title="No orders yet" description="Order history appears here once the Orders module is implemented." />
      </div>
    </RequireAuth>
  );
}
