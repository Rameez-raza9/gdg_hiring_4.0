"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import { type Application, type Review, type Status, avgScore, fmtDate } from "@/lib/admin-data";
import { Avatar, Card, CardHeader, ScoreDots, StatusBadge, TrackChip } from "@/components/admin/ui";
import ReviewPanel from "./review-panel";

export default function ApplicationDetailClient({
  initialApplication,
}: {
  initialApplication: Application;
}) {
  const [app, setApp] = useState<Application>(initialApplication);

  const handleReviewAdded = (newReview: Review, newStatus?: Status) => {
    setApp((prev) => {
      // Replace existing review by same reviewer or append
      const filtered = prev.reviews.filter((r) => r.reviewer !== newReview.reviewer);
      const updatedReviews = [newReview, ...filtered];
      return {
        ...prev,
        status: newStatus || prev.status,
        reviews: updatedReviews,
      };
    });
  };

  const score = avgScore(app);
  const timeline = [
    { label: "Application submitted", date: app.submitted },
    ...app.reviews.map((r) => ({ label: `Reviewed by ${r.reviewer}`, date: r.date })),
  ].sort((x, y) => x.date.localeCompare(y.date));

  const facts = [
    ["Roll number", app.roll],
    ["Branch", app.branch],
    ["Year", `Year ${app.year}`],
    ["Applied", fmtDate(app.submitted)],
  ];

  return (
    <>
      <Link
        href="/admin/applications"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All applications
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center gap-5">
        <Avatar name={app.name} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-medium tracking-[-0.03em]">{app.name}</h1>
            <StatusBadge status={app.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Mail className="size-3.5" />{app.email}</span>
            <span className="flex items-center gap-2"><Phone className="size-3.5" />{app.phone}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs text-muted-foreground">Average score</p>
          <ScoreDots score={score} size={10} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader title="Profile" />
            <dl className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-1.5 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Applied for" hint="In order of preference" />
            <div className="flex flex-wrap gap-3 p-6">
              {app.tracks.map((t, i) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">{i + 1}.</span>
                  <TrackChip id={t} />
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Why they want to join" />
            <div className="space-y-5 p-6">
              <p className="max-w-prose leading-relaxed text-foreground/90">{app.why}</p>
              
              {/* Extra Links & Portfolio */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {app.link && (
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium transition hover:border-foreground/40 text-foreground"
                  >
                    <ExternalLink className="size-3.5 text-blue-600" /> Primary Portfolio / Link
                  </a>
                )}
                {app.extraLinks && app.extraLinks.map((el, i) => (
                  <a
                    key={i}
                    href={el.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium transition hover:border-foreground/40 text-foreground"
                  >
                    <ExternalLink className="size-3.5 text-blue-600" /> {el.label}: {el.url.replace(/^https?:\/\//, "").slice(0, 24)}...
                  </a>
                ))}
              </div>
            </div>
          </Card>

          {/* College Clubs & Involvement */}
          {(app.otherClubs && app.otherClubs.length > 0) && (
            <Card>
              <CardHeader title="Campus Club Memberships & Roles" />
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {app.otherClubs.map((club) => (
                    <span key={club} className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-800">
                      {club}
                    </span>
                  ))}
                </div>
                {app.clubRole && (
                  <p className="text-xs text-muted-foreground pt-1">
                    Designated role in other clubs: <strong className="text-foreground">{app.clubRole}</strong>
                  </p>
                )}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title={`Team reviews (${app.reviews.length})`} />
            {app.reviews.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No one has reviewed this application yet. Be the first to evaluate!
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-border">
                {app.reviews.map((r, idx) => (
                  <li key={`${r.reviewer}-${idx}`} className="flex gap-4 p-6 transition-all duration-300">
                    <Avatar name={r.reviewer} color={r.reviewerColor} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium">{r.reviewer}</p>
                        <ScoreDots score={r.score} size={7} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.note}</p>
                      <p className="mt-2.5 text-xs text-muted-foreground/80">
                        {fmtDate(r.date)} · Recommends:{" "}
                        <span className="text-foreground font-medium">{r.recommend}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <ReviewPanel
            applicationId={app.id}
            initialStatus={app.status}
            onReviewAdded={handleReviewAdded}
          />

          <Card>
            <CardHeader title="Activity" />
            <ol className="p-6">
              {timeline.map((t, i) => (
                <li key={`${t.label}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < timeline.length - 1 && (
                    <span
                      className="absolute left-[5px] top-4 h-full border-l border-dashed border-border"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative mt-1.5 size-[11px] shrink-0 rounded-full bg-[#4285F4]" aria-hidden="true" />
                  <div>
                    <p className="text-sm">{t.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{fmtDate(t.date)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
