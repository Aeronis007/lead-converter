export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Get Started
        </p>
        <h1 className="text-3xl font-semibold text-white">Create account</h1>
        <p className="text-slate-300">
          Build your workspace to import and activate leads faster.
        </p>
      </div>
      <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <label className="block space-y-2 text-sm text-slate-300">
          Full name
          <input
            type="text"
            name="name"
            placeholder="Jordan Lee"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          Work email
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          Password
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Create account
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already have access? <a href="/login" className="text-slate-100">Sign in</a>
      </p>
    </main>
  );
}
