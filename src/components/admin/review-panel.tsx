"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLOR, type Status } from "@/lib/admin-data";
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
            className="size-5 rounded-full border transition hover:scale-110"
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

export default function ReviewPanel({ initialStatus }: { initialStatus: Status }) {
  const [ratings, setRatings] = useState<number[]>(CRITERIA.map(() => 0));
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<Status | null>(null);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saved, setSaved] = useState(false);

  const avg = ratings.every(Boolean) ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const save = () => {
    // TODO: POST the review to your API
    if (decision) setStatus(decision);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <Card>
      <CardHeader title="Your review" action={<StatusBadge status={status} />} />
      <div className="space-y-5 p-6">
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
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-foreground/40"
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
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition",
                    on
                      ? "text-foreground"
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

        <button type="button" onClick={save} className={cn(btnPrimary, "w-full justify-center")}>
          {saved ? (
            <>
              <Check className="size-4" strokeWidth={3} /> Review saved
            </>
          ) : (
            "Save review"
          )}
        </button>
      </div>
    </Card>
  );
}
