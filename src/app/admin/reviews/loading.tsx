export default function ReviewsLoading() {
  return (
    <div className="space-y-6 smooth-fade-in animate-shimmer">
      <div className="space-y-2">
        <div className="h-8 w-44 rounded-xl bg-muted" />
        <div className="h-4 w-80 rounded-lg bg-muted/70" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="h-3.5 w-24 rounded bg-muted" />
            <div className="h-8 w-14 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted/60" />
          </div>
        ))}
      </div>

      {/* Pipeline Board Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="rounded-2xl border border-border bg-card/60 p-3 space-y-3">
            <div className="flex items-center justify-between pb-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-6 rounded bg-muted" />
            </div>
            {Array.from({ length: 3 }).map((_, card) => (
              <div key={card} className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-muted" />
                  <div className="h-4 w-24 rounded bg-muted" />
                </div>
                <div className="h-5 w-16 rounded-full bg-muted/70" />
                <div className="h-3 w-20 rounded bg-muted/50" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
