"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { label: "Transactions", href: "/transactions", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { label: "Budgets", href: "/budgets", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 2v10l7 4" },
  { label: "Portfolio", href: "/portfolio", icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative z-10 flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col border-r border-border bg-card/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">Prism</span>
        </Link>

        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border px-5 py-3">
          <p className="text-[11px] text-muted-foreground/50">v0.1.0 · Dev</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen w-full pl-[220px]">
        <div className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
