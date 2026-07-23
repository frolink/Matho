import { EmptyState } from '@matho/ui';
import { RequireAuth } from '@/components/RequireAuth';

export default function CartPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Your cart</h1>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Cart state is backed by a Zustand store placeholder (src/lib/cart-store.ts) — checkout logic is not yet implemented."
        />
      </div>
    </RequireAuth>
  );
}
