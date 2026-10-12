"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Filter,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TRACK_GROUPS } from "@/lib/brand";
import {
  STATUSES,
  STATUS_COLOR,
  avgScore,
  fmtDate,
  type Application,
  type Status,
} from "@/lib/admin-data";
import {
  Avatar,
  Card,
  FilterPill,
  PageHeader,
  Pagination,
  ScoreDots,
  StatusBadge,
  TableSkeleton,
  TrackChip,
  btnGhost,
} from "@/components/admin/ui";
import { ApplicationToggle } from "@/components/admin/application-toggle";
import { ApplicationFormModal } from "@/components/admin/application-form-modal";

type SortOption = "newest" | "oldest" | "score-desc" | "score-asc" | "name-asc";

const CACHE_KEY = "gdg_cached_applications";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal & CRUD states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter States
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const [track, setTrack] = useState("all");
  const [branch, setBranch] = useState("all");
  const [year, setYear] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  // Pagination States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Button Busy States
  const [exporting, setExporting] = useState(false);

  // Fetch live applications with SWR (stale-while-revalidate) pattern
  useEffect(() => {
    let active = true;

    // Check client session cache
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApps(parsed);
          setLoading(false);
        }
      }
    } catch {}

    async function loadApps() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.applications)) {
            setApps(data.applications);
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.applications));
            } catch {}
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

  // Compute available branches dynamically
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => {
      if (a.branch) set.add(a.branch.trim());
    });
    return Array.from(set).sort();
  }, [apps]);

  // Status counts
  const counts = useMemo(() => {
    const m = new Map<string, number>([["All", apps.length]]);
    apps.forEach((a) => m.set(a.status, (m.get(a.status) ?? 0) + 1));
    return m;
  }, [apps]);

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [q, status, track, branch, year, scoreFilter, sort, pageSize]);

  // Filtered and Sorted applications
  const filteredApps = useMemo(() => {
    const searchLower = q.trim().toLowerCase();

    return apps
      .filter((a) => {
        // Status filter
        if (status !== "All" && a.status !== status) return false;

        // Track filter
        if (track !== "all" && !a.tracks.includes(track)) return false;

        // Branch filter
        if (branch !== "all" && a.branch?.toLowerCase() !== branch.toLowerCase()) return false;

        // Year filter
        if (year !== "all" && String(a.year) !== year) return false;

        // Score filter
        if (scoreFilter !== "all") {
          const score = avgScore(a);
          if (scoreFilter === "4+" && score < 4) return false;
          if (scoreFilter === "3+" && score < 3) return false;
          if (scoreFilter === "unreviewed" && a.reviews.length > 0) return false;
        }

        // Search query
        if (searchLower) {
          const inName = a.name.toLowerCase().includes(searchLower);
          const inEmail = a.email.toLowerCase().includes(searchLower);
          const inRoll = a.roll.toLowerCase().includes(searchLower);
          const inBranch = a.branch?.toLowerCase().includes(searchLower);
          const inTracks = a.tracks.some((t) => t.toLowerCase().includes(searchLower));
          if (!inName && !inEmail && !inRoll && !inBranch && !inTracks) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case "newest":
            return b.submitted.localeCompare(a.submitted);
          case "oldest":
            return a.submitted.localeCompare(b.submitted);
          case "score-desc":
            return avgScore(b) - avgScore(a);
          case "score-asc":
            return avgScore(a) - avgScore(b);
          case "name-asc":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [apps, q, status, track, branch, year, scoreFilter, sort]);

  // Paginated slice
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, page, pageSize]);

  // Check if any non-default filters are active
  const hasActiveFilters =
    Boolean(q.trim()) ||
    status !== "All" ||
    track !== "all" ||
    branch !== "all" ||
    year !== "all" ||
    scoreFilter !== "all";

  const clearAllFilters = () => {
    setQ("");
    setStatus("All");
    setTrack("all");
    setBranch("all");
    setYear("all");
    setScoreFilter("all");
    setSort("newest");
  };

  const exportCSV = (onlyFiltered = false) => {
    if (exporting) return;
    setExporting(true);
    try {
      const targetApps = onlyFiltered ? filteredApps : apps;
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Roll Number",
        "Branch",
        "Year",
        "Tracks",
        "Status",
        "Average Score",
        "Submitted Date",
      ];
      const csvRows = [headers.join(",")];
      for (const a of targetApps) {
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
      link.download = `gdg_applications_${onlyFiltered ? "filtered_" : ""}${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setExporting(false), 600);
    }
  };

  const handleSave = (savedApp: Application) => {
    setApps((prev) => {
      const exists = prev.some((a) => a.id === savedApp.id);
      const next = exists
        ? prev.map((a) => (a.id === savedApp.id ? savedApp : a))
        : [savedApp, ...prev];
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setModalOpen(false);
    setEditingApp(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete application for "${name}"?\nThis will also remove any reviews for this applicant.`
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/applications?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete application");
      setApps((prev) => {
        const next = prev.filter((a) => a.id !== id);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete application. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const selectCls =
    "rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground outline-none transition focus:border-foreground/40 hover:border-foreground/20 cursor-pointer";

  return (
    <div className="smooth-fade-in">
      <PageHeader
        title="Applications"
        description={`${apps.length} applications securely synced from Turso cloud database.`}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <ApplicationToggle />
            <button
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#4285F4] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3367D6] cursor-pointer"
              onClick={() => {
                setEditingApp(null);
                setModalOpen(true);
              }}
            >
              <Plus className="size-4" />
              <span>Add Applicant</span>
            </button>
            <button
              className={btnGhost}
              onClick={() => exportCSV(hasActiveFilters)}
              disabled={exporting}
              title={
                hasActiveFilters
                  ? `Export ${filteredApps.length} filtered applications`
                  : "Export all applications"
              }
            >
              {exporting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span>Exporting CSV...</span>
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  <span>{hasActiveFilters ? `Export Filtered (${filteredApps.length})` : "Export CSV"}</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Status Chips with Google Quad-Color Dots */}
      <div
        className="mb-4 flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filter by status"
      >
        {(["All", ...STATUSES] as const).map((s) => {
          const active = status === s;
          const count = counts.get(s) ?? 0;
          return (
            <button
              key={s}
              role="tab"
              aria-selected={active}
              onClick={() => setStatus(s)}
              className={cn(
                "group flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition cursor-pointer",
                active
                  ? "border-foreground bg-foreground text-background shadow-xs"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {s !== "All" && (
                <span
                  className="size-2 rounded-full transition-transform group-hover:scale-125"
                  style={{ background: STATUS_COLOR[s] }}
                  aria-hidden="true"
                />
              )}
              <span>{s}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-xs tabular-nums font-semibold",
                  active
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden shadow-xs">
        {/* Main Search & Advanced Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/60 p-4">
          <div className="relative min-w-[15rem] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, roll or track..."
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-9 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Track Filter */}
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className={selectCls}
              aria-label="Filter by track"
            >
              <option value="all">All Tracks</option>
              {TRACK_GROUPS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Branch Filter */}
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className={selectCls}
              aria-label="Filter by branch"
            >
              <option value="all">All Branches</option>
              {availableBranches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={selectCls}
              aria-label="Filter by year"
            >
              <option value="all">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>

            {/* Score Filter */}
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className={selectCls}
              aria-label="Filter by score"
            >
              <option value="all">All Ratings</option>
              <option value="4+">★ 4.0+ High Score</option>
              <option value="3+">★ 3.0+ Good Score</option>
              <option value="unreviewed">Unreviewed only</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className={selectCls}
              aria-label="Sort applicants"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
              <option value="name-asc">Applicant Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background/50 px-4 py-2.5 text-xs">
            <span className="flex items-center gap-1 font-medium text-muted-foreground">
              <Filter className="size-3.5" />
              Active Filters:
            </span>

            {q.trim() && (
              <FilterPill label="Search" value={`"${q.trim()}"`} onRemove={() => setQ("")} />
            )}

            {status !== "All" && (
              <FilterPill label="Status" value={status} onRemove={() => setStatus("All")} />
            )}

            {track !== "all" && (
              <FilterPill
                label="Track"
                value={
                  TRACK_GROUPS.flatMap((g) => g.tracks).find((t) => t.id === track)?.label || track
                }
                onRemove={() => setTrack("all")}
              />
            )}

            {branch !== "all" && (
              <FilterPill label="Branch" value={branch} onRemove={() => setBranch("all")} />
            )}

            {year !== "all" && (
              <FilterPill label="Year" value={`Year ${year}`} onRemove={() => setYear("all")} />
            )}

            {scoreFilter !== "all" && (
              <FilterPill
                label="Score"
                value={
                  scoreFilter === "4+"
                    ? "★ 4.0+"
                    : scoreFilter === "3+"
                    ? "★ 3.0+"
                    : "Unreviewed"
                }
                onRemove={() => setScoreFilter("all")}
              />
            )}

            <button
              onClick={clearAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-destructive transition hover:underline cursor-pointer"
            >
              <RotateCcw className="size-3" />
              Reset All
            </button>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3.5">Applicant</th>
                <th className="px-3 py-3.5">Tracks</th>
                <th className="px-3 py-3.5">Branch / Year</th>
                <th className="px-3 py-3.5">Score</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Applied</th>
                <th className="w-28 px-3 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton rows={pageSize > 10 ? 10 : pageSize} columns={7} />
            ) : (
              <tbody className="divide-y divide-border">
                {paginatedRows.map((a) => (
                  <tr
                    key={a.id}
                    className="group transition-colors hover:bg-background/80"
                  >
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/applications/${a.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar name={a.name} size={36} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground transition-colors group-hover:text-[#4285F4]">
                            {a.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {a.email} {a.roll && `· ${a.roll}`}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex max-w-[16rem] flex-wrap gap-1.5">
                        {a.tracks.map((t) => (
                          <TrackChip key={t} id={t} />
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{a.branch || "General"}</span>
                      <span className="block text-[11px] text-muted-foreground/80">Year {a.year}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <ScoreDots score={avgScore(a)} />
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted-foreground">
                      {fmtDate(a.submitted)}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingApp(a);
                            setModalOpen(true);
                          }}
                          aria-label={`Edit ${a.name}`}
                          title="Edit application"
                          className="grid size-7 place-items-center rounded-lg border border-transparent text-muted-foreground transition hover:border-border hover:bg-card hover:text-[#4285F4] cursor-pointer"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(a.id, a.name)}
                          disabled={deletingId === a.id}
                          aria-label={`Delete ${a.name}`}
                          title="Delete application"
                          className="grid size-7 place-items-center rounded-lg border border-transparent text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-50"
                        >
                          {deletingId === a.id ? (
                            <Loader2 className="size-3.5 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </button>
                        <Link
                          href={`/admin/applications/${a.id}`}
                          aria-label={`Open applicant details for ${a.name}`}
                          title="View application details"
                          className="grid size-7 place-items-center rounded-lg border border-transparent text-muted-foreground transition group-hover:border-border group-hover:bg-card group-hover:text-foreground"
                        >
                          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          {/* Empty States */}
          {!loading && paginatedRows.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="size-12 rounded-2xl border border-border bg-card p-3 text-muted-foreground mb-3 flex items-center justify-center">
                <SlidersHorizontal className="size-6 text-muted-foreground/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {apps.length === 0 ? "No applications found" : "No matching applications"}
              </h3>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {apps.length === 0
                  ? "Real applications submitted by candidates will appear here automatically."
                  : "Try adjusting your search criteria, clearing active filters, or selecting a different status."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-foreground/30 hover:bg-background cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Pagination Controls */}
        {!loading && filteredApps.length > 0 && (
          <Pagination
            currentPage={page}
            totalItems={filteredApps.length}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        )}
      </Card>

      {/* Application Form Modal (Create & Edit) */}
      <ApplicationFormModal
        isOpen={modalOpen}
        initialData={editingApp}
        onClose={() => {
          setModalOpen(false);
          setEditingApp(null);
        }}
        onSaved={handleSave}
      />
    </div>
  );
}

