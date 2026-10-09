import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET() {
  try {
    const res = await turso.execute("SELECT * FROM settings");
    const settings: Record<string, string> = {};
    for (const row of res.rows) {
      settings[String(row.key)] = String(row.value);
    }
    return NextResponse.json({
      applications_open: settings["applications_open"] !== "false",
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ applications_open: true });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { applications_open } = data;

    const val = applications_open ? "true" : "false";

    await turso.execute({
      sql: `
        INSERT INTO settings (key, value, updated_at)
        VALUES ('applications_open', ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = datetime('now')
      `,
      args: [val],
    });

    return NextResponse.json({
      ok: true,
      applications_open: val === "true",
      message: `Applications are now ${val === "true" ? "Open" : "Closed"}`,
    });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json(
      { error: "Wait some time and try again." },
      { status: 500 },
    );
  }
}
