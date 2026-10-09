import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function POST(req: Request) {
  try {
    const { id, name, email, photoUrl } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === "vinaysiddha19@gmail.com";
    const role = isAdmin ? "Admin" : "Member";

    const userId = id || `u_${Date.now()}`;
    const displayName = name || email.split("@")[0];

    await turso.execute({
      sql: `
        INSERT INTO users (id, name, email, role, status, photo_url, last_active)
        VALUES (?, ?, ?, ?, 'Active', ?, (datetime('now')))
        ON CONFLICT(email) DO UPDATE SET
          name = COALESCE(excluded.name, users.name),
          role = CASE WHEN LOWER(users.email) = 'vinaysiddha19@gmail.com' THEN 'Admin' ELSE users.role END,
          photo_url = COALESCE(excluded.photo_url, users.photo_url),
          last_active = (datetime('now'))
      `,
      args: [userId, displayName, cleanEmail, role, photoUrl || null],
    });

    if (isAdmin) {
      await turso.execute({
        sql: `UPDATE users SET role = 'Admin'`,
        args: [],
      });
    }

    console.log(`[Turso] Synced user ${cleanEmail} (${displayName}) -> role: ${role}`);
    return NextResponse.json({
      ok: true,
      user: { id: userId, name: displayName, email: cleanEmail, role, isAdmin },
    });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 },
    );
  }
}
