export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-2xl font-semibold">Welcome back, Alex.</h2>
        <p className="mt-2 text-slate-300">
          Track incoming leads, validate new uploads, and prepare campaigns.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
            Upload leads
          </button>
          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Review mappings
          </button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "New leads", value: "0" },
          { label: "Uploads pending", value: "0" },
          { label: "Validations", value: "0" }
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
