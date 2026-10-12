import { Card } from "@/components/admin/ui";

export default function ApplicationDetailLoading() {
  return (
    <div className="space-y-6 smooth-fade-in animate-shimmer">
      <div className="h-4 w-32 rounded bg-muted" />

      {/* Header */}
      <div className="flex flex-wrap items-center gap-5">
        <div className="size-16 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-8 w-60 rounded-xl bg-muted" />
          <div className="h-4 w-96 rounded bg-muted/60" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted/60" />
              <div className="h-4 w-5/6 rounded bg-muted/60" />
              <div className="h-4 w-4/6 rounded bg-muted/60" />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-20 rounded bg-muted/60" />
                  <div className="h-5 w-32 rounded bg-muted" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6 space-y-4">
            <div className="h-5 w-36 rounded bg-muted" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-muted" />
              ))}
              <div className="h-24 rounded-xl bg-muted/60" />
              <div className="h-10 rounded-xl bg-muted" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
