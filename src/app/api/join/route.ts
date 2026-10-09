import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { sendApplyLinkEmail } from "@/lib/email";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data?.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    // 1. Record email in signups table
    await turso.execute({
      sql: "INSERT OR IGNORE INTO signups (email) VALUES (?)",
      args: [data.email],
    });

    // 2. Build application link
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const applyUrl = `${origin}/apply`;

    // 3. Send email with the application link
    await sendApplyLinkEmail(data.email, applyUrl);

    return NextResponse.json({
      message: "Application link sent to your email!",
      email: data.email,
    });
  } catch (error) {
    console.error("Join route error:", error);
    return NextResponse.json(
      { message: "Wait some time and try again.", email: data.email },
      { status: 500 },
    );
  }
}
