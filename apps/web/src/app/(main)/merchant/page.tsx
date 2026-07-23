import { EmptyState } from '@matho/ui';
import { RequireAuth } from '@/components/RequireAuth';

export default function MerchantDashboardPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Merchant dashboard</h1>
        <EmptyState
          icon="📊"
          title="Merchant tools coming soon"
          description="Store setup, product management, and order fulfillment land with the Merchant module."
        />
      </div>
    </RequireAuth>
  );
}
