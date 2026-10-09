"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Download,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard, btnGhost, btnPrimary } from "@/components/admin/ui";
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

const BRANCHES = ["All", "CSE", "IT", "AI & DS", "ECE", "EEE", "Mechanical", "Civil"];
const SECTIONS = ["All", "A", "B", "C", "D"];

export default function AttendancePage() {
  const [events, setEvents] = useState<EventItem[]>([
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
  const [selectedEventId, setSelectedEventId] = useState("EV-101");
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: 1, event_id: "EV-101", student_name: "K. Sai Teja", roll_number: "22A81A0501", branch: "CSE", section: "A", status: "Present", marked_at: "2026-10-09 10:00:00" },
    { id: 2, event_id: "EV-101", student_name: "P. Bhavya Sri", roll_number: "23A81A05B4", branch: "AI & DS", section: "A", status: "Present", marked_at: "2026-10-09 10:01:00" },
    { id: 3, event_id: "EV-101", student_name: "V. Chaitanya Krishna", roll_number: "22A81A1208", branch: "IT", section: "B", status: "Present", marked_at: "2026-10-09 10:02:00" },
    { id: 4, event_id: "EV-101", student_name: "M. Durga Prasad", roll_number: "24A81A0412", branch: "ECE", section: "A", status: "Absent", marked_at: "2026-10-09 10:03:00" },
    { id: 5, event_id: "EV-101", student_name: "G. Harini", roll_number: "23A81A0589", branch: "CSE", section: "B", status: "Present", marked_at: "2026-10-09 10:04:00" },
    { id: 6, event_id: "EV-101", student_name: "N. Rakesh", roll_number: "24A81A0215", branch: "EEE", section: "A", status: "Present", marked_at: "2026-10-09 10:05:00" },
    { id: 7, event_id: "EV-101", student_name: "S. Sneha Latha", roll_number: "22A81A05G1", branch: "CSE", section: "C", status: "Present", marked_at: "2026-10-09 10:06:00" },
    { id: 8, event_id: "EV-101", student_name: "D. Varun Tej", roll_number: "23A81A4210", branch: "AI & DS", section: "B", status: "Present", marked_at: "2026-10-09 10:07:00" },
    { id: 9, event_id: "EV-101", student_name: "K. Harsha Vardhan", roll_number: "23A81A05K2", branch: "CSE", section: "C", status: "Present", marked_at: "2026-10-09 10:08:00" },
    { id: 10, event_id: "EV-101", student_name: "B. Rajesh", roll_number: "22A81A0423", branch: "ECE", section: "B", status: "Present", marked_at: "2026-10-09 10:09:00" },
    { id: 11, event_id: "EV-101", student_name: "T. Ananya", roll_number: "23A81A1234", branch: "IT", section: "A", status: "Present", marked_at: "2026-10-09 10:10:00" },
    { id: 12, event_id: "EV-101", student_name: "M. Charan", roll_number: "24A81A0556", branch: "CSE", section: "A", status: "Present", marked_at: "2026-10-09 10:11:00" },
  ]);

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Present" | "Absent">("All");

  // Fetch live attendance from Turso
  useEffect(() => {
    fetch(`/api/attendance?eventId=${selectedEventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.events?.length) setEvents(data.events);
        if (data.attendance?.length) {
          setRecords(
            data.attendance.map((r: any) => ({
              id: r.id,
              event_id: r.event_id,
              student_name: r.student_name,
              roll_number: r.roll_number,
              branch: r.branch,
              section: r.section || "A",
              status: (r.status as "Present" | "Absent") || "Present",
              marked_at: r.marked_at,
            })),
          );
        }
      })
      .catch((err) => console.error("Error loading attendance:", err));
  }, [selectedEventId]);

  // Filter and sort records based on Department and Section
  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((r) => {
        const matchesEvent = r.event_id === selectedEventId;
        const matchesBranch = selectedBranch === "All" || r.branch === selectedBranch;
        const matchesSection = selectedSection === "All" || r.section === selectedSection;
        const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;
        const matchesSearch =
          !q ||
          r.student_name.toLowerCase().includes(q) ||
          r.roll_number.toLowerCase().includes(q);

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

  // Toggle present/absent state with optimistic update and database write
  const toggleStatus = async (record: AttendanceRecord) => {
    const newStatus: "Present" | "Absent" = record.status === "Present" ? "Absent" : "Present";
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: newStatus } : r)),
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
    }
  };

  // Generate & Download PDF organized by Departments and Sections
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Brand Header
    doc.setFillColor(10, 15, 28); // #0a0f1c
    doc.rect(0, 0, 210, 36, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("GDGoC SVEC - Official Attendance Sheet", 14, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(141, 151, 179);
    doc.text(`Event: ${currentEvent?.title || "Community Event"} (${currentEvent?.date || "2026-10-09"})`, 14, 23);
    doc.text(`Venue: ${currentEvent?.venue || "Auditorium"} | Sorted by: Department & Section`, 14, 29);

    // Filter Summary Badge
    doc.setFontSize(9);
    doc.setTextColor(66, 133, 244);
    doc.text(
      `Filter: Dept: ${selectedBranch} | Sec: ${selectedSection} | Total Attendees: ${filteredRecords.length}`,
      14,
      44,
    );

    // Group records by Department and Section for neat PDF tables
    const tableData = filteredRecords.map((r, i) => [
      String(i + 1),
      r.student_name,
      r.roll_number,
      r.branch,
      r.section,
      r.status,
      r.marked_at ? r.marked_at.slice(11, 16) : "-",
    ]);

    autoTable(doc, {
      startY: 48,
      head: [["S.No", "Student Name", "Roll Number", "Department", "Section", "Attendance", "Time"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [36, 48, 83], // #243053
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [20, 25, 40],
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 5) {
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
      margin: { left: 14, right: 14 },
    });

    // Footer with signature line
    const finalY = (doc as any).lastAutoTable?.finalY || 200;
    if (finalY < 260) {
      doc.setFontSize(9);
      doc.setTextColor(100, 110, 130);
      doc.text("Faculty / Lead Signature: _______________________", 14, finalY + 20);
      doc.text("Generated by GDGoC SVEC Portal", 140, finalY + 20);
    }

    const safeTitle = (currentEvent?.title || "event").toLowerCase().replace(/[^a-z0-9]/g, "-");
    doc.save(`GDGoC-SVEC-Attendance-${safeTitle}-${selectedBranch}-${selectedSection}.pdf`);
  };

  const field =
    "rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-foreground/40 text-foreground";

  return (
    <>
      <PageHeader
        title="Event Attendance"
        description="Mark real-time student check-ins and download department & section sorted PDF rosters."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={exportPDF}
              className={cn(btnPrimary, "cursor-pointer flex items-center gap-2")}
            >
              <Download className="size-4" />
              Download Sorted PDF
            </button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Registered" value={totalCount} note="Enrolled for this session" color={G.blue} />
        <StatCard label="Present Today" value={presentCount} note="Marked at attendance desk" color={G.green} />
        <StatCard label="Absent" value={totalCount - presentCount} note="Not checked in" color={G.red} />
        <StatCard label="Attendance Rate" value={`${attendanceRate}%`} note="Turnout percentage" color={G.yellow} />
      </div>

      {/* Event Selector & Filters */}
      <div className="rounded-2xl border border-border bg-card/60 p-5 mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-primary" />
            <span className="text-sm font-medium">Select Session:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className={cn(field, "font-medium")}
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.date})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Venue: <strong className="text-foreground">{currentEvent?.venue}</strong></span>
            <span>•</span>
            <span>Track: <strong className="text-foreground">{currentEvent?.track}</strong></span>
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
              <option value="All">All Departments</option>
              {BRANCHES.filter((b) => b !== "All").map((b) => (
                <option key={b} value={b}>
                  Dept: {b}
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
              {SECTIONS.filter((s) => s !== "All").map((s) => (
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
              <option value="All">All Statuses</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table sorted by Department and Section */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredRecords.length}</strong> students sorted by Department & Section
          </span>
          <span className="hidden sm:inline">
            Click status pill to toggle Present / Absent
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Section</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No students match the selected department, section, or search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 text-xs tabular-nums text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {r.student_name}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {r.roll_number}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {r.branch}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        Sec {r.section}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(r)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer",
                          r.status === "Present"
                            ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                            : "bg-red-500/15 text-red-400 hover:bg-red-500/25",
                        )}
                      >
                        {r.status === "Present" ? (
                          <>
                            <CheckCircle2 className="size-3.5 text-green-400" />
                            Present
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3.5 text-red-400" />
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
                        Switch
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
