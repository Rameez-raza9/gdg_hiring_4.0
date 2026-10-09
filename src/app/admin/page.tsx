import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Dot } from "@/components/dot";
import { G, TRACKS } from "@/lib/brand";
import {
  APPLICATIONS, STATUSES, STATUS_COLOR, avgScore, countBy, fmtDate,
} from "@/lib/admin-data";
import {
  Avatar, Card, CardHeader, PageHeader, ScoreDots, StatCard, StatusBadge, TrackChip, btnGhost, btnPrimary,
} from "@/components/admin/ui";
import { HBars, StackedBar } from "@/components/admin/charts";

import { ApplicationToggle } from "@/components/admin/application-toggle";

export default function AdminOverview() {
  const total = APPLICATIONS.length;
  const byStatus = countBy(APPLICATIONS, (a) => a.status);
  const thisWeek = APPLICATIONS.filter((a) => a.submitted >= "2026-10-02").length;
  const awaiting = byStatus.get("New") ?? 0;
  const advancing = (byStatus.get("Shortlisted") ?? 0) + (byStatus.get("Interview") ?? 0);
  const accepted = byStatus.get("Accepted") ?? 0;

  const recent = [...APPLICATIONS].sort((a, b) => b.submitted.localeCompare(a.submitted)).slice(0, 6);
  const queue = APPLICATIONS.filter((a) => a.status === "New").sort((a, b) => a.submitted.localeCompare(b.submitted)).slice(0, 5);

  const trackCounts = TRACKS.map((t) => ({
    label: t.label,
    color: t.color,
    value: APPLICATIONS.filter((a) => a.tracks.includes(t.id)).length,
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <>
      <div className="mb-8 flex items-center gap-5">
        <div className="hidden sm:block">
          <Dot size={72} color={G.blue} shape="lean" />
        </div>
        <PageHeader
          title="Welcome back, Vinay"
          description="Here is where recruitment stands today."
          actions={
            <div className="flex flex-wrap items-center gap-2.5">
              <ApplicationToggle />
              <Link href="/admin/reviews" className={btnGhost}>Open pipeline</Link>
              <Link href="/admin/applications" className={btnPrimary}>Review applications</Link>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total applications" value={total} note={`${thisWeek} in the last 7 days`} color={G.blue} />
        <StatCard label="Awaiting review" value={awaiting} note="Not reviewed by anyone yet" color={G.red} />
        <StatCard label="Moving forward" value={advancing} note="Shortlisted or in interview" color={G.yellow} />
        <StatCard label="Accepted" value={accepted} note={`${Math.round((accepted / total) * 100)}% of all applicants`} color={G.green} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Pipeline"
            hint="Where every application is right now"
          />
          <div className="p-6">
            <StackedBar
              items={STATUSES.map((s) => ({ label: s, value: byStatus.get(s) ?? 0, color: STATUS_COLOR[s] }))}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Most popular tracks" hint="By number of applicants" />
          <div className="p-6">
            <HBars items={trackCounts} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Recent applications"
            action={
              <Link href="/admin/applications" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <ul className="mt-2 divide-y divide-border">
            {recent.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/applications/${a.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-background/50"
                >
                  <Avatar name={a.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {a.tracks.slice(0, 2).map((t) => <TrackChip key={t} id={t} />)}
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <StatusBadge status={a.status} />
                    <p className="mt-1.5 text-xs text-muted-foreground">{fmtDate(a.submitted)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Needs a first review" hint="Oldest waiting first" />
          <ul className="mt-2 divide-y divide-border">
            {queue.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/applications/${a.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-background/50"
                >
                  <Avatar name={a.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{a.name}</p>
                    <p className="text-xs text-muted-foreground">Applied {fmtDate(a.submitted)}</p>
                  </div>
                  <ScoreDots score={avgScore(a)} size={6} />
                </Link>
              </li>
            ))}
            {queue.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">Everything has a review.</li>
            )}
          </ul>
        </Card>
      </div>
    </>
  );
}
