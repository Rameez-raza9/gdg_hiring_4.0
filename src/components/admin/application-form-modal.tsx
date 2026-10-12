"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Check, AlertCircle, Plus, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { G, TRACK_GROUPS } from "@/lib/brand";
import { type Application, type Status, STATUSES, STATUS_COLOR } from "@/lib/admin-data";
import { btnPrimary, btnGhost } from "./ui";

const BRANCHES = [
  "CSE",
  "CSE-AI",
  "AIML",
  "IT",
  "AI & DS",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "Other",
];

const YEARS = [1, 2, 3, 4];

const ALL_TRACKS = TRACK_GROUPS.flatMap((g) => g.tracks);

const CLUBS_LIST = [
  "MMLSC SVEC",
  "AWS Community Clubs SVEC",
  "SVAN",
  "TEDx Vasavi",
  "Dance Club",
  "Photography Club",
];

type FormData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  roll: string;
  branch: string;
  year: number;
  tracks: string[];
  status: Status;
  why: string;
  link: string;
  otherClubs: string[];
  clubRole: string;
  extraLinks: { label: string; url: string }[];
};

export function ApplicationFormModal({
  isOpen,
  onClose,
  initialData,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Application | null;
  onSaved: (savedApp: Application) => void;
}) {
  const isEditing = Boolean(initialData?.id);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    roll: "",
    branch: "CSE",
    year: 1,
    tracks: ["web-app"],
    status: "New",
    why: "",
    link: "",
    otherClubs: [],
    clubRole: "Member",
    extraLinks: [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        roll: initialData.roll || "",
        branch: initialData.branch || "CSE",
        year: initialData.year || 1,
        tracks: initialData.tracks || [],
        status: initialData.status || "New",
        why: initialData.why || "",
        link: initialData.link || "",
        otherClubs: initialData.otherClubs || [],
        clubRole: initialData.clubRole || "Member",
        extraLinks: initialData.extraLinks || [],
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        roll: "",
        branch: "CSE",
        year: 1,
        tracks: ["web-app"],
        status: "New",
        why: "",
        link: "",
        otherClubs: [],
        clubRole: "Member",
        extraLinks: [],
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleTrack = (trackId: string) => {
    setForm((prev) => {
      const exists = prev.tracks.includes(trackId);
      if (exists) {
        return { ...prev, tracks: prev.tracks.filter((t) => t !== trackId) };
      } else {
        if (prev.tracks.length >= 3) return prev;
        return { ...prev, tracks: [...prev.tracks, trackId] };
      }
    });
  };

  const toggleClub = (club: string) => {
    setForm((prev) => {
      const exists = prev.otherClubs.includes(club);
      return {
        ...prev,
        otherClubs: exists
          ? prev.otherClubs.filter((c) => c !== club)
          : [...prev.otherClubs, club],
      };
    });
  };

  const addExtraLink = () => {
    setForm((prev) => ({
      ...prev,
      extraLinks: [...prev.extraLinks, { label: "GitHub", url: "" }],
    }));
  };

  const updateExtraLink = (index: number, field: "label" | "url", val: string) => {
    setForm((prev) => {
      const next = [...prev.extraLinks];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, extraLinks: next };
    });
  };

  const removeExtraLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      extraLinks: prev.extraLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Applicant name and email are required.");
      return;
    }
    if (form.tracks.length === 0) {
      setError("Please select at least one recruitment track.");
      return;
    }

    setSaving(true);

    try {
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch("/api/applications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save application.");
      }

      const saved: Application = {
        id: form.id || data.application?.id || `A-${Date.now().toString().slice(-4)}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        roll: form.roll.trim().toUpperCase(),
        branch: form.branch,
        year: Number(form.year) || 1,
        tracks: form.tracks,
        status: form.status,
        submitted: initialData?.submitted || new Date().toISOString().slice(0, 10),
        why: form.why.trim(),
        link: form.link.trim() || undefined,
        otherClubs: form.otherClubs,
        clubRole: form.clubRole,
        extraLinks: form.extraLinks.filter((l) => l.url.trim()),
        reviews: initialData?.reviews || [],
      };

      onSaved(saved);
      onClose();
    } catch (err: unknown) {
      console.error("Save application error:", err);
      const msg = err instanceof Error ? err.message : "Failed to save application.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-foreground/40 text-foreground";
  const labelCls = "text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {isEditing ? `Edit Application: ${form.name}` : "Create New Application"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing
                ? "Update candidate profile fields and review track selections."
                : "Manually add a candidate to the recruitment pipeline."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-medium">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              1. Candidate Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. aarav@svec.edu.in"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Roll Number</label>
                <input
                  type="text"
                  value={form.roll}
                  onChange={(e) => setForm({ ...form, roll: e.target.value })}
                  placeholder="e.g. 23A81A05B4"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9848022338"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Department / Branch</label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className={inputCls}
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Year of Study</label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className={inputCls}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Pipeline Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                  className={inputCls}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Tracks Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              2. Selected Recruitment Tracks (Max 3)
            </h3>

            <div className="grid gap-2 sm:grid-cols-2">
              {ALL_TRACKS.map((t) => {
                const selected = form.tracks.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTrack(t.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs transition cursor-pointer",
                      selected
                        ? "border-primary bg-primary/10 text-foreground font-semibold"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ background: t.color }}
                    />
                    <span className="flex-1 truncate">{t.label}</span>
                    {selected && <Check className="size-3.5 text-primary shrink-0" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Links and Portfolios */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              3. Portfolio & Links
            </h3>

            <div>
              <label className={labelCls}>Primary Portfolio / GitHub / LinkedIn</label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://github.com/username or portfolio"
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Extra Project Links</label>
                <button
                  type="button"
                  onClick={addExtraLink}
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  <Plus className="size-3" /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {form.extraLinks.map((el, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={el.label}
                      onChange={(e) => updateExtraLink(i, "label", e.target.value)}
                      placeholder="Label (e.g. Figma)"
                      className="w-1/3 rounded-xl border border-border bg-background px-3 py-2 text-xs"
                    />
                    <input
                      type="url"
                      value={el.url}
                      onChange={(e) => updateExtraLink(i, "url", e.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraLink(i)}
                      className="p-2 text-muted-foreground hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Other Clubs Involvement */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              4. Other Campus Clubs
            </h3>

            <div className="flex flex-wrap gap-2">
              {CLUBS_LIST.map((club) => {
                const checked = form.otherClubs.includes(club);
                return (
                  <button
                    key={club}
                    type="button"
                    onClick={() => toggleClub(club)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer",
                      checked
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {club}
                  </button>
                );
              })}
            </div>

            <div>
              <label className={labelCls}>Designated Role in Other Clubs</label>
              <select
                value={form.clubRole}
                onChange={(e) => setForm({ ...form, clubRole: e.target.value })}
                className={inputCls}
              >
                <option value="Member">Member</option>
                <option value="Associate">Associate</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          {/* Section 5: Motivation */}
          <div>
            <label className={labelCls}>Motivation / Why Join GDGoC</label>
            <textarea
              rows={3}
              value={form.why}
              onChange={(e) => setForm({ ...form, why: e.target.value })}
              placeholder="Candidate statement of interest..."
              className={cn(inputCls, "resize-none")}
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border bg-card/60 px-6 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className={cn(btnPrimary, "cursor-pointer disabled:pointer-events-none disabled:opacity-60")}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving Application...
              </>
            ) : isEditing ? (
              <>
                <Check className="size-4" strokeWidth={2.5} /> Save Changes
              </>
            ) : (
              <>
                <Plus className="size-4" /> Create Applicant
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationFormModal;
