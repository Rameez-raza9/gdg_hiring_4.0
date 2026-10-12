import fs from "fs";
import path from "path";
import nodemailer, { type Transporter } from "nodemailer";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

export const GMAIL_USER = process.env.GMAIL_USER || "gdgoncampussvec@gmail.com";
export const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gdg-hiring-4-0.vercel.app";
export const WHATSAPP_URL = process.env.WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/GDGoCSVEC2026";
export const LEAD_EMAIL = "vinaysiddha19@gmail.com";

/**
 * One pooled transport, reused for every email. Pooling keeps the SMTP
 * connections open, which is what makes bulk sending fast.
 */
let transport: Transporter | null | undefined;

export function getMailer(): Transporter | null {
  if (transport !== undefined) return transport;
  if (!GMAIL_PASS) {
    console.warn("[Mailer] GMAIL_APP_PASSWORD is not set. Emails will be logged to the console.");
    transport = null;
    return null;
  }
  transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    pool: true,
    maxConnections: 5,
    maxMessages: 200,
  });
  return transport;
}

/* ------------------------------------------------------------------ */
/* Assets (read once, kept in memory, attached inline via CID)         */
/* ------------------------------------------------------------------ */

export const HEADER_KEYS = ["h1", "h2", "h3", "h4"] as const;
export type HeaderKey = (typeof HEADER_KEYS)[number];

export const FOOTER_LOGO_KEYS = ["l1", "l2", "l3", "l4", "l5"] as const;
export type FooterLogoKey = (typeof FOOTER_LOGO_KEYS)[number];

/** Animated GIF mascots: public/assets/gifs/dot-1.gif ... dot-8.gif (+ wave.gif) */
export const DOT_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type DotKey = (typeof DOT_KEYS)[number];

const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
export const getRandomHeaderKey = () => pick(HEADER_KEYS);
export const getRandomFooterLogoKey = () => pick(FOOTER_LOGO_KEYS);
export const getRandomDotKey = () => pick(DOT_KEYS);

export type EmailAssets = { header: HeaderKey; logo: FooterLogoKey; dot: DotKey };
export const randomAssets = (): EmailAssets => ({
  header: getRandomHeaderKey(),
  logo: getRandomFooterLogoKey(),
  dot: getRandomDotKey(),
});

const ASSETS_DIR = path.join(process.cwd(), "public", "assets");
const bufferCache = new Map<string, Buffer>();

function resolveAsset(dir: string, name: string, exts: string[]) {
  for (const ext of exts) {
    if (fs.existsSync(path.join(ASSETS_DIR, dir, `${name}.${ext}`))) return { rel: `${dir}/${name}.${ext}`, ext };
  }
  return { rel: `${dir}/${name}.${exts[0]}`, ext: exts[0] };
}

function readAsset(rel: string) {
  let buf = bufferCache.get(rel);
  if (!buf) {
    buf = fs.readFileSync(path.join(ASSETS_DIR, rel));
    bufferCache.set(rel, buf);
  }
  return buf;
}

const MIME: Record<string, string> = { png: "image/png", svg: "image/svg+xml", gif: "image/gif", jpg: "image/jpeg" };

function assetRefs(a: EmailAssets) {
  return {
    header: resolveAsset("headers", a.header, ["png", "svg"]),
    logo: resolveAsset("logos", a.logo, ["png", "svg"]),
    dot: resolveAsset("gifs", `dot-${a.dot}`, ["gif"]),
    wave: resolveAsset("gifs", "wave", ["gif"]),
  };
}

export function getEmailAttachments(a: EmailAssets) {
  const r = assetRefs(a);
  return (
    [
      ["emailHeader", r.header],
      ["footerLogo", r.logo],
      ["mascotGif", r.dot],
      ["waveGif", r.wave],
    ] as const
  ).map(([cid, ref]) => ({
    filename: path.basename(ref.rel),
    content: readAsset(ref.rel),
    cid,
    contentType: MIME[ref.ext],
  }));
}

/* ------------------------------------------------------------------ */
/* HTML helpers                                                        */
/* ------------------------------------------------------------------ */

const FONT = `'Google Sans','Product Sans',Roboto,'Segoe UI',Helvetica,Arial,sans-serif`;
const INK = "#0f172a";
const TEXT = "#334155";
const MUTED = "#64748b";
const LINE = "#e2e8f0";

export const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const firstName = (name?: string) => (name || "").trim().split(/\s+/)[0] || "there";

/** Bulletproof button (works in Outlook too). */
function button(href: string, label: string, kind: "primary" | "whatsapp" | "ghost" = "primary") {
  const styles = {
    primary: { bg: "#1a73e8", fg: "#ffffff", border: "#1a73e8" },
    whatsapp: { bg: "#128C4A", fg: "#ffffff", border: "#128C4A" },
    ghost: { bg: "#ffffff", fg: INK, border: "#cbd5e1" },
  }[kind];
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
      <tr>
        <td align="center" bgcolor="${styles.bg}" style="border-radius:12px;border:1px solid ${styles.border};">
          <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:700;line-height:1;color:${styles.fg};text-decoration:none;border-radius:12px;">${label}</a>
        </td>
      </tr>
    </table>`;
}

const spacer = (h: number) => `<div style="height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</div>`;

const title = (t: string, color = INK) =>
  `<h1 class="title" style="margin:0 0 16px 0;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;color:${color};text-align:center;">${t}</h1>`;

const para = (html: string, align: "left" | "center" = "left") =>
  `<p style="margin:0 0 16px 0;font-family:${FONT};font-size:16px;line-height:1.65;color:${TEXT};text-align:${align};">${html}</p>`;

const small = (html: string) =>
  `<p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED};text-align:center;">${html}</p>`;

function mascot(src: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="padding:0 0 6px 0;">
        <img src="${src}" width="96" height="96" alt="" style="display:block;border:0;width:96px;height:96px;" />
      </td></tr>
    </table>`;
}

/** Rows like  Date / Time / Venue  inside a soft card. */
function detailCard(rows: { label: string; value: string }[]) {
  const body = rows
    .map(
      (r, i) => `
      <tr>
        <td style="padding:14px 20px;${i > 0 ? `border-top:1px solid ${LINE};` : ""}">
          <div style="font-family:${FONT};font-size:12px;line-height:1.4;color:${MUTED};margin-bottom:4px;">${esc(r.label)}</div>
          <div style="font-family:${FONT};font-size:17px;line-height:1.45;font-weight:700;color:${INK};">${r.value}</div>
        </td>
      </tr>`,
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid ${LINE};border-radius:16px;border-collapse:separate;">
      ${body}
    </table>`;
}

type LayoutOpts = { preheader: string; content: string; assets: EmailAssets; preview?: boolean };

/** Where images point: CID in real emails, /assets/... in the admin preview. */
function srcs(a: EmailAssets, preview?: boolean) {
  const r = assetRefs(a);
  return preview
    ? { header: `/assets/${r.header.rel}`, logo: `/assets/${r.logo.rel}`, dot: `/assets/${r.dot.rel}`, wave: `/assets/${r.wave.rel}` }
    : { header: "cid:emailHeader", logo: "cid:footerLogo", dot: "cid:mascotGif", wave: "cid:waveGif" };
}

function layout({ preheader, content, assets, preview }: LayoutOpts) {
  const s = srcs(assets, preview);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>GDGoC SVEC</title>
  <style>
    body { margin:0; padding:0; background:#f1f5f9; -webkit-text-size-adjust:100%; }
    img { border:0; outline:none; text-decoration:none; }
    a { color:#1a73e8; }
    @media only screen and (max-width: 620px) {
      .px { padding-left:22px !important; padding-right:22px !important; }
      .title { font-size:23px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${esc(preheader)}&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
    <tr><td align="center" style="padding:28px 12px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:20px;border-collapse:separate;overflow:hidden;">
        <tr><td style="padding:0;line-height:0;font-size:0;">
          <img src="${s.header}" width="600" alt="GDGoC SVEC" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
        </td></tr>

        <tr><td class="px" style="padding:36px 44px 12px 44px;font-family:${FONT};">
          ${content}
        </td></tr>

        <tr><td align="center" style="padding:8px 24px 0 24px;line-height:0;font-size:0;">
          <img src="${s.wave}" width="520" height="48" alt="" style="display:block;width:100%;max-width:520px;height:auto;border:0;" />
        </td></tr>

        <tr><td align="center" style="padding:20px 24px 30px 24px;font-family:${FONT};">
          <img src="${s.logo}" width="72" alt="GDGoC chapter emblem" style="display:block;width:72px;height:auto;margin:0 auto 14px auto;border:0;" />
          <div style="font-size:14px;font-weight:700;color:${INK};margin-bottom:6px;">Google Developer Groups on Campus &bull; SVEC</div>
          <div style="font-size:12px;line-height:1.7;color:${MUTED};">
            Sri Vasavi Engineering College, Pedatadepalli, Tadepalligudem<br>
            Chapter lead: <a href="mailto:${LEAD_EMAIL}" style="color:#1a73e8;text-decoration:none;font-weight:500;">${LEAD_EMAIL}</a><br>
            Eight tracks. One campus. Everyone building.
          </div>
        </td></tr>
      </table>

      <div style="max-width:600px;padding:18px 20px 0 20px;font-family:${FONT};font-size:11px;line-height:1.6;color:#94a3b8;text-align:center;">
        You are receiving this because you applied to or are connected with GDGoC SVEC.
      </div>

    </td></tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Sending core                                                        */
/* ------------------------------------------------------------------ */

type SendOpts = {
  to: string;
  subject: string;
  preheader: string;
  content: (s: ReturnType<typeof srcs>) => string;
  from?: string;
  replyTo?: string;
  assets?: EmailAssets;
  icalEvent?: { filename: string; method: string; content: string };
};

async function sendTemplated(o: SendOpts) {
  const mailer = getMailer();
  const assets = o.assets ?? randomAssets();
  const html = layout({ preheader: o.preheader, content: o.content(srcs(assets)), assets });

  if (!mailer) {
    console.log(`[Email Simulation] To: ${o.to} | Subject: ${o.subject} | assets: ${JSON.stringify(assets)}`);
    return true;
  }

  const message = {
    from: o.from ?? `"GDGoC SVEC" <${GMAIL_USER}>`,
    to: o.to,
    replyTo: o.replyTo,
    subject: o.subject,
    html,
    attachments: getEmailAttachments(assets),
    icalEvent: o.icalEvent,
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await mailer.sendMail(message);
      return true;
    } catch (err) {
      if (attempt === 1) {
        console.error(`Failed to send "${o.subject}" to ${o.to}:`, err);
        return false;
      }
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* 1. Apply link                                                       */
/* ------------------------------------------------------------------ */

export function sendApplyLinkEmail(toEmail: string, applyUrl: string) {
  return sendTemplated({
    to: toEmail,
    subject: "Your GDGoC SVEC application link",
    preheader: "Your link to apply is ready. It takes about three minutes.",
    content: (s) => `
      ${mascot(s.dot)}
      ${title("Here is your link to apply")}
      ${para(`Thanks for your interest in joining <strong>GDGoC SVEC</strong>. Pick your tracks, tell us why you want to build with us, and you are done.`, "center")}
      ${spacer(8)}
      ${button(applyUrl, "Apply now &rarr;", "primary")}
      ${spacer(20)}
      ${small("Sign in with your Google account before submitting your application.")}
      ${spacer(16)}
    `,
  });
}

/* ------------------------------------------------------------------ */
/* 2. Application received                                             */
/* ------------------------------------------------------------------ */

export function sendApplicationSubmittedEmail({
  toEmail,
  studentName,
  applicationId,
  whatsappGroupUrl = WHATSAPP_URL,
}: {
  toEmail: string;
  studentName: string;
  applicationId: string;
  whatsappGroupUrl?: string;
}) {
  return sendTemplated({
    to: toEmail,
    subject: `Application received (${applicationId}) | GDGoC SVEC`,
    preheader: "We have your application. Join the WhatsApp group for schedules and updates.",
    content: (s) => `
      ${mascot(s.dot)}
      ${title("Application received")}
      ${para(`Hi <strong>${esc(firstName(studentName))}</strong>,`)}
      ${para(`Your application is in. Your reference is <strong style="font-family:Menlo,Consolas,monospace;">${esc(applicationId)}</strong>.`)}
      ${para(`Join our official WhatsApp group for interview slots, schedules and chapter announcements:`)}
      ${spacer(6)}
      ${button(whatsappGroupUrl, "Join the WhatsApp group &rarr;", "whatsapp")}
      ${spacer(20)}
      ${small("Our leads will review your application and reach out soon.")}
      ${spacer(16)}
    `,
  });
}

/* ------------------------------------------------------------------ */
/* 3. Interview decision                                               */
/* ------------------------------------------------------------------ */

export function sendInterviewFeedbackEmail({
  toEmail,
  studentName,
  decision,
  communityUrl = "https://gdg.community.dev/events/#/list",
}: {
  toEmail: string;
  studentName: string;
  decision: "Accepted" | "Rejected" | "Shortlisted" | "Interview" | string;
  communityUrl?: string;
}) {
  const name = esc(firstName(studentName));
  const accepted = decision === "Accepted";

  return sendTemplated({
    to: toEmail,
    subject: accepted ? `Welcome to GDGoC SVEC, ${firstName(studentName)}` : `Update on your GDGoC SVEC interview`,
    preheader: accepted ? "You have been selected for the core team." : "Thank you for interviewing with us.",
    content: (s) =>
      accepted
        ? `
      ${mascot(s.dot)}
      ${title(`Congratulations, ${name}`, "#15803d")}
      ${para(`Thank you for attending the interview. You have been selected for the core team at <strong>GDGoC SVEC</strong>.`, "center")}
      ${spacer(8)}
      ${button(communityUrl, "Join the chapter platform &rarr;", "primary")}
      ${spacer(20)}
      ${small("Welcome aboard. Onboarding details are coming shortly.")}
      ${spacer(16)}`
        : `
      ${mascot(s.dot)}
      ${title(`Thank you for interviewing, ${name}`)}
      ${para(`Thank you for taking the time to meet the GDGoC SVEC team.`)}
      ${para(`If you are selected, an offer will reach you shortly. Either way, our community is open to everyone, so come build with us at the next session:`)}
      ${spacer(6)}
      ${button(communityUrl, "See upcoming events &rarr;", "primary")}
      ${spacer(20)}
      ${small("See you at our next workshop or hackathon.")}
      ${spacer(16)}`,
  });
}

/* ------------------------------------------------------------------ */
/* 4. Admin access request                                             */
/* ------------------------------------------------------------------ */

export function sendAdminAccessRequestEmail({
  userEmail,
  userName,
  currentRole = "Member",
  requestedRole = "Reviewer",
  reason = "",
}: {
  userEmail: string;
  userName: string;
  currentRole?: string;
  requestedRole?: string;
  reason?: string;
}) {
  return sendTemplated({
    to: LEAD_EMAIL,
    from: `"GDGoC SVEC Portal" <${GMAIL_USER}>`,
    replyTo: userEmail,
    subject: `[Access request] ${userName} wants the ${requestedRole} role`,
    preheader: `${userName} requested ${requestedRole} access in the admin portal.`,
    content: (s) => `
      ${mascot(s.dot)}
      ${title("New access request")}
      ${para(`A user has asked for elevated access in the GDGoC SVEC admin portal.`)}
      ${detailCard([
        { label: "Name", value: esc(userName) },
        { label: "Email", value: esc(userEmail) },
        { label: "Current role", value: esc(currentRole) },
        { label: "Requested role", value: esc(requestedRole) },
        ...(reason ? [{ label: "Reason", value: esc(reason) }] : []),
      ])}
      ${spacer(24)}
      ${button(`${SITE_URL}/admin/users`, "Manage users &rarr;", "primary")}
      ${spacer(16)}
    `,
  });
}

/* ------------------------------------------------------------------ */
/* 5. Event details broadcast (WhatsApp link + venue + date + time)    */
/* ------------------------------------------------------------------ */

export type EventDetails = {
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h, IST)
  endTime?: string; // HH:mm
  venue: string;
  mapUrl?: string;
  whatsappUrl?: string;
  note?: string; // supports {name}
  subject?: string;
};

export type Recipient = { email: string; name?: string };

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function longDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${WEEKDAYS[wd]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

function time12(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** IST (UTC+5:30, no DST) -> UTC compact stamp like 20261018T043000Z */
function utcStamp(ymd: string, hhmm: string) {
  const [y, mo, d] = ymd.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const t = new Date(Date.UTC(y, mo - 1, d, h, mi) - 330 * 60_000);
  return t.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function endOrDefault(e: EventDetails) {
  if (e.endTime) return e.endTime;
  const [h, m] = e.startTime.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function googleCalendarUrl(e: EventDetails) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${utcStamp(e.date, e.startTime)}/${utcStamp(e.date, endOrDefault(e))}`,
    location: e.venue,
    details: `GDGoC SVEC${e.whatsappUrl ? `\nWhatsApp group: ${e.whatsappUrl}` : ""}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function buildIcs(e: EventDetails) {
  const clean = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GDGoC SVEC//Broadcast//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${utcStamp(e.date, e.startTime)}-${Math.random().toString(36).slice(2)}@gdgoc-svec`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART:${utcStamp(e.date, e.startTime)}`,
    `DTEND:${utcStamp(e.date, endOrDefault(e))}`,
    `SUMMARY:${clean(e.title)}`,
    `LOCATION:${clean(e.venue)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function noteHtml(note: string | undefined, name: string) {
  if (!note?.trim()) return "";
  return note
    .trim()
    .split(/\n{2,}/)
    .map((p) => para(esc(p).replace(/\{name\}/g, esc(name)).replace(/\n/g, "<br>")))
    .join("");
}

function eventContent(e: EventDetails, r: Recipient, s: ReturnType<typeof srcs>) {
  const name = firstName(r.name);
  const timeText = `${time12(e.startTime)}${e.endTime ? ` &ndash; ${time12(e.endTime)}` : ""} <span style="font-weight:400;color:${MUTED};font-size:13px;">IST</span>`;
  const venueHtml = e.mapUrl
    ? `${esc(e.venue)}<br><a href="${esc(e.mapUrl)}" style="font-size:13px;font-weight:500;color:#1a73e8;text-decoration:none;">Open in Maps &rarr;</a>`
    : esc(e.venue);

  return `
    ${mascot(s.dot)}
    ${title(esc(e.title))}
    ${para(`Hi <strong>${esc(name)}</strong>, here are the details. Please save them.`, "center")}
    ${spacer(4)}
    ${detailCard([
      { label: "Date", value: esc(longDate(e.date)) },
      { label: "Time", value: timeText },
      { label: "Venue", value: venueHtml },
    ])}
    ${spacer(24)}
    ${noteHtml(e.note, name)}
    ${e.whatsappUrl ? `${button(e.whatsappUrl, "Join the WhatsApp group &rarr;", "whatsapp")}${spacer(12)}` : ""}
    ${button(googleCalendarUrl(e), "Add to Google Calendar", "ghost")}
    ${spacer(20)}
    ${small("An invite file (.ics) is attached for Apple and Outlook calendars.")}
    ${spacer(16)}
  `;
}

/** HTML for the admin live preview (images load from /assets instead of CID). */
export function renderEventPreview(e: EventDetails, name = "Aarav") {
  const assets: EmailAssets = { header: "h1", logo: "l1", dot: 1 };
  return layout({
    preheader: `${e.title}: date, time and venue`,
    assets,
    preview: true,
    content: eventContent(e, { email: "preview@example.com", name }, srcs(assets, true)),
  });
}

export function eventSubject(e: EventDetails) {
  return e.subject?.trim() || `${e.title}: date, time and venue`;
}

/**
 * Send the event email to many people, fast.
 * - one personalised email per person ("Hi Name")
 * - pooled SMTP connections + a small worker pool
 * - assets read once and reused
 * Gmail allows ~500 recipients/day on a free account (2,000 on Workspace).
 */
export async function sendEventDetailsBulk(
  recipients: Recipient[],
  event: EventDetails,
  { concurrency = 5 }: { concurrency?: number } = {},
) {
  const seen = new Set<string>();
  const list = recipients.filter((r) => {
    const e = r.email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(e) || seen.has(e)) return false;
    seen.add(e);
    return true;
  });

  const assets = randomAssets(); // same look for the whole batch
  const ics = { filename: "invite.ics", method: "PUBLISH", content: buildIcs(event) };
  const subject = eventSubject(event);

  const queue = [...list];
  const failed: { email: string; error: string }[] = [];
  let sent = 0;

  const worker = async () => {
    while (queue.length) {
      const r = queue.shift()!;
      const ok = await sendTemplated({
        to: r.email.trim(),
        subject,
        preheader: `${longDate(event.date)}, ${time12(event.startTime)} at ${event.venue}`,
        assets,
        icalEvent: ics,
        content: (s) => eventContent(event, r, s),
      });
      if (ok) sent++;
      else failed.push({ email: r.email, error: "SMTP send failed" });
    }
  };

  const started = Date.now();
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, list.length)) }, worker));
  return { total: list.length, sent, failed, ms: Date.now() - started };
}
