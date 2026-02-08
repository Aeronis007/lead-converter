import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-12 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Not Found</p>
      <h1 className="text-4xl font-semibold text-white">Page not found</h1>
      <p className="text-slate-300">
        The page you are looking for does not exist. Use the navigation to get
        back on track.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Go home
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Open dashboard
        </Link>
      </div>
    </main>
  );
}
