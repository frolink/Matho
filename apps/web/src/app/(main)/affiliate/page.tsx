import { EmptyState } from '@matho/ui';
import { RequireAuth } from '@/components/RequireAuth';

export default function AffiliateDashboardPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Affiliate dashboard</h1>
        <EmptyState
          icon="🔗"
          title="No affiliate links yet"
          description="Link generation, click tracking, and commission payouts land with the Affiliate module."
        />
      </div>
    </RequireAuth>
  );
}
