import Link from "next/link";
import { G } from "@/lib/brand";
import {
  STATUS_COLOR, avgScore, fmtDate, type Status, fetchLiveApplications, fetchLiveUsers,
} from "@/lib/admin-data";
import { Avatar, Card, CardHeader, PageHeader, ScoreDots, StatCard, TrackChip } from "@/components/admin/ui";
import { HBars } from "@/components/admin/charts";

export const dynamic = "force-dynamic";

const COLUMNS: { status: Status; hint: string }[] = [
  { status: "New", hint: "Waiting for a first review" },
  { status: "In review", hint: "Being scored by the team" },
  { status: "Shortlisted", hint: "Strong candidates" },
  { status: "Interview", hint: "Conversation scheduled" },
  { status: "Accepted", hint: "Welcome aboard" },
];

const PER_COLUMN = 5;

export default async function ReviewsPage() {
  const [apps, users] = await Promise.all([
    fetchLiveApplications(),
    fetchLiveUsers(),
  ]);

  const activeReviewers = users.filter((u) => ["Admin", "Lead", "Reviewer"].includes(u.role) && u.status === "Active");

  const allReviews = apps.flatMap((a) =>
    a.reviews.map((r) => ({ ...r, applicant: a.name, appId: a.id })),
  );
  const avg = allReviews.reduce((s, r) => s + r.score, 0) / (allReviews.length || 1);
  const needSecond = apps.filter((a) => a.status === "In review" && a.reviews.length < 2).length;
  const unanimous = apps.filter((a) => a.reviews.length >= 2 && a.reviews.every((r) => r.recommend === "Yes")).length;

  const workload = activeReviewers.map((u) => ({
    label: u.name,
    color: u.color,
    value: allReviews.filter((r) => r.reviewer.toLowerCase() === u.name.toLowerCase()).length,
  })).sort((a, b) => b.value - a.value);

  const latest = [...allReviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Hiring reviews"
        description="Move applicants through the pipeline and see what reviewers are saying in real-time."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reviews submitted" value={allReviews.length} note="Across all applicants" color={G.blue} />
        <StatCard label="Average score" value={avg.toFixed(1)} note="Out of 5" color={G.yellow} />
        <StatCard label="Need a second review" value={needSecond} note="In review with fewer than 2 scores" color={G.red} />
        <StatCard label="Unanimous yes" value={unanimous} note="Every reviewer recommends" color={G.green} />
      </div>

      {/* Pipeline board */}
      <div className="-mx-6 mt-6 overflow-x-auto px-6 pb-2 lg:-mx-8 lg:px-8">
        <div className="grid min-w-[1100px] grid-cols-5 gap-4">
          {COLUMNS.map(({ status, hint }) => {
            const items = apps.filter((a) => a.status === status).sort(
              (a, b) => avgScore(b) - avgScore(a) || b.submitted.localeCompare(a.submitted),
            );
            const color = STATUS_COLOR[status];
            return (
              <section key={status} aria-label={status} className="rounded-2xl border border-border bg-card/50 p-3">
                <div className="px-2 pb-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-sm font-medium">
                      <span className="size-2.5 rounded-full" style={{ background: color }} aria-hidden="true" />
                      {status}
                    </h2>
                    <span className="rounded-full bg-background px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
                </div>

                <ul className="space-y-2.5">
                  {items.slice(0, PER_COLUMN).map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/admin/applications/${a.id}`}
                        className="block rounded-xl border border-border bg-card p-3.5 transition hover:border-foreground/30"
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar name={a.name} size={28} />
                          <p className="truncate text-sm font-medium">{a.name}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {a.tracks.slice(0, 1).map((t) => <TrackChip key={t} id={t} />)}
                          {a.tracks.length > 1 && (
                            <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                              +{a.tracks.length - 1}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <ScoreDots score={avgScore(a)} size={6} />
                          <div className="flex -space-x-1.5">
                            {a.reviews.map((r) => (
                              <span key={r.reviewer} className="rounded-full ring-2 ring-card">
                                <Avatar name={r.reviewer} color={r.reviewerColor} size={20} />
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                  {items.length > PER_COLUMN && (
                    <li>
                      <Link
                        href="/admin/applications"
                        className="block rounded-xl px-3 py-2 text-center text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        +{items.length - PER_COLUMN} more
                      </Link>
                    </li>
                  )}
                  {items.length === 0 && (
                    <li className="rounded-xl border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground">
                      Nobody here yet
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader title="Latest feedback" hint="Most recent reviewer notes" />
          <ul className="mt-2 divide-y divide-border">
            {latest.map((r, i) => (
              <li key={`${r.appId}-${r.reviewer}-${i}`} className="flex gap-4 px-6 py-4">
                <Avatar name={r.reviewer} color={r.reviewerColor} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm">
                      <span className="font-medium">{r.reviewer}</span>
                      <span className="text-muted-foreground"> on </span>
                      <Link href={`/admin/applications/${r.appId}`} className="underline-offset-4 hover:underline">
                        {r.applicant}
                      </Link>
                    </p>
                    <ScoreDots score={r.score} size={6} />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.note}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground/70">{fmtDate(r.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Reviewer workload" hint="Reviews completed so far" />
          <div className="p-6">
            <HBars items={workload} />
          </div>
        </Card>
      </div>
    </>
  );
}
