import { EmptyState } from '@matho/ui';

export default function LivePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Live now</h1>
      <EmptyState
        icon="🔴"
        title="No livestreams yet"
        description="The Live module (packages/sdk streaming provider) is scaffolded but not yet wired to a real streaming vendor."
      />
    </div>
  );
}
