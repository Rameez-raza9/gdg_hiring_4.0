import { G, TRACK_GROUPS } from "@/lib/brand";
import {
  APPLICATIONS, STATUSES, STATUS_COLOR, avgScore, countBy, dailyCounts, fmtDate,
} from "@/lib/admin-data";
import { Card, CardHeader, PageHeader, StatCard } from "@/components/admin/ui";
import { AreaTrend, Donut, Funnel, HBars } from "@/components/admin/charts";

export default function AnalyticsPage() {
  const total = APPLICATIONS.length;
  const daily = dailyCounts();
  const peak = daily.reduce((m, d) => (d.count > m.count ? d : m), daily[0]);
  const reviewed = APPLICATIONS.filter((a) => a.reviews.length > 0);
  const avg = reviewed.reduce((s, a) => s + avgScore(a), 0) / (reviewed.length || 1);
  const accepted = APPLICATIONS.filter((a) => a.status === "Accepted").length;

  const byStatus = countBy(APPLICATIONS, (a) => a.status);

  const funnel = [
    { label: "Applied", value: total, color: G.blue },
    { label: "Reviewed", value: reviewed.length, color: "#669DF6" },
    {
      label: "Shortlisted",
      value: APPLICATIONS.filter((a) => ["Shortlisted", "Interview", "Accepted"].includes(a.status)).length,
      color: G.yellow,
    },
    {
      label: "Interviewed",
      value: APPLICATIONS.filter((a) => ["Interview", "Accepted"].includes(a.status)).length,
      color: "#A142F4",
    },
    { label: "Accepted", value: accepted, color: G.green },
  ];

  const byYear = [1, 2, 3, 4].map((y, i) => ({
    label: `Year ${y}`,
    value: APPLICATIONS.filter((a) => a.year === y).length,
    color: [G.blue, G.red, G.yellow, G.green][i],
  }));

  const branchMap = countBy(APPLICATIONS, (a) => a.branch);
  const byBranch = [...branchMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: [G.blue, G.red, G.yellow, G.green][i % 4] }));

  const trackRows = TRACK_GROUPS.flatMap((g) => g.tracks).map((t) => {
    const apps = APPLICATIONS.filter((a) => a.tracks.includes(t.id));
    const scored = apps.filter((a) => a.reviews.length);
    return {
      track: t,
      apps: apps.length,
      avg: scored.reduce((s, a) => s + avgScore(a), 0) / (scored.length || 1),
      accepted: apps.filter((a) => a.status === "Accepted").length,
    };
  });

  const groupTotals = TRACK_GROUPS.map((g) => ({
    label: g.group,
    value: APPLICATIONS.filter((a) => a.tracks.some((id) => g.tracks.some((t) => t.id === id))).length,
    color: g.group === "Technical" ? G.blue : G.yellow,
  }));

  return (
    <>
      <PageHeader title="Analytics" description="How the current recruitment cycle is performing." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Applications" value={total} note="Since 20 Sep" color={G.blue} />
        <StatCard label="Busiest day" value={peak.count} note={`On ${fmtDate(peak.date)}`} color={G.red} />
        <StatCard label="Average score" value={avg.toFixed(1)} note="Across reviewed applicants" color={G.yellow} />
        <StatCard
          label="Acceptance rate"
          value={`${Math.round((accepted / total) * 100)}%`}
          note={`${accepted} of ${total} applicants`}
          color={G.green}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader title="Applications per day" hint="Daily submissions since the form opened" />
          <div className="p-6">
            <AreaTrend data={daily.map((d) => d.count)} labels={daily.map((d) => fmtDate(d.date))} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Technical vs Non-Technical" hint="Applicants interested in each group" />
          <div className="space-y-6 p-6">
            <HBars items={groupTotals} max={total} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Applicants can choose up to three tracks, so the two groups can add up to more than the total.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Hiring funnel" hint="Share of applicants reaching each stage" />
          <div className="p-6">
            <Funnel steps={funnel} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Status split" />
          <div className="p-6">
            <Donut
              center={total}
              centerLabel="applicants"
              items={STATUSES.map((s) => ({ label: s, value: byStatus.get(s) ?? 0, color: STATUS_COLOR[s] }))}
            />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="By year of study" />
          <div className="p-6"><HBars items={byYear} /></div>
        </Card>
        <Card>
          <CardHeader title="By branch" />
          <div className="p-6"><HBars items={byBranch} /></div>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <CardHeader title="Track performance" hint="Interest, quality and outcomes per track" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-y border-border text-xs text-muted-foreground">
                <th className="px-6 py-3 font-medium">Track</th>
                <th className="px-3 py-3 font-medium">Group</th>
                <th className="px-3 py-3 text-right font-medium">Applicants</th>
                <th className="px-3 py-3 text-right font-medium">Avg score</th>
                <th className="px-6 py-3 text-right font-medium">Accepted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trackRows.map(({ track, apps, avg: a, accepted: acc }) => (
                <tr key={track.id} className="transition-colors hover:bg-background/50">
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full" style={{ background: track.color }} aria-hidden="true" />
                      {track.label}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground">{track.group}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{apps}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{a ? a.toFixed(1) : "-"}</td>
                  <td className="px-6 py-3.5 text-right tabular-nums">{acc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
