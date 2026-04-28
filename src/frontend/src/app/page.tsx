import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 h-[600px] w-[600px] rounded-full bg-primary/[0.07] blur-[150px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Prism</span>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-all hover:text-foreground hover:border-foreground/20"
        >
          Open App
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Status badge */}
        <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-[13px] text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Tracking expenses, budgets &amp; investments
        </div>

        {/* Headline */}
        <h1 className="max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
          Your finances,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            crystal clear.
          </span>
        </h1>

        {/* Sub */}
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
          Track spending, set budgets, monitor your portfolio, and uncover the
          patterns shaping your financial future.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="rounded-full px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-32 pt-16 sm:px-10">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          <FeatureCard
            step="01"
            title="Log Everything"
            description="Add transactions in seconds. Categorize automatically, track every dollar in and out."
          />
          <FeatureCard
            step="02"
            title="Set Boundaries"
            description="Create monthly budgets by category. Watch progress in real time as you spend."
          />
          <FeatureCard
            step="03"
            title="Grow Wealth"
            description="Track your stock portfolio, monitor gains, and see your net position evolve."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-5 text-center sm:px-10">
        <p className="text-[13px] text-muted-foreground/50">
          Built with .NET 8 · Next.js 16 · AWS · Bun
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 bg-card p-7 transition-colors hover:bg-muted/80">
      <span className="text-xs font-mono text-primary">{step}</span>
      <h3 className="text-[15px] font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
