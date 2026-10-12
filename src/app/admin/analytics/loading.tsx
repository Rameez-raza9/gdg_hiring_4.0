export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 smooth-fade-in animate-shimmer">
      <div className="space-y-2">
        <div className="h-8 w-44 rounded-xl bg-muted" />
        <div className="h-4 w-80 rounded-lg bg-muted/70" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="h-3.5 w-24 rounded bg-muted" />
            <div className="h-8 w-14 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted/60" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-48 rounded-xl bg-muted/50" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-48 rounded-xl bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
