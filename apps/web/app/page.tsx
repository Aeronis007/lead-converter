import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Unified Lead Management Platform
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Upload, map, and manage leads in one workspace.
        </h1>
        <p className="text-lg text-slate-300">
          Import CSV/XLSX files, confirm column mapping, and keep your leads
          organized with a dedicated dashboard.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-200"
        >
          Login
        </Link>
      </div>
      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold text-white">What you can do</h2>
        <ul className="grid gap-2 text-slate-300">
          <li>• Upload lead files from CSV, Excel, or Google Sheets exports</li>
          <li>• Auto-detect and confirm column mappings</li>
          <li>• Validate and clean lead data before storage</li>
          <li>• Manage leads and uploads in a unified dashboard</li>
        </ul>
      </section>
    </main>
  );
}
