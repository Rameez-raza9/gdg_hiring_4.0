import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || "gdgoncampussvec@gmail.com";
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || "";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Forward to Vinay Siddha
    if (GMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"GDGoC SVEC Contact" <${GMAIL_USER}>`,
        to: "vinaysiddha19@gmail.com",
        replyTo: email,
        subject: `[Contact Form] ${subject || "New Inquiry from " + name}`,
        html: `
          <div style="font-family: 'Google Sans', sans-serif; padding: 24px; background: #f8fafc; border-radius: 16px;">
            <h2 style="color: #0f172a; margin-top: 0;">New Contact Form Message</h2>
            <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
            <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
            <div style="background: #ffffff; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 14px; color: #334155; line-height: 1.6;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
              Sent via GDGoC SVEC Website Footer Contact Form.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Thank you for reaching out! Your message has been sent to our chapter lead.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
