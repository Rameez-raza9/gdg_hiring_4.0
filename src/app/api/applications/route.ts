import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { colorFor, type Application, type Review, type Status } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Parallel execute indexed queries for high speed (sub-250ms)
    const [appsRes, revRes] = await Promise.all([
      turso.execute("SELECT * FROM applications ORDER BY submitted DESC"),
      turso.execute("SELECT * FROM reviews ORDER BY created_at DESC"),
    ]);

    const reviewsByApp: Record<string, Review[]> = {};
    for (const r of revRes.rows) {
      const appId = String(r.application_id);
      if (!reviewsByApp[appId]) reviewsByApp[appId] = [];
      reviewsByApp[appId].push({
        reviewer: String(r.reviewer || "Reviewer"),
        reviewerColor: colorFor(String(r.reviewer || "R")),
        score: Math.round(Number(r.average_score || 4)),
        recommend: (String(r.decision || "Yes") as "Yes" | "Maybe" | "No"),
        note: String(r.note || ""),
        date: String(r.created_at || "2026-10-09").slice(0, 10),
      });
    }

    const applications: Application[] = appsRes.rows.map((r) => {
      let tracks: string[] = [];
      try {
        tracks = JSON.parse(String(r.tracks || "[]"));
      } catch {
        tracks = [];
      }

      return {
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        phone: String(r.phone || ""),
        roll: String(r.roll || ""),
        branch: String(r.branch || "General"),
        year: Number(r.year || 1),
        tracks,
        status: (String(r.status || "New") as Status),
        submitted: String(r.submitted || "2026-10-09"),
        why: String(r.why || ""),
        link: r.link ? String(r.link) : undefined,
        reviews: reviewsByApp[String(r.id)] || [],
      };
    });

    return NextResponse.json(
      { applications },
      {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch applications from Turso:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
