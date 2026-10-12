import { Card, TableSkeleton } from "@/components/admin/ui";

export default function UsersLoading() {
  return (
    <div className="space-y-6 smooth-fade-in animate-shimmer">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-36 rounded-xl bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted/70" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-muted" />
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
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="h-10 flex-1 min-w-[14rem] rounded-xl bg-muted" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-20 rounded-full bg-muted" />
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-3 py-3 font-medium">Role (RBAC)</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Last active</th>
                <th className="px-6 py-3 text-right font-medium">Access</th>
              </tr>
            </thead>
            <TableSkeleton rows={8} columns={5} />
          </table>
        </div>
      </Card>
    </div>
  );
}
