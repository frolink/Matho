import { EmptyState } from '@matho/ui';

export default function StoreDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <EmptyState
        icon="🏬"
        title={`Store ${params.id}`}
        description="Storefront rendering (banner, product grid, follow button) is implemented in the Merchant module."
      />
    </div>
  );
}
