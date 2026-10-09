import { cn } from "@/lib/utils";
import { trackById } from "@/lib/brand";
import { STATUS_COLOR, colorFor, initials, type Status } from "@/lib/admin-data";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-medium tracking-[-0.03em]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-6">
      <div>
        <h2 className="text-base font-medium tracking-tight">{title}</h2>
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  note,
  color,
}: {
  label: string;
  value: string | number;
  note?: string;
  color: string;
}) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-2 rounded-full" style={{ background: color }} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-3 text-4xl font-medium tracking-[-0.03em]">{value}</p>
      {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
    </Card>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const c = STATUS_COLOR[status];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{ borderColor: `${c}55`, background: `${c}14`, color: c === "#8d97b3" ? "#c3cadb" : c }}
    >
      <span className="size-1.5 rounded-full" style={{ background: c }} aria-hidden="true" />
      {status}
    </span>
  );
}

export function Avatar({
  name,
  size = 36,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const c = color ?? colorFor(name);
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-full font-semibold text-slate-900"
      style={{ width: size, height: size, background: c, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}

export function TrackChip({ id }: { id: string }) {
  const t = trackById(id);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
      <span className="size-1.5 rounded-full" style={{ background: t.color }} aria-hidden="true" />
      {t.label}
    </span>
  );
}

/** 5 dots, filled up to the score (supports halves via opacity) */
export function ScoreDots({ score, size = 8 }: { score: number; size?: number }) {
  if (!score) return <span className="text-xs text-muted-foreground">Not reviewed</span>;
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${score.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, score - (n - 1)));
        return (
          <span
            key={n}
            className="rounded-full border border-border"
            style={{
              width: size,
              height: size,
              background: fill > 0 ? `rgba(251,188,4,${0.3 + fill * 0.7})` : "transparent",
              borderColor: fill > 0 ? "transparent" : undefined,
            }}
          />
        );
      })}
      <span className="ml-1 text-xs tabular-nums text-muted-foreground">{score.toFixed(1)}</span>
    </span>
  );
}

export const btnGhost =
  "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:border-foreground/30";
export const btnPrimary =
  "inline-flex items-center gap-2 rounded-xl border border-green-300/60 bg-[#74E38A] px-4 py-2.5 text-sm font-medium text-neutral-950 transition hover:brightness-95";
