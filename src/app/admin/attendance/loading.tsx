import { Card, TableSkeleton } from "@/components/admin/ui";

export default function AttendanceLoading() {
  return (
    <div className="space-y-6 smooth-fade-in animate-shimmer">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-xl bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded-xl bg-muted" />
          <div className="h-10 w-32 rounded-xl bg-muted" />
        </div>
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Section</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <TableSkeleton rows={8} columns={7} />
          </table>
        </div>
      </Card>
    </div>
  );
}
