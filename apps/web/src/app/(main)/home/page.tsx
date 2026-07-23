import { EmptyState } from '@matho/ui';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">For you</h1>
      <EmptyState
        icon="✨"
        title="Your feed is warming up"
        description="Follow stores and creators to see live shows and product drops here. Feed logic lands after Phase 1."
      />
    </div>
  );
}
