import { Card, TableSkeleton } from "@/components/admin/ui";

export default function ApplicationsLoading() {
  return (
    <div className="space-y-6 smooth-fade-in animate-shimmer">
      {/* Header skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-xl bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-44 rounded-xl bg-muted" />
          <div className="h-10 w-32 rounded-xl bg-muted" />
        </div>
      </div>

      {/* Status chips skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-muted" />
        ))}
      </div>

      {/* Card with Search & Table */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card/60 p-4">
          <div className="h-10 flex-1 min-w-[15rem] rounded-xl bg-muted" />
          <div className="flex gap-2">
            <div className="h-9 w-28 rounded-xl bg-muted" />
            <div className="h-9 w-28 rounded-xl bg-muted" />
            <div className="h-9 w-24 rounded-xl bg-muted" />
            <div className="h-9 w-28 rounded-xl bg-muted" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3.5">Applicant</th>
                <th className="px-3 py-3.5">Tracks</th>
                <th className="px-3 py-3.5">Branch / Year</th>
                <th className="px-3 py-3.5">Score</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Applied</th>
                <th className="w-10 px-3 py-3.5" />
              </tr>
            </thead>
            <TableSkeleton rows={8} columns={7} />
          </table>
        </div>

        {/* Pagination bar skeleton */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="flex gap-1.5">
            <div className="h-8 w-16 rounded-lg bg-muted" />
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="h-8 w-16 rounded-lg bg-muted" />
          </div>
        </div>
      </Card>
    </div>
  );
}
