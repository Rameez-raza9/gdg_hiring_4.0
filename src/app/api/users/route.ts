import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { colorFor, type Role, type User, type UserStatus } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await turso.execute(`
      SELECT id, name, email, role, status, last_active, photo_url 
      FROM users 
      ORDER BY 
        CASE WHEN LOWER(email) = 'vinaysiddha19@gmail.com' THEN 0 ELSE 1 END,
        created_at ASC
    `);

    const users: User[] = res.rows.map((u) => {
      const email = String(u.email || "");
      const isSuperAdmin = email.trim().toLowerCase() === "vinaysiddha19@gmail.com";
      const role = (isSuperAdmin ? "Admin" : String(u.role || "Member")) as Role;
      const name = String(u.name || email.split("@")[0]);

      return {
        id: String(u.id),
        name,
        email,
        role,
        status: (String(u.status || "Active") as UserStatus),
        lastActive: u.last_active ? String(u.last_active).slice(0, 16) : "Recent",
        color: colorFor(name),
      };
    });

    return NextResponse.json(
      { users },
      {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch users from Turso:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, role, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // 1. Fetch user to verify email
    const existing = await turso.execute({
      sql: "SELECT id, email, role, status FROM users WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = String(existing.rows[0].email || "").trim().toLowerCase();
    const isSuperAdmin = email === "vinaysiddha19@gmail.com";

    // 2. vinaysiddha19@gmail.com must always stay Admin and cannot be suspended
    let targetRole = role ? String(role) : undefined;
    let targetStatus = status ? String(status) : undefined;

    if (isSuperAdmin) {
      targetRole = "Admin";
      targetStatus = "Active";
    }

    // 3. Update in Turso
    await turso.execute({
      sql: `
        UPDATE users 
        SET 
          role = COALESCE(?, role),
          status = COALESCE(?, status),
          last_active = datetime('now')
        WHERE id = ?
      `,
      args: [targetRole || null, targetStatus || null, id],
    });

    return NextResponse.json({
      ok: true,
      message: "User updated successfully",
      user: {
        id,
        role: targetRole || existing.rows[0].role,
        status: targetStatus || existing.rows[0].status,
      },
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
