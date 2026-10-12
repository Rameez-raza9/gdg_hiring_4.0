import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

function deriveSectionFromRoll(roll: string): string {
  const clean = roll.trim().toUpperCase();
  if (clean.length < 10) return "A";
  const last2 = clean.slice(-2);
  const lastChar = last2[0];
  const num = parseInt(last2, 10);
  if (!isNaN(num)) {
    if (num <= 65) return "A";
    return "B";
  }
  if (["A", "B", "C"].includes(lastChar)) return "B";
  if (["D", "E", "F", "G", "H"].includes(lastChar)) return "C";
  if (["J", "K", "L", "M", "N", "P", "Q", "R"].includes(lastChar)) return "D";
  return "A";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId") || "EV-RECRUIT";

  try {
    // Ensure Recruitment Drive event exists in events table
    await turso.execute({
      sql: `
        INSERT OR IGNORE INTO events (id, title, date, venue, track)
        VALUES ('EV-RECRUIT', 'GDGoC SVEC 4.0 Recruitment Drive & Assessment', '2026-10-18', 'SVEC Campus Seminar Halls & Labs', 'All Tracks')
      `,
    });

    const eventsRes = await turso.execute("SELECT * FROM events ORDER BY (id = 'EV-RECRUIT') DESC, date DESC");

    let attRes = await turso.execute({
      sql: `
        SELECT * FROM attendance
        WHERE event_id = ?
        GROUP BY UPPER(TRIM(roll_number))
        ORDER BY branch ASC, section ASC, roll_number ASC
      `,
      args: [eventId],
    });

    // If attendance table is empty for this event, auto-populate from the 300+ applications
    if (attRes.rows.length === 0) {
      const appsRes = await turso.execute(
        "SELECT id, name, roll, branch, status FROM applications ORDER BY branch ASC, roll ASC"
      );

      if (appsRes.rows.length > 0) {
        for (const app of appsRes.rows) {
          const roll = String(app.roll || app.id).trim().toUpperCase();
          const name = String(app.name || "Applicant").trim();
          const branch = String(app.branch || "General").trim();
          const section = deriveSectionFromRoll(roll);
          const initialStatus =
            app.status === "Accepted" || app.status === "Interview" ? "Present" : "Absent";

          await turso.execute({
            sql: `
              INSERT OR IGNORE INTO attendance (
                event_id, application_id, student_name, roll_number, branch, section, status, marked_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `,
            args: [eventId, String(app.id), name, roll, branch, section, initialStatus],
          });
        }

        // Re-query newly synced attendance records
        attRes = await turso.execute({
          sql: `
            SELECT * FROM attendance
            WHERE event_id = ?
            GROUP BY UPPER(TRIM(roll_number))
            ORDER BY branch ASC, section ASC, roll_number ASC
          `,
          args: [eventId],
        });
      }
    }

    return NextResponse.json({
      events: eventsRes.rows,
      attendance: attRes.rows,
    });
  } catch (error) {
    console.error("Attendance API fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance data" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      eventId = "EV-RECRUIT",
      action,
      studentName,
      rollNumber,
      branch,
      section = "A",
      status = "Present",
    } = data;

    // ACTION: Explicit sync from applications table
    if (action === "sync_from_applications") {
      const appsRes = await turso.execute(
        "SELECT id, name, roll, branch, status FROM applications ORDER BY branch ASC, roll ASC"
      );

      const batchStatements = appsRes.rows.map((app: any) => {
        const roll = String(app.roll || app.id).trim().toUpperCase();
        const name = String(app.name || "Applicant").trim();
        const appBranch = String(app.branch || "General").trim();
        const appSection = deriveSectionFromRoll(roll);
        const appStatus =
          app.status === "Accepted" || app.status === "Interview" ? "Present" : "Absent";

        return {
          sql: `
            INSERT INTO attendance (
              event_id, application_id, student_name, roll_number, branch, section, status, marked_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(event_id, roll_number) DO UPDATE SET
              student_name = excluded.student_name,
              branch = excluded.branch,
              section = excluded.section
          `,
          args: [eventId, String(app.id), name, roll, appBranch, appSection, appStatus],
        };
      });

      if (batchStatements.length > 0) {
        await turso.batch(batchStatements, "write");
      }

      return NextResponse.json({
        ok: true,
        message: `Successfully synchronized ${batchStatements.length} applicants into attendance roster.`,
        syncedCount: batchStatements.length,
      });
    }

    // ACTION: QR Code / Barcode Scan to Search & Mark Present
    if (action === "scan") {
      const rawText = String(data.text || "").trim();
      if (!rawText) {
        return NextResponse.json({ error: "Missing scan text" }, { status: 400 });
      }

      // 1. Clean & extract roll / ID / email from various QR code formats
      let searchText = rawText;
      if (rawText.startsWith("http://") || rawText.startsWith("https://")) {
        try {
          const parsedUrl = new URL(rawText);
          const rollParam = parsedUrl.searchParams.get("roll") || parsedUrl.searchParams.get("id");
          if (rollParam) {
            searchText = rollParam;
          } else {
            const segs = parsedUrl.pathname.split("/").filter(Boolean);
            if (segs.length > 0) searchText = segs[segs.length - 1];
          }
        } catch {
          // ignore
        }
      } else if (rawText.startsWith("{") && rawText.endsWith("}")) {
        try {
          const parsedJson = JSON.parse(rawText);
          searchText = parsedJson.roll || parsedJson.rollNumber || parsedJson.id || parsedJson.email || rawText;
        } catch {
          // ignore
        }
      }

      const cleanSearch = searchText.trim();
      const cleanUpper = cleanSearch.toUpperCase();
      const cleanLower = cleanSearch.toLowerCase();

      // 2. Query attendance table first
      let attendeeQuery = await turso.execute({
        sql: `
          SELECT * FROM attendance
          WHERE event_id = ? AND (
            UPPER(TRIM(roll_number)) = ? OR
            UPPER(TRIM(application_id)) = ? OR
            LOWER(TRIM(roll_number)) = ? OR
            LOWER(TRIM(student_name)) = ?
          ) LIMIT 1
        `,
        args: [eventId, cleanUpper, cleanUpper, cleanLower, cleanLower],
      });

      // If not exact match, try LIKE search
      if (attendeeQuery.rows.length === 0) {
        attendeeQuery = await turso.execute({
          sql: `
            SELECT * FROM attendance
            WHERE event_id = ? AND (
              UPPER(roll_number) LIKE ? OR
              LOWER(student_name) LIKE ?
            ) LIMIT 1
          `,
          args: [eventId, `%${cleanUpper}%`, `%${cleanLower}%`],
        });
      }

      // If still not in attendance table, look up applications table
      if (attendeeQuery.rows.length === 0) {
        const appLookup = await turso.execute({
          sql: `
            SELECT id, name, roll, branch, email, phone FROM applications
            WHERE UPPER(TRIM(roll)) = ? OR UPPER(TRIM(id)) = ? OR LOWER(TRIM(email)) = ?
            LIMIT 1
          `,
          args: [cleanUpper, cleanUpper, cleanLower],
        });

        if (appLookup.rows.length > 0) {
          const app = appLookup.rows[0];
          const roll = String(app.roll || app.id).trim().toUpperCase();
          const name = String(app.name || "Applicant").trim();
          const branch = String(app.branch || "General").trim();
          const section = deriveSectionFromRoll(roll);

          await turso.execute({
            sql: `
              INSERT INTO attendance (
                event_id, application_id, student_name, roll_number, branch, section, status, marked_at
              ) VALUES (?, ?, ?, ?, ?, ?, 'Present', datetime('now'))
              ON CONFLICT(event_id, roll_number) DO UPDATE SET
                status = 'Present',
                marked_at = datetime('now')
            `,
            args: [eventId, String(app.id), name, roll, branch, section],
          });

          return NextResponse.json({
            ok: true,
            matched: true,
            alreadyPresent: false,
            attendee: {
              application_id: String(app.id),
              student_name: name,
              roll_number: roll,
              branch,
              section,
              status: "Present",
              marked_at: new Date().toISOString(),
            },
            message: `Verified and marked Present: ${name} (${roll})`,
          });
        }

        return NextResponse.json(
          {
            ok: false,
            matched: false,
            error: `No attendee found matching scanned QR: "${rawText}"`,
          },
          { status: 404 }
        );
      }

      // Candidate is in attendance table, mark as Present!
      const existing = attendeeQuery.rows[0];
      const wasAlreadyPresent = String(existing.status) === "Present";

      await turso.execute({
        sql: `
          UPDATE attendance
          SET status = 'Present', marked_at = datetime('now')
          WHERE id = ?
        `,
        args: [existing.id],
      });

      return NextResponse.json({
        ok: true,
        matched: true,
        alreadyPresent: wasAlreadyPresent,
        attendee: {
          id: existing.id,
          application_id: existing.application_id,
          student_name: existing.student_name,
          roll_number: existing.roll_number,
          branch: existing.branch,
          section: existing.section,
          status: "Present",
          marked_at: new Date().toISOString(),
        },
        message: wasAlreadyPresent
          ? `${existing.student_name} is already marked Present`
          : `Checked in successfully: ${existing.student_name} (${existing.roll_number})`,
      });
    }

    // ACTION: Batch mark all Present / Absent
    if (action === "mark_all") {
      const targetStatus = status === "Present" ? "Present" : "Absent";
      await turso.execute({
        sql: `
          UPDATE attendance
          SET status = ?, marked_at = datetime('now')
          WHERE event_id = ?
        `,
        args: [targetStatus, eventId],
      });

      return NextResponse.json({
        ok: true,
        message: `All attendees set to ${targetStatus}`,
      });
    }

    // ACTION: Single attendee toggle / insert
    if (!studentName || !rollNumber || !branch) {
      return NextResponse.json(
        { error: "Missing required fields (studentName, rollNumber, branch)" },
        { status: 400 },
      );
    }

    await turso.execute({
      sql: `
        INSERT INTO attendance (event_id, student_name, roll_number, branch, section, status, marked_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(event_id, roll_number) DO UPDATE SET
          status = excluded.status,
          marked_at = datetime('now')
      `,
      args: [eventId, studentName, rollNumber.trim().toUpperCase(), branch, section, status],
    });

    return NextResponse.json({
      ok: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Attendance API save error:", error);
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 },
    );
  }
}
