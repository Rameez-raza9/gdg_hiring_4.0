// Server-safe, dependency-free charts (plain SVG / HTML).

export function AreaTrend({
  data,
  labels,
  color = "#4285F4",
  height = 200,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) {
  const W = 640;
  const H = height;
  const pad = { t: 16, r: 12, b: 28, l: 28 };
  const max = Math.max(...data, 1);
  const niceMax = Math.ceil(max / 2) * 2 || 2;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1);
  const y = (v: number) => pad.t + (1 - v / niceMax) * (H - pad.t - pad.b);

  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const ticks = [0, niceMax / 2, niceMax];
  const id = `grad-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Applications per day">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray="2 5" />
          <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#64748b">{t}</text>
        </g>
      ))}
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#ffffff" stroke={color} strokeWidth="2" />
      ))}
      {labels.map((l, i) =>
        i % 3 === 0 ? (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#8d97b3">{l}</text>
        ) : null,
      )}
    </svg>
  );
}

export type BarItem = { label: string; value: number; color: string; sub?: string };

export function HBars({ items, max }: { items: BarItem[]; max?: number }) {
  const m = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-4">
      {items.map((i) => (
        <li key={i.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2 shrink-0 rounded-full" style={{ background: i.color }} aria-hidden="true" />
              <span className="truncate">{i.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {i.value}
              {i.sub && <span className="ml-2 text-xs">{i.sub}</span>}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full" style={{ width: `${(i.value / m) * 100}%`, background: i.color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Donut({
  items,
  center,
  centerLabel,
}: {
  items: { label: string; value: number; color: string }[];
  center: string | number;
  centerLabel: string;
}) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const R = 52;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="relative size-40 shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="img" aria-label={centerLabel}>
          <circle cx="70" cy="70" r={R} fill="none" stroke="#151d33" strokeWidth="14" />
          {items.map((i) => {
            const len = (i.value / total) * C;
            const el = (
              <circle
                key={i.label}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={i.color}
                strokeWidth="14"
                strokeDasharray={`${Math.max(len - 3, 0)} ${C - Math.max(len - 3, 0)}`}
                strokeDashoffset={-acc}
                strokeLinecap="round"
              />
            );
            acc += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-3xl font-medium tracking-tight">{center}</p>
            <p className="text-xs text-muted-foreground">{centerLabel}</p>
          </div>
        </div>
      </div>
      <ul className="min-w-[10rem] flex-1 space-y-2.5 text-sm">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: i.color }} aria-hidden="true" />
              {i.label}
            </span>
            <span className="tabular-nums text-muted-foreground">{i.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number; color: string }[] }) {
  const top = steps[0]?.value || 1;
  return (
    <ul className="space-y-3">
      {steps.map((s, i) => {
        const pct = Math.round((s.value / top) * 100);
        const prev = i === 0 ? null : steps[i - 1].value;
        return (
          <li key={s.label} className="flex items-center gap-4">
            <span className="w-24 shrink-0 text-sm text-muted-foreground">{s.label}</span>
            <div className="h-9 flex-1 overflow-hidden rounded-lg bg-background">
              <div
                className="flex h-full items-center rounded-lg px-3 text-sm font-semibold text-slate-900"
                style={{ width: `${Math.max(pct, 8)}%`, background: s.color }}
              >
                {s.value}
              </div>
            </div>
            <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {prev ? `${Math.round((s.value / prev) * 100)}%` : "100%"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function StackedBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 gap-1 overflow-hidden rounded-full">
        {items.map((i) => (
          <div
            key={i.label}
            title={`${i.label}: ${i.value}`}
            className="h-full rounded-full"
            style={{ width: `${(i.value / total) * 100}%`, background: i.color }}
          />
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: i.color }} aria-hidden="true" />
              {i.label}
            </span>
            <span className="tabular-nums">{i.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
