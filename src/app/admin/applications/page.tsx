"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRACK_GROUPS } from "@/lib/brand";
import { APPLICATIONS, STATUSES, STATUS_COLOR, avgScore, fmtDate, type Status } from "@/lib/admin-data";
import { Avatar, Card, PageHeader, ScoreDots, StatusBadge, TrackChip, btnGhost } from "@/components/admin/ui";

type Sort = "newest" | "score";

import { ApplicationToggle } from "@/components/admin/application-toggle";

export default function ApplicationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const [track, setTrack] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");

  const counts = useMemo(() => {
    const m = new Map<string, number>([["All", APPLICATIONS.length]]);
    APPLICATIONS.forEach((a) => m.set(a.status, (m.get(a.status) ?? 0) + 1));
    return m;
  }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return APPLICATIONS.filter(
      (a) =>
        (status === "All" || a.status === status) &&
        (track === "all" || a.tracks.includes(track)) &&
        (!s ||
          a.name.toLowerCase().includes(s) ||
          a.email.toLowerCase().includes(s) ||
          a.roll.toLowerCase().includes(s)),
    ).sort((a, b) =>
      sort === "newest" ? b.submitted.localeCompare(a.submitted) : avgScore(b) - avgScore(a),
    );
  }, [q, status, track, sort]);

  const field =
    "rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-foreground/40";

  return (
    <>
      <PageHeader
        title="Applications"
        description={`${APPLICATIONS.length} applications received this cycle.`}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <ApplicationToggle />
            <button className={btnGhost}>
              <Download className="size-4" />
              Export CSV
            </button>
          </div>
        }
      />

      {/* status chips */}
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {(["All", ...STATUSES] as const).map((s) => {
          const active = status === s;
          return (
            <button
              key={s}
              role="tab"
              aria-selected={active}
              onClick={() => setStatus(s)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {s !== "All" && (
                <span className="size-2 rounded-full" style={{ background: STATUS_COLOR[s] }} aria-hidden="true" />
              )}
              {s}
              <span className={cn("text-xs tabular-nums", active ? "opacity-70" : "text-muted-foreground/70")}>
                {counts.get(s) ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <label className="relative min-w-[14rem] flex-1">
            <span className="sr-only">Search applications</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email or roll number"
              className={cn(field, "w-full pl-10")}
            />
          </label>
          <select value={track} onChange={(e) => setTrack(e.target.value)} className={field} aria-label="Filter by track">
            <option value="all">All tracks</option>
            {TRACK_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.tracks.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={field} aria-label="Sort">
            <option value="newest">Newest first</option>
            <option value="score">Highest score</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-6 py-3 font-medium">Applicant</th>
                <th className="px-3 py-3 font-medium">Tracks</th>
                <th className="px-3 py-3 font-medium">Branch</th>
                <th className="px-3 py-3 font-medium">Score</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Applied</th>
                <th className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => (
                <tr key={a.id} className="group transition-colors hover:bg-background/50">
                  <td className="px-6 py-3.5">
                    <Link href={`/admin/applications/${a.id}`} className="flex items-center gap-3">
                      <Avatar name={a.name} size={34} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{a.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{a.email}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex max-w-[16rem] flex-wrap gap-1.5">
                      {a.tracks.map((t) => <TrackChip key={t} id={t} />)}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground">
                    {a.branch} · Year {a.year}
                  </td>
                  <td className="px-3 py-3.5"><ScoreDots score={avgScore(a)} /></td>
                  <td className="px-3 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-3.5 text-muted-foreground">{fmtDate(a.submitted)}</td>
                  <td className="px-3 py-3.5">
                    <Link
                      href={`/admin/applications/${a.id}`}
                      aria-label={`Open ${a.name}`}
                      className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="px-6 py-14 text-center text-sm text-muted-foreground">
              No applications match these filters.
            </p>
          )}
        </div>

        <div className="border-t border-border px-6 py-3.5 text-xs text-muted-foreground">
          Showing {rows.length} of {APPLICATIONS.length}
        </div>
      </Card>
    </>
  );
}
