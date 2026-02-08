import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Unified Lead Management Platform",
  description: "Unified lead management dashboard"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/80">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-sm">
            <Link href="/" className="text-base font-semibold text-white">
              Unified Leads
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
              <Link href="/register" className="hover:text-white">
                Register
              </Link>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <Link href="/dashboard/leads" className="hover:text-white">
                Leads
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
