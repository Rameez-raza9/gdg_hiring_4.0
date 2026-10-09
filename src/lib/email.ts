import nodemailer from "nodemailer";

export const GMAIL_USER = process.env.GMAIL_USER || "gdgoncampussvec@gmail.com";
export const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || "";

// Initialize nodemailer transport
export function getMailer() {
  if (!GMAIL_PASS) {
    console.warn("[Mailer] GMAIL_APP_PASSWORD is not set in environment. Emails will be logged to console.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });
}

/**
 * 12 Animated Mascot Dot SVGs (matching AnimatedDots.tsx 1 to 12)
 * Includes inline CSS keyframes for clients that support CSS animation,
 * and high-contrast vector fallback for static mail clients.
 */
export const DOTS_1_TO_12_SVG: Record<number, { color: string; svg: string }> = {
  1: {
    color: "#4285F4",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes hop1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .d1 { animation: hop1 2.2s ease-in-out infinite; }
      </style>
      <g class="d1">
        <circle cx="50" cy="50" r="42" fill="#4285F4"/>
        <circle cx="43" cy="50" r="5" fill="#0f172a"/>
        <circle cx="57" cy="50" r="5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  2: {
    color: "#EA4335",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes sway2 { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
        .d2 { animation: sway2 2.4s ease-in-out infinite; transform-origin: 50px 75px; }
      </style>
      <g class="d2">
        <path d="M50 14 C68 38, 84 56, 84 72 A34 34 0 0 1 16 72 C16 56, 32 38, 50 14 Z" fill="#EA4335"/>
        <ellipse cx="44" cy="62" rx="4.5" ry="3.5" fill="#0f172a"/>
        <ellipse cx="56" cy="62" rx="4.5" ry="3.5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  3: {
    color: "#34A853",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes rot3 { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(14deg); } }
        .d3 { animation: rot3 2.6s ease-in-out infinite; transform-origin: center; }
      </style>
      <g class="d3">
        <circle cx="50" cy="50" r="32" fill="#34A853"/>
        <circle cx="80" cy="50" r="9" fill="#34A853"/>
        <circle cx="71" cy="71" r="9" fill="#34A853"/>
        <circle cx="50" cy="80" r="9" fill="#34A853"/>
        <circle cx="29" cy="71" r="9" fill="#34A853"/>
        <circle cx="20" cy="50" r="9" fill="#34A853"/>
        <circle cx="29" cy="29" r="9" fill="#34A853"/>
        <circle cx="50" cy="20" r="9" fill="#34A853"/>
        <circle cx="71" cy="29" r="9" fill="#34A853"/>
        <path d="M42 52 L45 47 L48 52" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M52 52 L55 47 L58 52" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  4: {
    color: "#FBBC04",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes rot4 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .d4 { animation: rot4 16s linear infinite; transform-origin: center; }
      </style>
      <g class="d4">
        <circle cx="50" cy="30" r="22" fill="#FBBC04"/>
        <circle cx="70" cy="50" r="22" fill="#FBBC04"/>
        <circle cx="50" cy="70" r="22" fill="#FBBC04"/>
        <circle cx="30" cy="50" r="22" fill="#FBBC04"/>
        <circle cx="50" cy="50" r="26" fill="#FBBC04"/>
      </g>
      <path d="M42 49 Q45 54 48 49" stroke="#0f172a" stroke-width="2.5" fill="none"/>
      <path d="M52 49 Q55 54 58 49" stroke="#0f172a" stroke-width="2.5" fill="none"/>
    </svg>`,
  },
  5: {
    color: "#6366F1",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes pulse5 { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        .d5 { animation: pulse5 2s ease-in-out infinite; transform-origin: center; }
      </style>
      <g class="d5">
        <rect x="14" y="14" width="72" height="72" rx="28" fill="#6366F1"/>
        <rect x="42" y="47" width="5" height="7" rx="2" fill="#0f172a"/>
        <rect x="53" y="47" width="5" height="7" rx="2" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  6: {
    color: "#FBBC04",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes hop6 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .d6 { animation: hop6 2.4s ease-in-out infinite; }
      </style>
      <g class="d6">
        <circle cx="50" cy="50" r="32" fill="#FBBC04"/>
        <circle cx="80" cy="50" r="9" fill="#FBBC04"/>
        <circle cx="71" cy="71" r="9" fill="#FBBC04"/>
        <circle cx="50" cy="80" r="9" fill="#FBBC04"/>
        <circle cx="29" cy="71" r="9" fill="#FBBC04"/>
        <circle cx="20" cy="50" r="9" fill="#FBBC04"/>
        <circle cx="29" cy="29" r="9" fill="#FBBC04"/>
        <circle cx="50" cy="20" r="9" fill="#FBBC04"/>
        <circle cx="71" cy="29" r="9" fill="#FBBC04"/>
        <circle cx="43" cy="50" r="4.5" fill="#0f172a"/>
        <circle cx="57" cy="50" r="4.5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  7: {
    color: "#38BDF8",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes hop7 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .d7 { animation: hop7 2.1s ease-in-out infinite; }
      </style>
      <g class="d7">
        <circle cx="50" cy="50" r="22" fill="#38BDF8"/>
        <circle cx="64" cy="64" r="20" fill="#38BDF8"/>
        <circle cx="36" cy="64" r="20" fill="#38BDF8"/>
        <circle cx="36" cy="36" r="20" fill="#38BDF8"/>
        <circle cx="64" cy="36" r="20" fill="#38BDF8"/>
        <path d="M42 49 Q45 53 48 49" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M52 49 Q55 53 58 49" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  8: {
    color: "#A855F7",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes float8 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .d8 { animation: float8 2.3s ease-in-out infinite; }
      </style>
      <g class="d8">
        <polygon points="50,14 84,36 84,72 50,94 16,72 16,36" fill="#A855F7"/>
        <rect x="42" y="50" width="5" height="5" transform="rotate(45 44.5 52.5)" fill="#0f172a"/>
        <rect x="54" y="50" width="5" height="5" transform="rotate(45 56.5 52.5)" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  9: {
    color: "#EA4335",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes hop9 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .d9 { animation: hop9 2.5s ease-in-out infinite; }
      </style>
      <g class="d9">
        <circle cx="50" cy="50" r="32" fill="#EA4335"/>
        <circle cx="76" cy="35" r="13" fill="#EA4335"/>
        <circle cx="76" cy="65" r="13" fill="#EA4335"/>
        <circle cx="50" cy="80" r="13" fill="#EA4335"/>
        <circle cx="24" cy="65" r="13" fill="#EA4335"/>
        <circle cx="24" cy="35" r="13" fill="#EA4335"/>
        <circle cx="50" cy="20" r="13" fill="#EA4335"/>
        <path d="M42 49 L45 53 L48 49" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M52 49 L55 53 L58 49" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  10: {
    color: "#FBBC04",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes hop10 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .d10 { animation: hop10 2s ease-in-out infinite; }
      </style>
      <g class="d10">
        <circle cx="50" cy="50" r="40" fill="#FBBC04"/>
        <rect x="43" y="44" width="3" height="12" rx="1.5" fill="#0f172a"/>
        <rect x="54" y="44" width="3" height="12" rx="1.5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  11: {
    color: "#34A853",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes rot11 { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
        .d11 { animation: rot11 2.3s ease-in-out infinite; transform-origin: center; }
      </style>
      <g class="d11">
        <circle cx="50" cy="50" r="32" fill="#34A853"/>
        <circle cx="75" cy="50" r="16" fill="#34A853"/>
        <circle cx="50" cy="75" r="16" fill="#34A853"/>
        <circle cx="25" cy="50" r="16" fill="#34A853"/>
        <circle cx="50" cy="25" r="16" fill="#34A853"/>
        <circle cx="43" cy="50" r="4.5" fill="#0f172a"/>
        <circle cx="57" cy="50" r="4.5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  12: {
    color: "#4285F4",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes hop12 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .d12 { animation: hop12 1.9s ease-in-out infinite; }
      </style>
      <g class="d12">
        <path d="M 50 16 C 28 16 16 32 16 54 C 16 68 20 78 28 82 C 34 85 40 76 50 76 C 60 76 66 85 72 82 C 80 78 84 68 84 54 C 84 32 72 16 50 16 Z" fill="#4285F4"/>
        <circle cx="42" cy="54" r="5" fill="#0f172a"/>
        <circle cx="58" cy="54" r="5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
};

/**
 * Pick EXACTLY ONE random animated dot to attract the recipient
 */
export function getRandomDot() {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return DOTS_1_TO_12_SVG[randKey];
}

/**
 * Render ONLY the single cute animated mascot dot
 * No names, no labels, no extra clutter.
 */
export function renderSingleMascotHtml(dot: { color: string; svg: string }) {
  return `
    <div style="text-align: center; margin: 18px 0 24px 0;">
      <div style="display: inline-block; padding: 14px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);">
        ${dot.svg}
      </div>
    </div>
  `;
}

/**
 * Clean White Website-Style Email Wrapper
 */
function getEmailWrapper(contentHtml: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GDGoC SVEC</title>
        <style>
          body {
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 32px 16px;
            -webkit-font-smoothing: antialiased;
          }
          .card {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            padding: 36px 32px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          }
          .brand-logo-dots {
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
          }
          .brand-dot {
            display: inline-block;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            margin-right: 3px;
          }
          .brand-name {
            display: inline-block;
            font-size: 17px;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.02em;
            vertical-align: middle;
          }
          .title {
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.03em;
            line-height: 1.3;
            margin: 0 0 16px 0;
            text-align: center;
          }
          .paragraph {
            font-size: 15px;
            line-height: 1.65;
            color: #334155;
            margin: 0 0 16px 0;
          }
          .btn-primary {
            display: inline-block;
            background-color: #1a73e8;
            color: #ffffff !important;
            text-decoration: none;
            padding: 13px 28px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: -0.01em;
            box-shadow: 0 4px 12px rgba(26, 115, 232, 0.28);
          }
          .btn-whatsapp {
            display: inline-block;
            background-color: #25D366;
            color: #ffffff !important;
            text-decoration: none;
            padding: 13px 28px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: -0.01em;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.28);
          }
          .footer {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px dashed #e2e8f0;
            font-size: 12px;
            line-height: 1.6;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <!-- Top Brand Header -->
          <div style="margin-bottom: 20px; text-align: center;">
            <div class="brand-logo-dots">
              <span class="brand-dot" style="background-color: #4285F4;"></span>
              <span class="brand-dot" style="background-color: #EA4335;"></span>
              <span class="brand-dot" style="background-color: #FBBC04;"></span>
              <span class="brand-dot" style="background-color: #34A853;"></span>
            </div>
            <span class="brand-name">GDGoC SVEC</span>
          </div>

          <!-- Main Body -->
          ${contentHtml}

          <!-- Footer -->
          <div class="footer">
            <strong>Google Developer Groups on Campus</strong><br>
            Sri Vasavi Engineering College, Tadepalligudem<br>
            Eight tracks. One campus. Everyone building.
          </div>
        </div>
      </body>
    </html>
  `;
}

// 1. Home page Apply Link Email with 1 Random Animated Dot
export async function sendApplyLinkEmail(toEmail: string, applyUrl: string) {
  const mailer = getMailer();
  const singleDot = getRandomDot();
  const mascotHtml = renderSingleMascotHtml(singleDot);

  const html = getEmailWrapper(`
    ${mascotHtml}
    <h1 class="title">Here is your link to apply</h1>
    <p class="paragraph" style="text-align: center;">
      Thanks for your interest in joining <strong>GDGoC SVEC</strong>! Click the button below to fill out your application:
    </p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="${applyUrl}" class="btn-primary">Apply Now &rarr;</a>
    </div>
    <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 18px;">
      Remember to sign in with your Google account before submitting.
    </p>
  `);

  if (!mailer) {
    console.log(`[Email Simulation] To: ${toEmail} | Subject: Your GDGoC SVEC Application Link`);
    return true;
  }

  try {
    await mailer.sendMail({
      from: `"GDGoC SVEC" <${GMAIL_USER}>`,
      to: toEmail,
      subject: "Your GDGoC SVEC Application Link",
      html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send apply link email:", err);
    return false;
  }
}

// 2. Application Submitted Email with 1 Random Animated Dot & WhatsApp Link
export async function sendApplicationSubmittedEmail({
  toEmail,
  studentName,
  applicationId,
  whatsappGroupUrl = "https://chat.whatsapp.com/GDGoCSVEC2026",
}: {
  toEmail: string;
  studentName: string;
  applicationId: string;
  whatsappGroupUrl?: string;
}) {
  const mailer = getMailer();
  const singleDot = getRandomDot();
  const mascotHtml = renderSingleMascotHtml(singleDot);

  const html = getEmailWrapper(`
    ${mascotHtml}
    <h1 class="title">Application Received! 🎉</h1>
    <p class="paragraph">
      Hi <strong>${studentName}</strong>,
    </p>
    <p class="paragraph">
      Your application has been received successfully (Ref: <strong style="font-family: monospace;">${applicationId}</strong>).
    </p>
    <p class="paragraph">
      Please join our official WhatsApp community group for recruitment schedules, interview slots, and announcements:
    </p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="${whatsappGroupUrl}" class="btn-whatsapp">
        Join WhatsApp Updates Group &rarr;
      </a>
    </div>
    <p style="font-size: 13px; color: #64748b; text-align: center;">
      Our leads will review your application and reach out soon.
    </p>
  `);

  if (!mailer) {
    console.log(`[Email Simulation] To: ${toEmail} | Subject: Application Received (${applicationId}) - GDGoC SVEC`);
    return true;
  }

  try {
    await mailer.sendMail({
      from: `"GDGoC SVEC" <${GMAIL_USER}>`,
      to: toEmail,
      subject: `Application Received (${applicationId}) - GDGoC SVEC`,
      html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send application submitted email:", err);
    return false;
  }
}

// 3. Post-Interview Decision Email with 1 Random Animated Dot
export async function sendInterviewFeedbackEmail({
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
  const mailer = getMailer();
  const singleDot = getRandomDot();
  const mascotHtml = renderSingleMascotHtml(singleDot);

  let bodyHtml = "";

  if (decision === "Accepted") {
    bodyHtml = `
      ${mascotHtml}
      <h1 class="title" style="color: #16a34a;">Congratulations ${studentName}! 🚀</h1>
      <p class="paragraph">
        Thank you for attending the interview. You have been selected for the core team at <strong>GDGoC SVEC</strong>!
      </p>
      <div style="text-align: center; margin: 26px 0;">
        <a href="${communityUrl}" class="btn-primary">Join Chapter Platform &rarr;</a>
      </div>
      <p style="font-size: 13px; color: #64748b; text-align: center;">
        Welcome aboard! We will share onboarding details shortly.
      </p>
    `;
  } else {
    bodyHtml = `
      ${mascotHtml}
      <h1 class="title">Thank you for attending your interview, ${studentName}</h1>
      <p class="paragraph">
        Thank you for taking the time to interview with GDGoC SVEC.
      </p>
      <p class="paragraph">
        If you are selected, you will receive an acceptance offer shortly. If not, don't worry — community is open to everyone! Follow our upcoming sessions and build with us:
      </p>
      <div style="text-align: center; margin: 26px 0;">
        <a href="${communityUrl}" class="btn-primary">Follow Our Events &rarr;</a>
      </div>
      <p style="font-size: 13px; color: #64748b; text-align: center;">
        See you at our next workshop and hackathon!
      </p>
    `;
  }

  const html = getEmailWrapper(bodyHtml);

  if (!mailer) {
    console.log(`[Email Simulation] To: ${toEmail} | Subject: GDGoC SVEC Interview Update - ${studentName}`);
    return true;
  }

  try {
    await mailer.sendMail({
      from: `"GDGoC SVEC" <${GMAIL_USER}>`,
      to: toEmail,
      subject: `Update on your GDGoC SVEC Interview - ${studentName}`,
      html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send interview feedback email:", err);
    return false;
  }
}
