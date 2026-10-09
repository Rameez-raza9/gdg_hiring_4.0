import { STATS } from "@/lib/constants";

export default function StatsRow() {
  return (
    <div className="mt-[60px] flex items-start border-b border-[var(--border-color)] pb-5">
      {STATS.map((stat, i) => (
        <div key={stat.label} className="flex items-start">
          {i > 0 && (
            <div
              className="mx-6 h-12 w-px bg-[var(--border-color)]"
              aria-hidden="true"
            />
          )}
          <div>
            <p className="text-[36px] font-semibold leading-tight tracking-tight text-text-primary">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[14px] text-text-secondary">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
