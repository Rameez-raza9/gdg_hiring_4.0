import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId") || "EV-101";

  try {
    const eventsRes = await turso.execute("SELECT * FROM events ORDER BY date DESC");
    const attRes = await turso.execute({
      sql: `
        SELECT * FROM attendance
        WHERE event_id = ?
        ORDER BY branch ASC, section ASC, roll_number ASC
      `,
      args: [eventId],
    });

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
    const { eventId = "EV-101", studentName, rollNumber, branch, section = "A", status = "Present" } = data;

    if (!studentName || !rollNumber || !branch) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
      args: [eventId, studentName, rollNumber, branch, section, status],
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
