import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { colorFor, formatToIST, invalidateAdminCache, type Application, type Review, type Status } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Parallel execute indexed queries for high speed (sub-250ms)
    const [appsRes, revRes] = await Promise.all([
      turso.execute("SELECT * FROM applications ORDER BY submitted DESC, created_at DESC"),
      turso.execute("SELECT * FROM reviews ORDER BY created_at DESC"),
    ]);

    const reviewsByApp: Record<string, Review[]> = {};
    for (const r of revRes.rows) {
      const appId = String(r.application_id);
      if (!reviewsByApp[appId]) reviewsByApp[appId] = [];
      const createdAtRaw = String(r.created_at || "2026-10-09 00:00:00");
      reviewsByApp[appId].push({
        reviewer: String(r.reviewer || "Reviewer"),
        reviewerColor: colorFor(String(r.reviewer || "R")),
        score: Math.round(Number(r.average_score || 4)),
        recommend: (String(r.decision || "Yes") as "Yes" | "Maybe" | "No"),
        note: String(r.note || ""),
        date: formatToIST(createdAtRaw),
        createdAt: createdAtRaw,
        timeIST: formatToIST(createdAtRaw),
      });
    }

    const rawApplications: Application[] = appsRes.rows.map((r) => {
      let tracks: string[] = [];
      try {
        tracks = JSON.parse(String(r.tracks || "[]"));
      } catch {
        tracks = [];
      }

      let otherClubs: string[] = [];
      try {
        otherClubs = JSON.parse(String(r.other_clubs || "[]"));
      } catch {
        otherClubs = [];
      }

      let extraLinks: { label: string; url: string }[] = [];
      try {
        extraLinks = JSON.parse(String(r.extra_links || "[]"));
      } catch {
        extraLinks = [];
      }

      return {
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        phone: String(r.phone || ""),
        roll: String(r.roll || "").trim().toUpperCase(),
        branch: String(r.branch || "General"),
        year: Number(r.year || 1),
        tracks,
        status: (String(r.status || "New") as Status),
        submitted: String(r.submitted || "2026-10-09"),
        why: String(r.why || ""),
        link: r.link ? String(r.link) : undefined,
        otherClubs,
        clubRole: r.club_role ? String(r.club_role) : undefined,
        extraLinks,
        reviews: reviewsByApp[String(r.id)] || [],
      };
    });

    // Deduplicate strictly by UNIQUE roll number
    const uniqueMap = new Map<string, Application>();
    for (const a of rawApplications) {
      const rollKey = a.roll ? a.roll.trim().toUpperCase() : a.id;
      if (!uniqueMap.has(rollKey)) {
        uniqueMap.set(rollKey, { ...a });
      } else {
        const existing = uniqueMap.get(rollKey)!;
        // Promote status if one of the duplicates was moved forward
        if (existing.status === "New" && a.status !== "New") {
          existing.status = a.status;
        }
        // Merge reviews from duplicate entries so feedback is never lost
        if (a.reviews.length > 0) {
          const revMap = new Map<string, Review>();
          for (const rev of [...existing.reviews, ...a.reviews]) {
            const rk = `${rev.reviewer}-${rev.createdAt || rev.date}`;
            if (!revMap.has(rk)) revMap.set(rk, rev);
          }
          existing.reviews = Array.from(revMap.values());
        }
        // Keep most complete fields
        if (!existing.phone && a.phone) existing.phone = a.phone;
        if (!existing.link && a.link) existing.link = a.link;
        if ((!existing.extraLinks || existing.extraLinks.length === 0) && a.extraLinks?.length) {
          existing.extraLinks = a.extraLinks;
        }
      }
    }

    const applications = Array.from(uniqueMap.values());

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

// CREATE new application
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone = "",
      roll = "",
      branch = "CSE",
      year = 1,
      tracks = ["web-app"],
      why = "",
      link = "",
      otherClubs = [],
      clubRole = "Member",
      extraLinks = [],
      status = "New",
    } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const id = body.id || `A-${Math.floor(1000 + Math.random() * 9000)}`;
    const submitted = body.submitted || new Date().toISOString().slice(0, 10);

    await turso.execute({
      sql: `
        INSERT INTO applications (
          id, name, email, phone, roll, branch, year, tracks, why, link,
          other_clubs, club_role, extra_links, status, submitted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        roll.trim().toUpperCase(),
        branch.trim(),
        String(year),
        Array.isArray(tracks) ? JSON.stringify(tracks) : String(tracks),
        why.trim(),
        link ? link.trim() : null,
        Array.isArray(otherClubs) ? JSON.stringify(otherClubs) : String(otherClubs),
        clubRole ? clubRole.trim() : null,
        Array.isArray(extraLinks) ? JSON.stringify(extraLinks) : String(extraLinks),
        status,
        submitted,
      ],
    });

    return NextResponse.json({
      ok: true,
      message: "Application created successfully",
      application: {
        id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        roll: roll.trim().toUpperCase(),
        branch: branch.trim(),
        year: Number(year) || 1,
        tracks: Array.isArray(tracks) ? tracks : [],
        why: why.trim(),
        link: link ? link.trim() : undefined,
        otherClubs: Array.isArray(otherClubs) ? otherClubs : [],
        clubRole: clubRole || undefined,
        extraLinks: Array.isArray(extraLinks) ? extraLinks : [],
        status: status as Status,
        submitted,
        reviews: [],
      },
    });
  } catch (error) {
    console.error("Failed to create application in Turso:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

// UPDATE application fields
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const setClauses: string[] = [];
    const args: (string | number | null)[] = [];

    if (body.name !== undefined) {
      setClauses.push("name = ?");
      args.push(String(body.name).trim());
    }
    if (body.email !== undefined) {
      setClauses.push("email = ?");
      args.push(String(body.email).trim().toLowerCase());
    }
    if (body.phone !== undefined) {
      setClauses.push("phone = ?");
      args.push(String(body.phone).trim());
    }
    if (body.roll !== undefined) {
      setClauses.push("roll = ?");
      args.push(String(body.roll).trim().toUpperCase());
    }
    if (body.branch !== undefined) {
      setClauses.push("branch = ?");
      args.push(String(body.branch).trim());
    }
    if (body.year !== undefined) {
      setClauses.push("year = ?");
      args.push(String(body.year));
    }
    if (body.tracks !== undefined) {
      setClauses.push("tracks = ?");
      args.push(Array.isArray(body.tracks) ? JSON.stringify(body.tracks) : String(body.tracks));
    }
    if (body.status !== undefined) {
      setClauses.push("status = ?");
      args.push(String(body.status).trim());
    }
    if (body.why !== undefined) {
      setClauses.push("why = ?");
      args.push(String(body.why).trim());
    }
    if (body.link !== undefined) {
      setClauses.push("link = ?");
      args.push(body.link ? String(body.link).trim() : null);
    }
    if (body.otherClubs !== undefined) {
      setClauses.push("other_clubs = ?");
      args.push(Array.isArray(body.otherClubs) ? JSON.stringify(body.otherClubs) : String(body.otherClubs));
    }
    if (body.clubRole !== undefined) {
      setClauses.push("club_role = ?");
      args.push(body.clubRole ? String(body.clubRole).trim() : null);
    }
    if (body.extraLinks !== undefined) {
      setClauses.push("extra_links = ?");
      args.push(Array.isArray(body.extraLinks) ? JSON.stringify(body.extraLinks) : String(body.extraLinks));
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
    }

    args.push(id);

    await turso.execute({
      sql: `UPDATE applications SET ${setClauses.join(", ")} WHERE id = ?`,
      args,
    });

    // If panel member updater details are provided, record review/activity log in Turso
    if (body.updaterName) {
      try {
        await turso.execute({
          sql: `
            INSERT INTO reviews (
              application_id, reviewer, reviewer_email,
              rating_skills, rating_motivation, rating_communication, rating_fit,
              average_score, note, decision, created_at
            ) VALUES (?, ?, ?, 5, 5, 5, 5, 5.0, ?, ?, datetime('now'))
          `,
          args: [
            id,
            String(body.updaterName).trim(),
            String(body.updaterEmail || "").trim(),
            body.updateNote
              ? String(body.updateNote).trim()
              : `Application details updated (${body.status ? `Status: ${body.status}` : "Profile fields updated"})`,
            body.status ? String(body.status).trim() : "In review",
          ],
        });
      } catch (logErr) {
        console.error("Error logging updater review:", logErr);
      }
    }

    invalidateAdminCache();

    return NextResponse.json({
      ok: true,
      message: "Application updated successfully",
      updatedId: id,
    });
  } catch (error) {
    console.error("Failed to update application in Turso:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

// DELETE application (Supports both query parameter ?id=... and JSON body)
export async function DELETE(req: Request) {
  try {
    let id: string | null = null;
    const url = new URL(req.url);
    id = url.searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id || null;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    // Check application roll number to clean duplicate records for this candidate
    const appRes = await turso.execute({
      sql: "SELECT id, roll FROM applications WHERE id = ?",
      args: [id],
    });

    const roll = appRes.rows[0]?.roll ? String(appRes.rows[0].roll).trim().toUpperCase() : null;

    if (roll) {
      const allMatching = await turso.execute({
        sql: "SELECT id FROM applications WHERE UPPER(TRIM(roll)) = ?",
        args: [roll],
      });
      for (const row of allMatching.rows) {
        const rowId = String(row.id);
        await Promise.all([
          turso.execute({ sql: "DELETE FROM applications WHERE id = ?", args: [rowId] }),
          turso.execute({ sql: "DELETE FROM reviews WHERE application_id = ?", args: [rowId] }),
        ]);
      }
    } else {
      await Promise.all([
        turso.execute({ sql: "DELETE FROM applications WHERE id = ?", args: [id] }),
        turso.execute({ sql: "DELETE FROM reviews WHERE application_id = ?", args: [id] }),
      ]);
    }

    invalidateAdminCache();

    return NextResponse.json({
      ok: true,
      message: "Application deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Failed to delete application from Turso:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
