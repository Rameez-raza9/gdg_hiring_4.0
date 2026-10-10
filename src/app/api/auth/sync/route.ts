import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function POST(req: Request) {
  try {
    const { id, name, email, photoUrl } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isSuperAdmin = cleanEmail === "vinaysiddha19@gmail.com";
    const userId = id || `u_${Date.now()}`;
    const displayName = name || email.split("@")[0];

    // 1. Check if user already exists to preserve any admin-assigned RBAC role
    const existing = await turso.execute({
      sql: "SELECT id, role, status FROM users WHERE LOWER(email) = ?",
      args: [cleanEmail],
    });

    let assignedRole = "Member";

    if (isSuperAdmin) {
      assignedRole = "Admin";
    } else if (existing.rows.length > 0 && existing.rows[0].role) {
      // Preserve role assigned by admin in Admin Panel
      assignedRole = String(existing.rows[0].role);
    } else {
      // Default to Member for any new login
      assignedRole = "Member";
    }

    // 2. Upsert user record
    await turso.execute({
      sql: `
        INSERT INTO users (id, name, email, role, status, photo_url, last_active)
        VALUES (?, ?, ?, ?, 'Active', ?, (datetime('now')))
        ON CONFLICT(email) DO UPDATE SET
          name = COALESCE(excluded.name, users.name),
          role = ?,
          photo_url = COALESCE(excluded.photo_url, users.photo_url),
          last_active = (datetime('now'))
      `,
      args: [userId, displayName, cleanEmail, assignedRole, photoUrl || null, assignedRole],
    });

    console.log(`[Turso] Synced user ${cleanEmail} (${displayName}) -> role: ${assignedRole}`);
    return NextResponse.json({
      ok: true,
      user: {
        id: userId,
        name: displayName,
        email: cleanEmail,
        role: assignedRole,
        isAdmin: assignedRole === "Admin" || isSuperAdmin,
      },
    });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 },
    );
  }
}
