import { EmptyState } from '@matho/ui';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <EmptyState
        icon="📦"
        title={`Product ${params.id}`}
        description="Product detail rendering (gallery, variants, buy box, reviews) is implemented in the Products module."
      />
    </div>
  );
}
