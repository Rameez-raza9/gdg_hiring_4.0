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

/* ─── High-Fidelity Table Skeleton ────────────────────────── */
export function TableSkeleton({
  rows = 6,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <tbody className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-shimmer">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="size-9 shrink-0 rounded-full bg-muted" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 rounded bg-muted" />
                <div className="h-2.5 w-44 rounded bg-muted/60" />
              </div>
            </div>
          </td>
          <td className="px-3 py-4">
            <div className="flex gap-1.5">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted/70" />
            </div>
          </td>
          <td className="px-3 py-4">
            <div className="h-3.5 w-24 rounded bg-muted" />
          </td>
          <td className="px-3 py-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, d) => (
                <div key={d} className="size-2 rounded-full bg-muted" />
              ))}
            </div>
          </td>
          <td className="px-3 py-4">
            <div className="h-5 w-20 rounded-full bg-muted" />
          </td>
          <td className="px-3 py-4">
            <div className="h-3.5 w-16 rounded bg-muted" />
          </td>
          <td className="px-3 py-4">
            <div className="size-4 rounded bg-muted" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

/* ─── Pagination Component (Google / GDG Design System) ────── */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(validCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validCurrentPage > 3) {
        pages.push("ellipsis");
      }
      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (validCurrentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-3.5 text-xs text-muted-foreground",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div>
          Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
          <span className="font-semibold text-foreground">{endItem}</span> of{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> applications
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
              className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-medium text-foreground outline-none transition focus:border-foreground/40 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(validCurrentPage - 1)}
          disabled={validCurrentPage <= 1}
          aria-label="Previous page"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground transition hover:border-foreground/30 hover:bg-background disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          Previous
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span key={`ell-${idx}`} className="px-1 text-muted-foreground">
                  …
                </span>
              );
            }
            const isActive = p === validCurrentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "grid size-8 place-items-center rounded-lg text-xs font-medium transition cursor-pointer",
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "border border-border bg-card text-foreground hover:border-foreground/30 hover:bg-background"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(validCurrentPage + 1)}
          disabled={validCurrentPage >= totalPages}
          aria-label="Next page"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground transition hover:border-foreground/30 hover:bg-background disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          Next
        </button>
      </nav>
    </div>
  );
}

/* ─── Active Filter Pill ───────────────────────────────────── */
export function FilterPill({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground transition hover:border-foreground/40">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
      <button
        onClick={onRemove}
        aria-label={`Remove filter for ${label}`}
        className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
      >
        <span className="text-xs leading-none">×</span>
      </button>
    </span>
  );
}

