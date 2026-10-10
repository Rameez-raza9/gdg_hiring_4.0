import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { sendAdminAccessRequestEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, name, requestedRole = "Reviewer", reason = "" } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name || cleanEmail.split("@")[0];

    // 1. Fetch user to ensure they are registered
    const userRes = await turso.execute({
      sql: "SELECT id, role, status FROM users WHERE LOWER(email) = ?",
      args: [cleanEmail],
    });

    const currentRole = userRes.rows.length > 0 ? String(userRes.rows[0].role || "Member") : "Member";

    // 2. Dispatch official request notification to Vinay Siddha
    const mailSent = await sendAdminAccessRequestEmail({
      userEmail: cleanEmail,
      userName: cleanName,
      currentRole,
      requestedRole,
      reason,
    });

    return NextResponse.json({
      ok: true,
      message: "Admin request email sent to vinaysiddha19@gmail.com successfully!",
      mailSent,
    });
  } catch (error) {
    console.error("Admin request error:", error);
    return NextResponse.json(
      { error: "Failed to send admin request. Wait some time and try again." },
      { status: 500 }
    );
  }
}
