import { EmptyState } from '@matho/ui';
import { RequireAuth } from '@/components/RequireAuth';

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Checkout</h1>
        <EmptyState
          icon="💳"
          title="Checkout is not yet implemented"
          description="Pi payment flow (create → approve → complete) is scaffolded in packages/sdk/src/pi/payments.ts."
        />
      </div>
    </RequireAuth>
  );
}
