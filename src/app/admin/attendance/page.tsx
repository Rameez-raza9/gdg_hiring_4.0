"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Loader2,
  RefreshCcw,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard, btnGhost, btnPrimary, Pagination } from "@/components/admin/ui";
import { G } from "@/lib/brand";

interface AttendanceRecord {
  id: number;
  event_id: string;
  student_name: string;
  roll_number: string;
  branch: string;
  section: string;
  status: "Present" | "Absent";
  marked_at: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  venue: string;
  track: string;
}

export default function AttendancePage() {
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: "EV-RECRUIT",
      title: "GDGoC SVEC 4.0 Recruitment Drive & Assessment",
      date: "2026-10-18",
      venue: "SVEC Campus Seminar Halls & Labs",
      track: "All Tracks",
    },
    {
      id: "EV-101",
      title: "Google Cloud & GenAI Bootcamp",
      date: "2026-10-09",
      venue: "Auditorium Block A",
      track: "GenAI & AIML",
    },
    {
      id: "EV-102",
      title: "Modern Web SSR Jam with Next.js",
      date: "2026-10-05",
      venue: "CSE Seminar Hall",
      track: "Web and App",
    },
  ]);
  const [selectedEventId, setSelectedEventId] = useState("EV-RECRUIT");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Present" | "Absent">("All");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Busy states to prevent duplicate clicks
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  // Fetch live attendance from Turso
  const loadAttendance = async (eventId: string) => {
    try {
      const res = await fetch(`/api/attendance?eventId=${eventId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.events?.length) setEvents(data.events);
        if (Array.isArray(data.attendance)) {
          setRecords(
            data.attendance.map((r: any) => ({
              id: r.id,
              event_id: r.event_id,
              student_name: r.student_name,
              roll_number: r.roll_number,
              branch: r.branch || "General",
              section: r.section || "A",
              status: (r.status as "Present" | "Absent") || "Absent",
              marked_at: r.marked_at,
            }))
          );
        }
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadAttendance(selectedEventId);
  }, [selectedEventId]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedEventId, selectedBranch, selectedSection, selectedStatus, search, pageSize]);

  // Dynamically compute available branches from actual records
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.branch) set.add(r.branch.trim());
    });
    return ["All", ...Array.from(set).sort()];
  }, [records]);

  // Dynamically compute available sections from actual records
  const availableSections = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.section) set.add(r.section.trim());
    });
    return ["All", ...Array.from(set).sort()];
  }, [records]);

  // Department counts
  const departmentCounts = useMemo(() => {
    const map = new Map<string, { total: number; present: number }>();
    records.forEach((r) => {
      const b = r.branch || "General";
      const existing = map.get(b) || { total: 0, present: 0 };
      existing.total++;
      if (r.status === "Present") existing.present++;
      map.set(b, existing);
    });
    return map;
  }, [records]);

  // Filter and sort records based on Department and Section
  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((r) => {
        const matchesEvent = r.event_id === selectedEventId;
        const matchesBranch = selectedBranch === "All" || r.branch.toLowerCase() === selectedBranch.toLowerCase();
        const matchesSection = selectedSection === "All" || r.section === selectedSection;
        const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;
        const matchesSearch =
          !q ||
          r.student_name.toLowerCase().includes(q) ||
          r.roll_number.toLowerCase().includes(q) ||
          r.branch.toLowerCase().includes(q);

        return matchesEvent && matchesBranch && matchesSection && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        // Primary sort: Department (branch)
        if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
        // Secondary sort: Section
        if (a.section !== b.section) return a.section.localeCompare(b.section);
        // Tertiary sort: Roll number
        return a.roll_number.localeCompare(b.roll_number);
      });
  }, [records, selectedEventId, selectedBranch, selectedSection, selectedStatus, search]);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const presentCount = records.filter((r) => r.event_id === selectedEventId && r.status === "Present").length;
  const totalCount = records.filter((r) => r.event_id === selectedEventId).length;
  const attendanceRate = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;

  // Sync roster from all applications
  const handleSyncApplicants = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sync_from_applications",
          eventId: selectedEventId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync applicants");
      await loadAttendance(selectedEventId);
    } catch (err) {
      console.error("Sync error:", err);
      alert("Failed to synchronize applicants. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  // Toggle present/absent state with optimistic update and database write
  const toggleStatus = async (record: AttendanceRecord) => {
    if (togglingId === record.id) return;
    setTogglingId(record.id);
    const newStatus: "Present" | "Absent" = record.status === "Present" ? "Absent" : "Present";
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: newStatus } : r))
    );

    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: record.event_id,
          studentName: record.student_name,
          rollNumber: record.roll_number,
          branch: record.branch,
          section: record.section,
          status: newStatus,
        }),
      });
    } catch (e) {
      console.error("Failed to sync attendance:", e);
    } finally {
      setTogglingId(null);
    }
  };

  // Batch mark all Present / Absent
  const handleMarkAll = async (targetStatus: "Present" | "Absent") => {
    if (
      !window.confirm(
        `Are you sure you want to mark all ${records.length} applicants as ${targetStatus}?`
      )
    ) {
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (r.event_id === selectedEventId ? { ...r, status: targetStatus } : r))
    );

    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_all",
          eventId: selectedEventId,
          status: targetStatus,
        }),
      });
    } catch (e) {
      console.error("Failed to mark all:", e);
    }
  };

  // Generate & Download PDF with clean Department and Section Separation
  const exportPDF = () => {
    if (exportingPDF) return;
    setExportingPDF(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Group filtered records by branch / department
      const deptMap = new Map<string, AttendanceRecord[]>();
      for (const r of filteredRecords) {
        const d = r.branch || "General";
        if (!deptMap.has(d)) deptMap.set(d, []);
        deptMap.get(d)!.push(r);
      }

      const departments = Array.from(deptMap.keys()).sort();

      if (departments.length === 0) {
        alert("No attendance records to export for the current filter.");
        return;
      }

      departments.forEach((dept, index) => {
        if (index > 0) {
          doc.addPage();
        }

        const deptRecords = deptMap.get(dept) || [];
        const deptPresent = deptRecords.filter((r) => r.status === "Present").length;
        const deptAbsent = deptRecords.length - deptPresent;
        const deptRate = deptRecords.length
          ? Math.round((deptPresent / deptRecords.length) * 100)
          : 0;

        // Header Background Banner
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 210, 32, "F");

        // Google Quad-Color Accent Strip
        doc.setFillColor(66, 133, 244); // Blue
        doc.rect(0, 0, 52.5, 3, "F");
        doc.setFillColor(234, 67, 53); // Red
        doc.rect(52.5, 0, 52.5, 3, "F");
        doc.setFillColor(251, 188, 5); // Yellow
        doc.rect(105, 0, 52.5, 3, "F");
        doc.setFillColor(52, 168, 83); // Green
        doc.rect(157.5, 0, 52.5, 3, "F");

        // Header Typography
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text("Google Developer Groups on Campus · SVEC", 14, 13);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(203, 213, 225);
        doc.text(`Official Attendance & Verification Roster · Event: ${currentEvent?.title}`, 14, 20);
        doc.text(
          `Date: ${currentEvent?.date || "2026-10-18"}  |  Venue: ${currentEvent?.venue || "SVEC Campus"}  |  Sheet: Dept. ${index + 1} of ${departments.length}`,
          14,
          26
        );

        // Department Section Banner
        doc.setFillColor(241, 245, 249); // slate-100
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(14, 36, 182, 16, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(`DEPARTMENT / BRANCH: ${dept.toUpperCase()}`, 18, 43);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(
          `Total Candidates: ${deptRecords.length}   |   Present: ${deptPresent}   |   Absent: ${deptAbsent}   |   Turnout Rate: ${deptRate}%`,
          18,
          49
        );

        // Build Table Data for this Department
        const tableData = deptRecords.map((r, i) => [
          String(i + 1),
          r.roll_number,
          r.student_name,
          r.section,
          r.status,
          r.marked_at ? r.marked_at.slice(11, 16) : "-",
          "", // Blank column for offline/evaluator signature
        ]);

        autoTable(doc, {
          startY: 56,
          head: [
            ["#", "Roll Number", "Student Name", "Sec", "Attendance", "Marked Time", "Signature / Remarks"],
          ],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: [30, 41, 59], // slate-800
            textColor: [255, 255, 255],
            fontSize: 8.5,
            fontStyle: "bold",
          },
          bodyStyles: {
            fontSize: 8.5,
            textColor: [15, 23, 42],
            cellPadding: 2.2,
          },
          columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 32, fontStyle: "bold" },
            2: { cellWidth: 50 },
            3: { cellWidth: 14, halign: "center" },
            4: { cellWidth: 24, halign: "center" },
            5: { cellWidth: 18, halign: "center" },
            6: { cellWidth: 34 },
          },
          didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 4) {
              const val = String(data.cell.raw);
              if (val === "Present") {
                data.cell.styles.textColor = [52, 168, 83]; // Google Green
                data.cell.styles.fontStyle = "bold";
              } else {
                data.cell.styles.textColor = [234, 67, 53]; // Google Red
                data.cell.styles.fontStyle = "bold";
              }
            }
          },
          margin: { left: 14, right: 14, bottom: 24 },
        });

        // Department Footer Signatures
        const finalY = (doc as any).lastAutoTable?.finalY || 240;
        if (finalY < 265) {
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text("Faculty / Department Incharge Signature: _______________________", 14, finalY + 14);
          doc.text("GDG Lead Signature: _______________________", 130, finalY + 14);
          doc.text(
            `GDGoC SVEC Portal Verified · Generated: ${new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`,
            14,
            finalY + 20
          );
        }
      });

      const safeTitle = (currentEvent?.title || "event").toLowerCase().replace(/[^a-z0-9]/g, "-");
      doc.save(
        `GDGoC-SVEC-Attendance-${safeTitle}-${selectedBranch === "All" ? "All-Departments" : selectedBranch}.pdf`
      );
    } finally {
      setTimeout(() => setExportingPDF(false), 800);
    }
  };

  // Generate & Download Department and Section Separated CSV
  const exportCSV = () => {
    if (exportingCSV) return;
    setExportingCSV(true);
    try {
      const headers = [
        "Department",
        "Section",
        "Roll Number",
        "Student Name",
        "Attendance Status",
        "Marked Time",
        "Event Title",
      ];
      const csvRows = [headers.join(",")];

      const sorted = [...filteredRecords].sort((a, b) => {
        if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
        if (a.section !== b.section) return a.section.localeCompare(b.section);
        return a.roll_number.localeCompare(b.roll_number);
      });

      for (const r of sorted) {
        csvRows.push(
          [
            `"${r.branch}"`,
            `"${r.section}"`,
            `"${r.roll_number}"`,
            `"${r.student_name.replace(/"/g, '""')}"`,
            `"${r.status}"`,
            `"${r.marked_at || ""}"`,
            `"${(currentEvent?.title || "").replace(/"/g, '""')}"`,
          ].join(",")
        );
      }

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `GDGoC-SVEC-Attendance-${(currentEvent?.id || "drive").toLowerCase()}-${selectedBranch.toLowerCase()}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setExportingCSV(false), 500);
    }
  };

  const field =
    "rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-foreground/40 text-foreground cursor-pointer";

  return (
    <div className="smooth-fade-in">
      <PageHeader
        title="Event & Recruitment Attendance"
        description={`${records.length} applicant records synced. Download separated rosters by Department, Branch, and Section.`}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncApplicants}
              disabled={syncing}
              className={cn(
                btnGhost,
                "cursor-pointer flex items-center gap-2 disabled:opacity-60"
              )}
              title="Resynchronize roster from the 300+ applications table"
            >
              {syncing ? (
                <>
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <span>Syncing Roster...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="size-4" />
                  <span>Sync Applicants</span>
                </>
              )}
            </button>

            <button
              onClick={exportCSV}
              disabled={exportingCSV}
              className={cn(
                btnGhost,
                "cursor-pointer flex items-center gap-2 disabled:opacity-60"
              )}
              title="Export formatted CSV separated by department and section"
            >
              {exportingCSV ? (
                <>
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span>Exporting CSV...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="size-4" />
                  <span>Export CSV</span>
                </>
              )}
            </button>

            <button
              onClick={exportPDF}
              disabled={exportingPDF}
              className={cn(
                btnPrimary,
                "cursor-pointer flex items-center gap-2 disabled:pointer-events-none disabled:opacity-60"
              )}
              title="Download Department-Separated Official Attendance PDF"
            >
              {exportingPDF ? (
                <>
                  <Loader2 className="size-4 animate-spin text-neutral-950" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  <span>Download Department PDF</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard
          label="Total Registered"
          value={totalCount}
          note="Enrolled for this drive / event"
          color={G.blue}
        />
        <StatCard
          label="Present Candidates"
          value={presentCount}
          note="Verified check-ins"
          color={G.green}
        />
        <StatCard
          label="Absent Candidates"
          value={totalCount - presentCount}
          note="Pending or no-shows"
          color={G.red}
        />
        <StatCard
          label="Turnout Rate"
          value={`${attendanceRate}%`}
          note="Overall percentage"
          color={G.yellow}
        />
      </div>

      {/* Quick Action & Department Badges */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter Department:
          </span>
          {availableBranches.map((b) => {
            const active = selectedBranch === b;
            const stats = b === "All" ? { total: records.length } : departmentCounts.get(b);
            const count = stats?.total ?? 0;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBranch(b)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer",
                  active
                    ? "border-foreground bg-foreground text-background shadow-xs"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                <span>{b}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-semibold",
                    active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMarkAll("Present")}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 cursor-pointer"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll("Absent")}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition hover:bg-rose-500/20 cursor-pointer"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Event Selector & Filters */}
      <div className="rounded-2xl border border-border bg-card/60 p-5 mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-primary" />
            <span className="text-sm font-medium">Drive / Session:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className={cn(field, "font-medium min-w-[280px]")}
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.date})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>
              Venue: <strong className="text-foreground">{currentEvent?.venue}</strong>
            </span>
            <span>•</span>
            <span>
              Track: <strong className="text-foreground">{currentEvent?.track}</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-border/60">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search student or roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(field, "w-full pl-10")}
            />
          </label>

          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className={cn(field, "w-full")}
            >
              <option value="All">All Departments ({records.length})</option>
              {availableBranches
                .filter((b) => b !== "All")
                .map((b) => (
                  <option key={b} value={b}>
                    Dept: {b} ({departmentCounts.get(b)?.total ?? 0})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className={cn(field, "w-full")}
            >
              <option value="All">All Sections</option>
              {availableSections
                .filter((s) => s !== "All")
                .map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className={cn(field, "w-full")}
            >
              <option value="All">All Statuses ({filteredRecords.length})</option>
              <option value="Present">Present Only ({presentCount})</option>
              <option value="Absent">Absent Only ({totalCount - presentCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table sorted by Department and Section */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredRecords.length}</strong> applicants
            organized by Department & Section
          </span>
          <span className="hidden sm:inline">
            Click status button to toggle Present / Absent in real time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="border-b border-border bg-background/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Section</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-6 animate-spin mb-2 text-primary" />
                    Loading synchronized attendance records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    No candidates match the selected department, section, or search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map((r, idx) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-xs tabular-nums text-muted-foreground">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-medium text-foreground">
                        {r.roll_number}
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {r.student_name}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          {r.branch}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground font-mono">
                          Sec {r.section}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={togglingId === r.id}
                          onClick={() => toggleStatus(r)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer disabled:pointer-events-none disabled:opacity-60",
                            r.status === "Present"
                              ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                              : "bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
                          )}
                        >
                          {togglingId === r.id ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              Saving...
                            </>
                          ) : r.status === "Present" ? (
                            <>
                              <CheckCircle2 className="size-3.5 text-emerald-400" />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircle className="size-3.5 text-rose-400" />
                              Absent
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleStatus(r)}
                          className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredRecords.length > 0 && (
          <Pagination
            currentPage={page}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => setPageSize(s)}
            pageSizeOptions={[15, 30, 60, 100]}
          />
        )}
      </div>
    </div>
  );
}
