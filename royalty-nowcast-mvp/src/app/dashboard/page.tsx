export default function DashboardPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <select className="border rounded px-3 py-2">
          <option>Välj artist</option>
        </select>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI title="Master" value="–" subtitle="Veckans estimat" />
        <KPI title="Publishing" value="–" subtitle="Veckans estimat" />
        <KPI title="Närstående" value="–" subtitle="Veckans estimat" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Likviditet 6 månader</h2>
        <div className="h-64 border rounded grid place-items-center text-gray-500">Chart</div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top territories week-over-week</h2>
        <div className="border rounded p-4 text-gray-600">Tabell</div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Aviseringar</h2>
        <div className="border rounded p-4 text-gray-600">Avvikelser {'>'}20% vs faktiska statements</div>
      </section>
    </main>
  );
}

function KPI({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded border p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}