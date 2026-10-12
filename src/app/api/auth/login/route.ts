import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    const googleName = body.name ? String(body.name).trim() : null;
    const googlePhoto = body.photoUrl ? String(body.photoUrl).trim() : null;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Query Turso users table
    const result = await turso.execute({
      sql: `SELECT id, name, email, role, status, photo_url FROM users WHERE LOWER(email) = ?`,
      args: [cleanEmail],
    });

    if (result.rows.length === 0) {
      // If it's chapter lead, auto-provision
      if (cleanEmail === "vinaysiddha19@gmail.com") {
        await turso.execute({
          sql: `INSERT INTO users (id, name, email, role, status, last_active, photo_url)
                VALUES ('lead_vinay', 'Vinay Siddha', 'vinaysiddha19@gmail.com', 'Admin', 'Active', datetime('now'), ?)
                ON CONFLICT(email) DO UPDATE SET role = 'Admin', status = 'Active', last_active = datetime('now'), photo_url = COALESCE(?, photo_url)`,
          args: [googlePhoto, googlePhoto],
        });
        return NextResponse.json({
          ok: true,
          user: {
            id: "lead_vinay",
            name: "Vinay Siddha",
            email: "vinaysiddha19@gmail.com",
            role: "Admin",
            status: "Active",
            photo_url: googlePhoto,
            isAdmin: true,
          },
        });
      }

      return NextResponse.json(
        {
          error: "No authorized account found for this email. Contact the GDG Chapter Lead or request Reviewer access.",
        },
        { status: 403 }
      );
    }

    const user = result.rows[0];

    if (String(user.status).toLowerCase() === "suspended") {
      return NextResponse.json(
        { error: "This account has been suspended. Please contact the Chapter Lead." },
        { status: 403 }
      );
    }

    const role = String(user.role || "Member");

    // Members have no admin portal access
    if (role === "Member" && cleanEmail !== "vinaysiddha19@gmail.com") {
      return NextResponse.json(
        {
          error:
            "Access Denied: Members do not have access to the GDG Admin Portal. Please contact your Chapter Lead for Reviewer or Lead access.",
        },
        { status: 403 }
      );
    }

    const isAuthorized = ["Admin", "Lead", "Reviewer"].includes(role) || cleanEmail === "vinaysiddha19@gmail.com";

    const resolvedName = googleName || String(user.name || cleanEmail.split("@")[0]);
    const resolvedPhoto = googlePhoto || (user.photo_url ? String(user.photo_url) : null);

    // Update last_active and optionally photo / name in Turso
    if (googlePhoto || (googleName && (!user.name || user.name === cleanEmail.split("@")[0]))) {
      await turso.execute({
        sql: `UPDATE users SET last_active = datetime('now'), name = COALESCE(?, name), photo_url = COALESCE(?, photo_url) WHERE LOWER(email) = ?`,
        args: [googleName || user.name, googlePhoto || user.photo_url, cleanEmail],
      });
    } else {
      await turso.execute({
        sql: `UPDATE users SET last_active = datetime('now') WHERE LOWER(email) = ?`,
        args: [cleanEmail],
      });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: String(user.id),
        name: resolvedName,
        email: cleanEmail,
        role,
        status: String(user.status || "Active"),
        photo_url: resolvedPhoto,
        isAdmin: isAuthorized,
      },
    });
  } catch (error) {
    console.error("Turso auth login error:", error);
    return NextResponse.json(
      { error: "Database authentication error. Please try again." },
      { status: 500 }
    );
  }
}
