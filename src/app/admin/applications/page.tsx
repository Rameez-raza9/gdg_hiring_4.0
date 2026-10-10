"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRACK_GROUPS } from "@/lib/brand";
import { APPLICATIONS, STATUSES, STATUS_COLOR, avgScore, fmtDate, type Application, type Status } from "@/lib/admin-data";
import { Avatar, Card, PageHeader, ScoreDots, StatusBadge, TrackChip, btnGhost } from "@/components/admin/ui";
import { ApplicationToggle } from "@/components/admin/application-toggle";

type Sort = "newest" | "score";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const [track, setTrack] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");

  // Fetch live applications from Turso
  useEffect(() => {
    let active = true;
    async function loadApps() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.applications)) {
            setApps(data.applications);
          }
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadApps();
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const m = new Map<string, number>([["All", apps.length]]);
    apps.forEach((a) => m.set(a.status, (m.get(a.status) ?? 0) + 1));
    return m;
  }, [apps]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return apps
      .filter(
        (a) =>
          (status === "All" || a.status === status) &&
          (track === "all" || a.tracks.includes(track)) &&
          (!s ||
            a.name.toLowerCase().includes(s) ||
            a.email.toLowerCase().includes(s) ||
            a.roll.toLowerCase().includes(s)),
      )
      .sort((a, b) =>
        sort === "newest" ? b.submitted.localeCompare(a.submitted) : avgScore(b) - avgScore(a),
      );
  }, [apps, q, status, track, sort]);

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Roll Number", "Branch", "Year", "Tracks", "Status", "Average Score", "Submitted Date"];
    const csvRows = [headers.join(",")];
    for (const a of apps) {
      const row = [
        `"${a.id}"`,
        `"${a.name.replace(/"/g, '""')}"`,
        `"${a.email}"`,
        `"${a.phone}"`,
        `"${a.roll}"`,
        `"${a.branch}"`,
        `"${a.year}"`,
        `"${a.tracks.join("; ")}"`,
        `"${a.status}"`,
        `"${avgScore(a).toFixed(1)}"`,
        `"${a.submitted}"`,
      ];
      csvRows.push(row.join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gdg_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const field =
    "rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-foreground/40";

  return (
    <>
      <PageHeader
        title="Applications"
        description={`${apps.length} applications received in Turso cloud database.`}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <ApplicationToggle />
            <button className={btnGhost} onClick={exportCSV}>
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
          {loading ? (
            <div className="px-6 py-14 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent inline-block" />
              <span>Loading applications from database...</span>
            </div>
          ) : rows.length === 0 ? (
            <p className="px-6 py-14 text-center text-sm text-muted-foreground">
              {apps.length === 0
                ? "No applications received yet. Real applications submitted by students will appear here."
                : "No applications match these filters."}
            </p>
          ) : null}
        </div>

        <div className="border-t border-border px-6 py-3.5 text-xs text-muted-foreground">
          Showing {rows.length} of {apps.length}
        </div>
      </Card>
    </>
  );
}
