import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Unified Leads
            </p>
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <nav className="space-y-2 text-sm">
            <a className="block rounded-lg bg-slate-800/60 px-3 py-2" href="/dashboard">
              Overview
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/60" href="/dashboard/leads">
              Leads
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/60" href="#">
              Imports
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/60" href="#">
              Settings
            </a>
          </nav>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/40 px-8 py-4">
          <div>
            <p className="text-sm text-slate-400">Workspace</p>
            <h1 className="text-xl font-semibold">Unified Lead Management</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <div>
              <p className="font-medium">Alex Morgan</p>
              <p className="text-xs text-slate-400">alex@company.com</p>
            </div>
          </div>
        </header>
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
