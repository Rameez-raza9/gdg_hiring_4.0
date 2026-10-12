export default function AdminOverviewLoading() {
  return (
    <div className="space-y-6 smooth-fade-in animate-shimmer">
      {/* Header skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-muted" />
          <div className="h-4 w-80 rounded-lg bg-muted/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-36 rounded-xl bg-muted" />
          <div className="h-10 w-44 rounded-xl bg-muted" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          "#4285F4",
          "#EA4335",
          "#FBBC04",
          "#34A853",
        ].map((color, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: color }} />
              <div className="h-3.5 w-28 rounded bg-muted" />
            </div>
            <div className="h-8 w-16 rounded bg-muted font-bold" />
            <div className="h-3 w-36 rounded bg-muted/60" />
          </div>
        ))}
      </div>

      {/* 2 Big Cards */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-28 rounded-xl bg-muted/50" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-28 rounded-xl bg-muted/50" />
        </div>
      </div>

      {/* Table / List card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="h-5 w-48 rounded bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50">
              <div className="size-9 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-36 rounded bg-muted" />
                <div className="h-3 w-52 rounded bg-muted/60" />
              </div>
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
