export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Unified Lead Management Platform
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Import, clean, and activate your leads in one workspace.
        </h1>
        <p className="text-lg text-slate-300">
          The MVP will streamline lead ingestion, automated column mapping, and
          validation before storing leads in PostgreSQL.
        </p>
      </div>
      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold text-white">MVP Focus</h2>
        <ul className="grid gap-2 text-slate-300">
          <li>• CSV/XLSX upload + column detection</li>
          <li>• Mapping confirmation workflow</li>
          <li>• Lead validation + enrichment pipeline</li>
          <li>• Dashboard views with filters</li>
        </ul>
      </section>
    </main>
  );
}
