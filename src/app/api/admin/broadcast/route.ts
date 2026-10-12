import { NextResponse } from "next/server";
import { APPLICATIONS, STATUSES, type Status } from "@/lib/admin-data";
import { turso } from "@/lib/turso";
import {
  WHATSAPP_URL,
  renderEventPreview,
  sendEventDetailsBulk,
  type EventDetails,
  type Recipient,
} from "@/lib/email";

export const runtime = "nodejs"; // nodemailer + fs need Node, not Edge
export const maxDuration = 60; // Vercel: raise the function timeout for bigger batches

type Body = {
  action: "preview" | "test" | "send";
  event: EventDetails;
  audience?: "active" | Status | "custom";
  customEmails?: string;
  testEmail?: string;
  adminEmail?: string;
};

const isEmail = (s: string) => /^\S+@\S+\.\S+$/.test(s);

async function checkAdminAuthorization(email?: string | null): Promise<boolean> {
  if (!email) {
    // In local development or chapter server environment
    if (process.env.NODE_ENV === "development") return true;
    return false;
  }
  const clean = email.trim().toLowerCase();
  if (
    clean === "vinaysiddha19@gmail.com" ||
    clean === "gdgoncampussvec@gmail.com" ||
    (process.env.GMAIL_USER && clean === process.env.GMAIL_USER.toLowerCase()) ||
    (process.env.ADMIN_EMAIL && clean === process.env.ADMIN_EMAIL.toLowerCase())
  ) {
    return true;
  }

  try {
    const res = await turso.execute({
      sql: "SELECT role, status FROM users WHERE LOWER(email) = ?",
      args: [clean],
    });
    if (res.rows.length > 0) {
      const role = String(res.rows[0].role || "");
      const status = String(res.rows[0].status || "");
      if ((role === "Admin" || role === "Lead" || role === "Reviewer") && status === "Active") {
        return true;
      }
    }
  } catch (err) {
    console.error("[Broadcast API] Authorization check error:", err);
  }
  return false;
}

async function resolveAudience(audience: Body["audience"], custom = ""): Promise<Recipient[]> {
  if (audience === "custom") {
    return custom
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(isEmail)
      .map((email) => ({ email }));
  }

  try {
    let sql = "";
    const args: (string | number)[] = [];
    if (audience === "active") {
      sql = "SELECT email, name FROM applications WHERE status != 'Rejected'";
    } else if (audience && STATUSES.includes(audience)) {
      sql = "SELECT email, name FROM applications WHERE status = ?";
      args.push(audience);
    }

    if (sql) {
      const res = await turso.execute({ sql, args });
      if (res.rows && res.rows.length > 0) {
        return res.rows
          .map((r) => ({
            email: String(r.email || "").trim(),
            name: String(r.name || "").trim(),
          }))
          .filter((r) => isEmail(r.email));
      }
    }
  } catch (err) {
    console.error("[Broadcast API] Failed to fetch applicants from database:", err);
  }

  // Fallback to in-memory applicants if database has no records or connection fails
  const pool =
    audience === "active"
      ? APPLICATIONS.filter((a) => a.status !== "Rejected")
      : APPLICATIONS.filter((a) => a.status === audience && STATUSES.includes(a.status));
  return pool.map((a) => ({ email: a.email, name: a.name }));
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.event) return NextResponse.json({ error: "Missing event" }, { status: 400 });

  const e: EventDetails = {
    ...body.event,
    whatsappUrl: body.event.whatsappUrl?.trim() || WHATSAPP_URL,
  };

  // Preview action renders sanitized HTML without sending emails
  if (body.action === "preview") {
    return NextResponse.json({ html: renderEventPreview(e) });
  }

  // Verify caller is an authorized admin before sending any real/test emails
  const callerEmail =
    req.headers.get("x-admin-email") ||
    body.adminEmail ||
    null;

  const isAuthorized = await checkAdminAuthorization(callerEmail);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Forbidden: Only authorized chapter admins and reviewers can broadcast emails." },
      { status: 403 }
    );
  }

  if (body.action === "test") {
    // Provide sensible defaults for test email preview if admin hasn't completed all fields
    if (!e.title?.trim()) e.title = "GDGoC SVEC Event Invitation (Test Preview)";
    if (!e.date?.trim()) e.date = new Date().toISOString().slice(0, 10);
    if (!e.startTime?.trim()) e.startTime = "10:00";
    if (!e.venue?.trim()) e.venue = "Seminar Hall, Block B, SVEC Campus";
  } else {
    const missing = (["title", "date", "startTime", "venue"] as const).filter((k) => !e[k]?.trim());
    if (missing.length) {
      return NextResponse.json({ error: `Fill in: ${missing.join(", ")}` }, { status: 400 });
    }
  }

  const recipients: Recipient[] =
    body.action === "test"
      ? isEmail(body.testEmail ?? "")
        ? [{ email: body.testEmail!.trim(), name: "Chapter Admin" }]
        : []
      : await resolveAudience(body.audience, body.customEmails);

  if (recipients.length === 0) {
    return NextResponse.json(
      { error: body.action === "test" ? "Please enter a valid test email address." : "No valid recipients found." },
      { status: 400 }
    );
  }

  const result = await sendEventDetailsBulk(recipients, e);

  if (result.sent === 0 && result.failed.length > 0) {
    return NextResponse.json(
      {
        error: result.failed[0]?.error || "SMTP send failed. Check Gmail SMTP App Password.",
        ...result,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}
