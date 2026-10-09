import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { sendApplicationSubmittedEmail } from "@/lib/email";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data?.email || !data?.name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Check if applications are closed
  try {
    const settingsRes = await turso.execute({
      sql: "SELECT value FROM settings WHERE key = 'applications_open'",
      args: [],
    });
    if (settingsRes.rows.length > 0 && settingsRes.rows[0].value === "false") {
      return NextResponse.json(
        { error: "Applications are currently closed for this recruitment cycle." },
        { status: 403 },
      );
    }
  } catch (err) {
    console.error("Error checking settings:", err);
  }

  const id = `A-${Math.floor(1000 + Math.random() * 9000)}`;
  const submitted = new Date().toISOString().slice(0, 10);
  const tracksJson = JSON.stringify(data.tracks || []);

  try {
    await turso.execute({
      sql: `
        INSERT INTO applications (id, name, email, phone, roll, branch, year, tracks, why, link, status, submitted)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?)
      `,
      args: [
        id,
        data.name,
        data.email,
        data.phone || null,
        data.roll || null,
        data.branch || null,
        data.year || null,
        tracksJson,
        data.why || null,
        data.link || null,
        submitted,
      ],
    });

    console.log(
      `[Turso] Stored application ${id} for ${data.name} (${data.email})`,
    );

    // Send confirmation email with WhatsApp group link
    await sendApplicationSubmittedEmail({
      toEmail: data.email,
      studentName: data.name,
      applicationId: id,
    });

    return NextResponse.json({
      ok: true,
      id,
      message: "Application saved and confirmation email sent!",
    });
  } catch (error) {
    console.error("Turso insert error in /api/apply:", error);
    return NextResponse.json({
      ok: true,
      id,
      message: "Application received. If any error comes, wait some time and try again.",
    });
  }
}
