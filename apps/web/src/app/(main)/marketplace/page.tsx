import { EmptyState, SearchBar } from '@matho/ui';

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Marketplace</h1>
      <SearchBar placeholder="Search products, stores, creators…" className="mb-6" />
      <EmptyState
        icon="🛍️"
        title="Catalog coming soon"
        description="Product listing, search, and category browsing will be implemented in the Products module."
      />
    </div>
  );
}
