export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Leads</h2>
          <p className="text-slate-300">
            Review, filter, and manage imported leads.
          </p>
        </div>
        <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
          Upload leads
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-6 py-4 text-sm text-slate-300">
          Leads table (placeholder)
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row} className="border-t border-slate-800 text-slate-200">
                <td className="px-6 py-4">Lead Name</td>
                <td className="px-6 py-4">lead@company.com</td>
                <td className="px-6 py-4">(000) 000-0000</td>
                <td className="px-6 py-4">CSV Upload</td>
                <td className="px-6 py-4">Just now</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
