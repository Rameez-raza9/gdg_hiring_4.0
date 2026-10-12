"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLOR, type Review, type Status } from "@/lib/admin-data";
import { Card, CardHeader, StatusBadge, btnPrimary } from "@/components/admin/ui";

const CRITERIA = ["Skills and potential", "Motivation", "Communication", "Team fit"];
const DECISIONS: Status[] = ["Shortlisted", "Interview", "Accepted", "Rejected"];

function Rating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} of 5`}
            onClick={() => onChange(n)}
            className="size-5 rounded-full border transition hover:scale-110 cursor-pointer"
            style={{
              background: n <= value ? "#FBBC04" : "transparent",
              borderColor: n <= value ? "#FBBC04" : "#243053",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ReviewPanel({
  applicationId,
  initialStatus,
  existingReviews = [],
  onReviewAdded,
}: {
  applicationId: string;
  initialStatus: Status;
  existingReviews?: Review[];
  onReviewAdded?: (newReview: Review, newStatus?: Status) => void;
}) {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  const [ratings, setRatings] = useState<number[]>(CRITERIA.map(() => 0));
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<Status | null>(null);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPopulated, setIsPopulated] = useState(false);

  useEffect(() => {
    const cachedName = sessionStorage.getItem("gdg_admin_name") || "";
    const cachedEmail = sessionStorage.getItem("gdg_admin_email") || "";
    if (cachedName || cachedEmail) {
      setCurrentUser({
        name: cachedName || "",
        email: cachedEmail || "",
      });
    }

    const userEmail = cachedEmail.toLowerCase().trim();
    const userName = cachedName.toLowerCase().trim();

    // 1. Find if this logged-in person already has a review
    let matchedReview = existingReviews.find((r) => {
      const revEmail = (r.reviewerEmail || "").toLowerCase().trim();
      const revName = (r.reviewer || "").toLowerCase().trim();
      return (
        (userEmail && revEmail === userEmail) ||
        (userName && revName === userName)
      );
    });

    // 2. If no direct match by name/email, but the application was already reviewed,
    // pre-fill the review details so the reviewer sees the candidate's evaluations!
    if (!matchedReview && existingReviews.length > 0) {
      matchedReview = existingReviews[0];
    }

    if (matchedReview) {
      if (
        matchedReview.ratings &&
        matchedReview.ratings.length === 4 &&
        matchedReview.ratings.some((n) => n > 0)
      ) {
        setRatings(matchedReview.ratings);
      } else if (matchedReview.score) {
        setRatings([
          matchedReview.score,
          matchedReview.score,
          matchedReview.score,
          matchedReview.score,
        ]);
      }
      if (matchedReview.note) {
        setNote(matchedReview.note);
      }
      if (matchedReview.decision && DECISIONS.includes(matchedReview.decision as Status)) {
        setDecision(matchedReview.decision as Status);
      } else if (matchedReview.recommend === "Yes") {
        setDecision("Accepted");
      } else if (matchedReview.recommend === "No") {
        setDecision("Rejected");
      }
      setIsPopulated(true);
    }
  }, [existingReviews]);

  const avg = ratings.every(Boolean) ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    const reviewerName = currentUser.name || currentUser.email || "Panel Reviewer";
    const reviewerEmail = currentUser.email || "";

    // If an explicit decision was picked, use it.
    // If no decision was picked, but status is "New", automatically advance to "Interview"!
    const effectiveDecision: Status = decision || (status === "New" ? "Interview" : status);
    setStatus(effectiveDecision);

    const fallbackReview: Review = {
      reviewer: reviewerName,
      reviewerEmail,
      reviewerColor: "#4285F4",
      score: Math.max(1, Math.round(avg || 4)),
      ratings,
      decision: effectiveDecision,
      recommend: (effectiveDecision === "Accepted" ? "Yes" : effectiveDecision === "Rejected" ? "No" : "Maybe") as "Yes" | "Maybe" | "No",
      note: note.trim() || "Candidate evaluated during review cycle.",
      date: new Date().toISOString().slice(0, 10),
    };

    // Instant optimistic update on the parent page
    if (onReviewAdded) {
      onReviewAdded(fallbackReview, effectiveDecision);
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          reviewer: reviewerName,
          reviewerEmail,
          ratings,
          note: note.trim(),
          decision: effectiveDecision,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save review");
      }
      if (data?.review && onReviewAdded) {
        onReviewAdded(data.review, data.status || effectiveDecision);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      console.error("Error saving review:", err);
      const msg = err instanceof Error ? err.message : "Failed to save review";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Your review" action={<StatusBadge status={status} />} />
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/60 px-3.5 py-2 text-xs">
          <span className="text-muted-foreground">Logged in Reviewer:</span>
          <span className="font-medium text-foreground flex items-center gap-1.5 truncate max-w-[240px]">
            <span className="size-2 rounded-full bg-[#4285F4] shrink-0" />
            <span className="truncate">{currentUser.name || currentUser.email || "Panel Reviewer"}</span>
          </span>
        </div>

        {isPopulated && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-400 flex items-center justify-between">
            <span>📝 Candidate evaluation details loaded</span>
            <span className="text-[10px] text-blue-300 font-medium">Editable</span>
          </div>
        )}

        {status === "New" && (
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs text-purple-300">
            💡 Saving this review will automatically advance applicant from <strong>New</strong> to <strong>Interview</strong>.
          </div>
        )}
        {CRITERIA.map((c, i) => (
          <Rating
            key={c}
            label={c}
            value={ratings[i]}
            onChange={(n) => setRatings((r) => r.map((v, j) => (j === i ? n : v)))}
          />
        ))}
        <p className="border-t border-dashed border-border pt-4 text-sm text-muted-foreground">
          Overall:{" "}
          <span className="font-medium text-foreground">
            {avg ? avg.toFixed(1) : "Rate all four to see a score"}
          </span>
        </p>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">Notes for the team</span>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What stood out, and what should the next reviewer check?"
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-foreground/40 text-foreground"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-medium">Decision</p>
          <div className="grid grid-cols-2 gap-2">
            {DECISIONS.map((d) => {
              const on = decision === d;
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDecision(on ? null : d)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition cursor-pointer",
                    on
                      ? "text-foreground font-medium"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                  style={on ? { borderColor: STATUS_COLOR[d], background: `${STATUS_COLOR[d]}1f` } : undefined}
                >
                  <span className="size-2 rounded-full" style={{ background: STATUS_COLOR[d] }} aria-hidden="true" />
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-medium">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={save}
          disabled={saving || saved}
          className={cn(
            btnPrimary,
            "w-full justify-center cursor-pointer disabled:pointer-events-none disabled:opacity-60"
          )}
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving review...
            </>
          ) : saved ? (
            <>
              <Check className="size-4" strokeWidth={3} /> Review saved & updated
            </>
          ) : (
            "Save review"
          )}
        </button>
      </div>
    </Card>
  );
}
