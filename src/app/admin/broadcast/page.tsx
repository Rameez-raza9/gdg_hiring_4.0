"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Send, TriangleAlert, Loader2, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { APPLICATIONS, STATUS_COLOR, type Application, type Status } from "@/lib/admin-data";
import { G } from "@/lib/brand";
import { Card, CardHeader, PageHeader, btnGhost, btnPrimary } from "@/components/admin/ui";

type Audience = "active" | Status | "custom";

const AUDIENCES: { id: Audience; label: string; color: string }[] = [
  { id: "active", label: "All active", color: G.blue },
  { id: "Shortlisted", label: "Shortlisted", color: STATUS_COLOR.Shortlisted },
  { id: "Interview", label: "Interview", color: STATUS_COLOR.Interview },
  { id: "Accepted", label: "Accepted", color: STATUS_COLOR.Accepted },
  { id: "In review", label: "In review", color: STATUS_COLOR["In review"] },
  { id: "New", label: "New", color: STATUS_COLOR.New },
  { id: "custom", label: "Custom list", color: G.red },
];

const input =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 [color-scheme:dark]";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

type Result = { total: number; sent: number; failed: { email: string; error: string }[]; ms: number };

export default function BroadcastPage() {
  const [apps, setApps] = useState<Application[]>(APPLICATIONS);
  const [adminEmail, setAdminEmail] = useState("");
  const [event, setEvent] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    mapUrl: "",
    whatsappUrl: "",
    note: "Hi {name},\n\nPlease arrive 10 minutes early and carry your college ID.",
  });
  const [audience, setAudience] = useState<Audience>("Shortlisted");
  const [customEmails, setCustomEmails] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState<null | "test" | "send">(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ kind: "test" | "send"; data: Result; targetEmail?: string } | null>(null);

  // Auto-detect logged-in admin email & pre-fill test email
  useEffect(() => {
    const cachedEmail = sessionStorage.getItem("gdg_admin_email");
    if (cachedEmail) {
      setAdminEmail(cachedEmail);
      setTestEmail((prev) => prev || cachedEmail);
    }
  }, []);

  // Load live applications from database
  useEffect(() => {
    let active = true;
    async function loadApps() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.applications) && data.applications.length > 0) {
            setApps(data.applications);
          }
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    }
    loadApps();
    return () => {
      active = false;
    };
  }, []);

  const set = (k: keyof typeof event, v: string) => {
    setEvent((e) => ({ ...e, [k]: v }));
    setConfirming(false);
  };

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    m.set("active", apps.filter((a) => a.status !== "Rejected").length);
    apps.forEach((a) => m.set(a.status, (m.get(a.status) ?? 0) + 1));
    return m;
  }, [apps]);

  const customList = useMemo(
    () => [...new Set(customEmails.split(/[\s,;]+/).filter((e) => /^\S+@\S+\.\S+$/.test(e)))],
    [customEmails],
  );
  const recipientCount = audience === "custom" ? customList.length : (counts.get(audience) ?? 0);

  // Live preview (debounced) with placeholders for empty fields
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "preview",
            event: {
              ...event,
              title: event.title || "Your event title",
              date: event.date || "2026-10-18",
              startTime: event.startTime || "10:00",
              venue: event.venue || "Venue name, block and room",
              endTime: event.endTime || undefined,
              mapUrl: event.mapUrl || undefined,
              whatsappUrl: event.whatsappUrl || undefined,
            },
          }),
        });
        const json = await res.json();
        if (json.html) setHtml(json.html);
      } catch {}
    }, 350);
    return () => clearTimeout(t);
  }, [event]);

  const call = async (action: "test" | "send") => {
    setError("");
    setResult(null);
    setBusy(action);
    const target = testEmail.trim();

    try {
      const activeAdminEmail =
        adminEmail ||
        (typeof window !== "undefined" ? sessionStorage.getItem("gdg_admin_email") : "") ||
        "vinaysiddha19@gmail.com";

      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": activeAdminEmail,
        },
        body: JSON.stringify({
          action,
          event: {
            ...event,
            endTime: event.endTime || undefined,
            mapUrl: event.mapUrl || undefined,
            whatsappUrl: event.whatsappUrl || undefined,
          },
          audience,
          customEmails,
          testEmail: target,
          adminEmail: activeAdminEmail,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to send email. Check SMTP server configuration.");
      } else if (json.sent === 0 && json.failed?.length > 0) {
        setError(json.failed[0]?.error || "Failed to deliver email.");
      } else {
        setResult({ kind: action, data: json, targetEmail: target });
      }
    } catch {
      setError("Network or server connection error. Please try again.");
    } finally {
      setBusy(null);
      setConfirming(false);
    }
  };

  const ready = Boolean(event.title && event.date && event.startTime && event.venue);

  return (
    <>
      <PageHeader
        title="Broadcast"
        description="Email the WhatsApp group link, date, time and venue to applicants in one go."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,620px)]">
        {/* Form */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Event details" />
            <div className="space-y-5 p-6">
              <Field label="Event title">
                <input className={input} value={event.title} onChange={(e) => set("title", e.target.value)} placeholder="Round 1 interviews" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Date">
                  <input type="date" className={input} value={event.date} onChange={(e) => set("date", e.target.value)} />
                </Field>
                <Field label="Starts">
                  <input type="time" className={input} value={event.startTime} onChange={(e) => set("startTime", e.target.value)} />
                </Field>
                <Field label="Ends" hint="optional">
                  <input type="time" className={input} value={event.endTime} onChange={(e) => set("endTime", e.target.value)} />
                </Field>
              </div>
              <Field label="Venue">
                <input className={input} value={event.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Seminar Hall, Block B" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Google Maps link" hint="optional">
                  <input className={input} value={event.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} placeholder="https://maps.app.goo.gl/..." />
                </Field>
                <Field label="WhatsApp group link" hint="blank = default">
                  <input className={input} value={event.whatsappUrl} onChange={(e) => set("whatsappUrl", e.target.value)} placeholder="https://chat.whatsapp.com/..." />
                </Field>
              </div>
              <Field label="Message" hint="{name} becomes their first name">
                <textarea rows={5} className={cn(input, "resize-none")} value={event.note} onChange={(e) => set("note", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Who gets it" hint="Each person receives their own personalised email." />
            <div className="space-y-5 p-6">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Audience">
                {AUDIENCES.map((a) => {
                  const on = audience === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => {
                        setAudience(a.id);
                        setConfirming(false);
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition",
                        on
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                      )}
                    >
                      <span className="size-2 rounded-full" style={{ background: a.color }} aria-hidden="true" />
                      {a.label}
                      {a.id !== "custom" && (
                        <span className={cn("text-xs tabular-nums", on ? "opacity-70" : "text-muted-foreground/70")}>
                          {counts.get(a.id) ?? 0}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {audience === "custom" && (
                <Field label="Email addresses" hint="separate with commas, spaces or new lines">
                  <textarea
                    rows={4}
                    className={cn(input, "resize-none")}
                    value={customEmails}
                    onChange={(e) => setCustomEmails(e.target.value)}
                    placeholder="a@example.com, b@example.com"
                  />
                </Field>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Send" />
            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[14rem] flex-1">
                  <Field label="Send a test first">
                    <input
                      type="email"
                      className={input}
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  className={cn(btnGhost, "cursor-pointer disabled:pointer-events-none disabled:opacity-50")}
                  disabled={!testEmail.trim() || busy !== null}
                  onClick={() => call("test")}
                >
                  {busy === "test" ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-3.5 animate-spin text-primary" />
                      <span>Sending test...</span>
                    </span>
                  ) : (
                    "Send test"
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-border pt-5">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{recipientCount}</span>{" "}
                  {recipientCount === 1 ? "person" : "people"} will receive this.
                </p>
                {confirming ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busy !== null}
                      className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 cursor-pointer"
                      onClick={() => setConfirming(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={cn(btnPrimary, "cursor-pointer disabled:pointer-events-none disabled:opacity-50")}
                      disabled={busy !== null}
                      onClick={() => call("send")}
                    >
                      {busy === "send" ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          <span>Sending to {recipientCount}...</span>
                        </span>
                      ) : (
                        <>
                          <Send className="size-4" />
                          <span>Yes, send to {recipientCount}</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={cn(btnPrimary, "cursor-pointer disabled:pointer-events-none disabled:opacity-50")}
                    disabled={!ready || recipientCount === 0 || busy !== null}
                    onClick={() => setConfirming(true)}
                  >
                    <Send className="size-4" />
                    <span>Send to {recipientCount}</span>
                  </button>
                )}
              </div>

              {!ready && (
                <p className="text-xs text-muted-foreground">Add a title, date, start time and venue to enable bulk broadcast.</p>
              )}

              {error && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" />
                  <div className="flex-1">
                    <p className="font-medium text-red-300">Email delivery failed</p>
                    <p className="text-xs text-red-400/90 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {result && (
                <div role="status" className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3.5 text-sm text-green-300">
                  <p className="flex items-center gap-2 font-medium">
                    {result.kind === "test" ? (
                      <MailCheck className="size-4.5 text-green-400 shrink-0" />
                    ) : (
                      <Check className="size-4 text-green-400 shrink-0" strokeWidth={3} />
                    )}
                    <span>
                      {result.kind === "test"
                        ? `Test email delivered to ${result.targetEmail || "inbox"}!`
                        : `Sent ${result.data.sent} of ${result.data.total} emails successfully`}
                    </span>
                    <span className="font-normal opacity-75 text-xs">({(result.data.ms / 1000).toFixed(1)}s)</span>
                  </p>
                  {result.data.failed.length > 0 && (
                    <details className="mt-2.5 text-red-300">
                      <summary className="cursor-pointer text-xs font-semibold">{result.data.failed.length} delivery failures</summary>
                      <ul className="mt-2 space-y-1 text-xs">
                        {result.data.failed.map((f) => (
                          <li key={f.email} className="font-mono">{f.email}: {f.error}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Live preview */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <Card className="overflow-hidden">
            <CardHeader title="Live preview" hint="Images are animated in the real email." />
            <div className="p-4 pt-5">
              <iframe
                title="Email preview"
                srcDoc={html}
                className="h-[760px] w-full rounded-xl border border-border bg-[#f1f5f9]"
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
