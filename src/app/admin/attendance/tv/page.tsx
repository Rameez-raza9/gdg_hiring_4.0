"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Expand,
  GraduationCap,
  Maximize,
  Minimize,
  QrCode,
  Radio,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { formatToIST } from "@/lib/admin-data";
import { playSuccessChime } from "@/lib/audio-effects";
import QRScannerModal, { ScannedAttendee } from "@/components/admin/qr-scanner-modal";

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

export default function AttendanceTVPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [lastCheckIn, setLastCheckIn] = useState<AttendanceRecord | null>(null);
  const [heroHighlight, setHeroHighlight] = useState<AttendanceRecord | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keep track of known present roll numbers to detect newly checked-in candidates
  const knownPresentSet = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // Update digital clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );
      setCurrentDate(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(now)
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll attendance data from API every 1.5 seconds for real-time responsiveness
  useEffect(() => {
    let isMounted = true;

    const fetchAttendance = async () => {
      try {
        const res = await fetch("/api/attendance?eventId=EV-RECRUIT");
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !Array.isArray(data.attendance)) return;

        const newRecords: AttendanceRecord[] = data.attendance;
        setRecords(newRecords);
        setLoading(false);

        // Find newly arrived attendees
        const currentPresentRolls = new Set<string>();
        const newlyArrived: AttendanceRecord[] = [];

        newRecords.forEach((r) => {
          if (r.status === "Present") {
            const rollKey = r.roll_number.trim().toUpperCase();
            currentPresentRolls.add(rollKey);

            if (!isFirstLoad.current && !knownPresentSet.current.has(rollKey)) {
              newlyArrived.push(r);
            }
          }
        });

        // If candidates just checked in, trigger the TV spotlight!
        if (newlyArrived.length > 0) {
          const latest = newlyArrived[0];
          setLastCheckIn(latest);
          setHeroHighlight(latest);

          if (soundEnabled) {
            playSuccessChime();
          }

          // Keep hero highlight visible for 8 seconds
          setTimeout(() => {
            if (isMounted) setHeroHighlight((prev) => (prev?.roll_number === latest.roll_number ? null : prev));
          }, 8000);
        } else if (isFirstLoad.current) {
          // Set the most recent present candidate on initial load
          const presentSorted = [...newRecords]
            .filter((r) => r.status === "Present")
            .sort((a, b) => (b.marked_at || "").localeCompare(a.marked_at || ""));
          if (presentSorted.length > 0) {
            setLastCheckIn(presentSorted[0]);
          }
        }

        knownPresentSet.current = currentPresentRolls;
        isFirstLoad.current = false;
      } catch (err) {
        console.error("TV poll error:", err);
      }
    };

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [soundEnabled]);

  // Compute aggregated stats
  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "Present").length;
    const absent = total - present;
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;

    // Branch breakdown
    const branchMap = new Map<string, { total: number; present: number }>();
    records.forEach((r) => {
      const b = r.branch || "General";
      const curr = branchMap.get(b) || { total: 0, present: 0 };
      curr.total += 1;
      if (r.status === "Present") curr.present += 1;
      branchMap.set(b, curr);
    });

    const branches = Array.from(branchMap.entries())
      .map(([branch, count]) => ({
        branch,
        total: count.total,
        present: count.present,
        percent: Math.round((count.present / count.total) * 100),
      }))
      .sort((a, b) => b.present - a.present || b.total - a.total);

    // Recent check-ins list
    const recentPresent = [...records]
      .filter((r) => r.status === "Present")
      .sort((a, b) => (b.marked_at || "").localeCompare(a.marked_at || ""))
      .slice(0, 16);

    return { total, present, absent, percent, branches, recentPresent };
  }, [records]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background glowing ambience */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[550px] rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[550px] rounded-full bg-emerald-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-indigo-600/10 blur-[150px]" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0B101D]/80 backdrop-blur-md px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/attendance"
            className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 hover:bg-white/10 hover:text-white transition group"
            title="Return to Attendance Table"
          >
            <ArrowLeft className="size-5 transition group-hover:-translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#34A853] shadow-lg shadow-blue-500/20">
              <Sparkles className="size-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold tracking-tight text-white lg:text-2xl">
                  GDG SVEC 4.0
                </h1>
                <span className="flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-xs font-bold text-rose-400">
                  <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                  LIVE TV FEED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Recruitment Drive & Assessment • Campus Hall Display
              </p>
            </div>
          </div>
        </div>

        {/* Live Clock & Action Controls */}
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right">
            <div className="flex items-center justify-end gap-1.5 font-mono text-lg font-bold text-white tracking-wider">
              <Clock className="size-4 text-[#4285F4]" />
              {currentTime || "10:00:00 AM"} <span className="text-xs text-slate-400">IST</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{currentDate}</p>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#4285F4] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-[#3367D6] transition cursor-pointer"
          >
            <QrCode className="size-4" /> Scan QR
          </button>

          <button
            onClick={() => setSoundEnabled((v) => !v)}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title={soundEnabled ? "Mute TV chime" : "Enable chime"}
          >
            {soundEnabled ? <Volume2 className="size-5 text-emerald-400" /> : <VolumeX className="size-5 text-slate-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Toggle TV Fullscreen"
          >
            {isFullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="relative z-10 flex-1 p-6 lg:p-10 space-y-6 lg:space-y-8 max-w-[1920px] mx-auto w-full">
        {/* Dynamic Spotlight Banner for Newest Arrival */}
        {heroHighlight && (
          <div className="rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900/80 p-6 lg:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in zoom-in-95 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="flex size-16 lg:size-20 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 animate-bounce">
                  <CheckCircle2 className="size-10 lg:size-12" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs lg:text-sm font-extrabold uppercase tracking-widest text-emerald-400">
                      🎉 Just Checked In! Welcome to GDG!
                    </span>
                    <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-black text-white mt-1">
                    {heroHighlight.student_name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-300">
                    <span className="font-mono font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20">
                      {heroHighlight.roll_number}
                    </span>
                    <span className="font-semibold text-emerald-300">
                      {heroHighlight.branch} • Section {heroHighlight.section}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/25 border border-emerald-500/50 px-4 py-2 text-sm font-bold text-emerald-300">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  STATUS: PRESENT
                </div>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  Checked in at {formatToIST(heroHighlight.marked_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Big Impact Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Registered */}
          <div className="rounded-3xl border border-white/10 bg-[#0E1526]/80 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Registered</span>
              <Users className="size-4 text-[#4285F4]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-black text-4xl lg:text-6xl text-white tracking-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-slate-400">applicants</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#4285F4] w-full" />
            </div>
          </div>

          {/* Present Today */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-[#0E1526]/80 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Present in Hall
              </span>
              <CheckCircle2 className="size-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-black text-4xl lg:text-6xl text-emerald-400 tracking-tight">
                {stats.present}
              </span>
              <span className="text-xs font-semibold text-emerald-300/70">checked in</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>

          {/* Yet to Arrive */}
          <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-[#0E1526]/80 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-rose-400 text-xs font-bold uppercase tracking-wider">
              <span>Yet to Arrive</span>
              <Clock className="size-4 text-rose-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-black text-4xl lg:text-6xl text-rose-300 tracking-tight">
                {stats.absent}
              </span>
              <span className="text-xs font-semibold text-rose-300/70">pending</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-rose-400 transition-all duration-700"
                style={{ width: `${100 - stats.percent}%` }}
              />
            </div>
          </div>

          {/* Turnout Percentage */}
          <div className="rounded-3xl border border-[#FBBC04]/20 bg-gradient-to-br from-amber-950/20 to-[#0E1526]/80 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>Turnout Rate</span>
              <TrendingUp className="size-4 text-[#FBBC04]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-black text-4xl lg:text-6xl text-[#FBBC04] tracking-tight">
                {stats.percent}%
              </span>
              <span className="text-xs font-semibold text-amber-300/70">attendance</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#FBBC04] transition-all duration-700"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dual Layout: Live Stream Feed & Branch Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Recent Check-ins (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-[#0E1526]/70 backdrop-blur-md p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex size-3 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Real-time Hall Check-ins ({stats.present})
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Updating every 1.5 seconds
              </span>
            </div>

            {stats.recentPresent.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <QrCode className="size-12 mx-auto mb-3 opacity-40 text-[#4285F4]" />
                <p className="text-sm font-semibold text-white">No check-ins yet today</p>
                <p className="text-xs text-slate-400 mt-1">
                  Point any phone or scanner at applicant QR codes to mark them Present!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                {stats.recentPresent.map((attendee, index) => {
                  const isNewest = index === 0;
                  return (
                    <div
                      key={`${attendee.roll_number}-${index}`}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isNewest
                          ? "bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                          : "bg-white/[0.03] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            isNewest ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate leading-tight">
                            {attendee.student_name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {attendee.roll_number}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                          {attendee.branch} • {attendee.section}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          {formatToIST(attendee.marked_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Branch Analytics Breakdown (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#0E1526]/70 backdrop-blur-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-[#4285F4]" />
                <h3 className="text-base font-bold text-white tracking-tight">Branch Breakdown</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {stats.branches.length} departments
              </span>
            </div>

            <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
              {stats.branches.map((b) => (
                <div key={b.branch} className="space-y-1.5 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white">{b.branch}</span>
                    <span className="font-mono text-slate-300">
                      <span className="text-emerald-400 font-bold">{b.present}</span> / {b.total}{" "}
                      <span className="text-slate-400">({b.percent}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853] transition-all duration-700"
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding Bar */}
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#0B101D]/70 px-6 py-4 lg:px-10 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <span className="size-2 rounded-full bg-[#4285F4]" /> Google Developer Groups On Campus
          </div>
          <span>•</span>
          <span>Sri Vasavi Engineering College (SVEC)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-500 font-mono">
            Fast & Furious Real-time Attendance v4.0
          </span>
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </footer>

      {/* QR Scanner Modal for Instant Checking in from TV screen */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        eventId="EV-RECRUIT"
        onAttendeeMarked={(attendee) => {
          setHeroHighlight({
            id: attendee.id || Date.now(),
            event_id: "EV-RECRUIT",
            student_name: attendee.student_name,
            roll_number: attendee.roll_number,
            branch: attendee.branch,
            section: attendee.section,
            status: "Present",
            marked_at: attendee.marked_at,
          });
        }}
      />
    </div>
  );
}
