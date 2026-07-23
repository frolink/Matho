import { Card, CardContent, CardHeader, CardTitle, EmptyState, Navbar } from '@matho/ui';

const METRICS = [
  { label: 'Users', value: '—' },
  { label: 'Stores', value: '—' },
  { label: 'Orders (24h)', value: '—' },
  { label: 'GMV (Pi)', value: '—' },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar logo={<span className="text-brand-600">MATHO Admin</span>} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {METRICS.map((metric) => (
            <Card key={metric.label}>
              <CardHeader>
                <CardTitle className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-2xl font-semibold">{metric.value}</CardContent>
            </Card>
          ))}
        </div>
        <EmptyState
          icon="🛠️"
          title="Admin operations coming soon"
          description="User, store, order, and content moderation tooling is scaffolded for Phase 2 alongside the Admin API module."
        />
      </main>
    </div>
  );
}
