import fs from "fs";
import path from "path";
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
 * 4 Distinct Header Images (h1, h2, h3, h4) from public/assets/headers/
 * Used exactly as provided without modifications.
 */
export const HEADER_KEYS = ["h1", "h2", "h3", "h4"] as const;
export type HeaderKey = (typeof HEADER_KEYS)[number];

export function getRandomHeaderKey(): HeaderKey {
  return HEADER_KEYS[Math.floor(Math.random() * HEADER_KEYS.length)];
}

export function getRandomHeader() {
  return { id: getRandomHeaderKey() };
}

export const FOOTER_LOGO_KEYS = ["l1", "l2", "l3", "l4", "l5"] as const;
export type FooterLogoKey = (typeof FOOTER_LOGO_KEYS)[number];

export function getRandomFooterLogoKey(): FooterLogoKey {
  return FOOTER_LOGO_KEYS[Math.floor(Math.random() * FOOTER_LOGO_KEYS.length)];
}

/**
 * Builds CID inline image attachments for Nodemailer.
 * Embeds:
 * - Exact chosen header image (h1, h2, h3, or h4) as 'emailHeader'
 * - Exact single bigger randomly chosen footer logo image (l1, l2, l3, l4, or l5) as 'footerLogo'
 */
export function getEmailAttachments(headerKey: HeaderKey, footerLogoKey: FooterLogoKey = getRandomFooterLogoKey()) {
  const assetsDir = path.join(process.cwd(), "public", "assets");

  // Exact header image from public/assets/headers/
  const headerExt = fs.existsSync(path.join(assetsDir, "headers", `${headerKey}.png`)) ? "png" : "svg";
  const headerMime = headerExt === "png" ? "image/png" : "image/svg+xml";

  // Exact single bigger footer logo image from public/assets/logos/
  const logoExt = fs.existsSync(path.join(assetsDir, "logos", `${footerLogoKey}.png`)) ? "png" : "svg";
  const logoMime = logoExt === "png" ? "image/png" : "image/svg+xml";

  const attachments: Array<{ filename: string; path: string; cid: string; contentType: string }> = [
    {
      filename: `${headerKey}.${headerExt}`,
      path: path.join(assetsDir, "headers", `${headerKey}.${headerExt}`),
      cid: "emailHeader",
      contentType: headerMime,
    },
    {
      filename: `${footerLogoKey}.${logoExt}`,
      path: path.join(assetsDir, "logos", `${footerLogoKey}.${logoExt}`),
      cid: "footerLogo",
      contentType: logoMime,
    },
  ];

  return attachments;
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
        @keyframes hop4 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .d4 { animation: hop4 2.1s ease-in-out infinite; }
      </style>
      <g class="d4">
        <rect x="18" y="18" width="64" height="64" rx="20" fill="#FBBC04"/>
        <circle cx="42" cy="50" r="5" fill="#0f172a"/>
        <circle cx="58" cy="50" r="5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  5: {
    color: "#4285F4",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes squish5 { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.08, 0.92); } }
        .d5 { animation: squish5 2.5s ease-in-out infinite; transform-origin: center bottom; }
      </style>
      <g class="d5">
        <path d="M 50 12 C 72 12 86 28 86 50 C 86 72 72 88 50 88 C 28 88 14 72 14 50 C 14 28 28 12 50 12 Z" fill="#4285F4"/>
        <circle cx="41" cy="48" r="5" fill="#0f172a"/>
        <circle cx="59" cy="48" r="5" fill="#0f172a"/>
      </g>
    </svg>`,
  },
  6: {
    color: "#EA4335",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes blink6 { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        .d6 { animation: blink6 3s infinite; transform-origin: center; }
      </style>
      <g>
        <circle cx="50" cy="50" r="42" fill="#EA4335"/>
        <g class="d6">
          <ellipse cx="42" cy="48" rx="4.5" ry="5.5" fill="#0f172a"/>
          <ellipse cx="58" cy="48" rx="4.5" ry="5.5" fill="#0f172a"/>
        </g>
      </g>
    </svg>`,
  },
  7: {
    color: "#34A853",
    svg: `<svg viewBox="0 0 100 100" width="84" height="84" style="display:inline-block; vertical-align:middle;">
      <style>
        @keyframes tilt7 { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-8deg); } }
        .d7 { animation: tilt7 2s ease-in-out infinite; transform-origin: center; }
      </style>
      <g class="d7">
        <polygon points="50,14 86,82 14,82" fill="#34A853"/>
        <circle cx="45" cy="58" r="4.5" fill="#0f172a"/>
        <circle cx="55" cy="58" r="4.5" fill="#0f172a"/>
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
 * - Uses exact header images (h1, h2, h3, h4) attached via CID (zero custom header CSS code)
 * - Uses Google Sans font from public/fonts/ (Regular & Bold) with fallbacks
 * - Uses exact footer logos (l1, l2, l3, l4, l5) attached via CID (zero custom code)
 */
function getEmailWrapper(contentHtml: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GDGoC SVEC</title>
        <!-- Google Sans Typography -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          @font-face {
            font-family: 'Google Sans';
            font-style: normal;
            font-weight: 400;
            src: local('Google Sans Regular'), local('GoogleSans-Regular'), local('Google Sans'),
                 url('https://fonts.gstatic.com/s/googlesans/v58/4UaGrENHsxJlGDuGo1OIlL3Kwp5MKg.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Google Sans';
            font-style: normal;
            font-weight: 700;
            src: local('Google Sans Bold'), local('GoogleSans-Bold'), local('Google Sans'),
                 url('https://fonts.gstatic.com/s/googlesans/v58/4UaGrENHsxJlGDuGo1OIlL3Nwp5MKg.woff2') format('woff2');
          }

          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Google Sans', 'GoogleSans-Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 24px 12px;
            -webkit-font-smoothing: antialiased;
          }
          .card {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          }
          .header-img-container {
            width: 100%;
            max-width: 580px;
            margin: 0;
            padding: 0;
            line-height: 0;
            background-color: #ffffff;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
          }
          .header-img {
            display: block;
            width: 100%;
            max-width: 580px;
            height: auto;
            border: 0;
            border-radius: 20px 20px 0 0;
          }
          .body-content {
            padding: 32px 28px;
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
          }
          .title {
            font-family: 'Google Sans', sans-serif !important;
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.02em;
            line-height: 1.3;
            margin: 0 0 16px 0;
            text-align: center;
          }
          .paragraph {
            font-family: 'Google Sans', sans-serif !important;
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
            font-family: 'Google Sans', sans-serif !important;
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
            font-family: 'Google Sans', sans-serif !important;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.28);
          }
          .footer-section {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 26px 20px;
            text-align: center;
            border-radius: 0 0 20px 20px;
          }
          .footer-logo-box {
            text-align: center;
            margin: 0 auto 16px auto;
          }
          .footer-logo-img {
            display: inline-block;
            width: 70px;
            height: auto;
            max-height: 96px;
            border: 0;
          }
          .footer-title {
            font-family: 'Google Sans', sans-serif !important;
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            letter-spacing: -0.01em;
          }
          .footer-meta {
            font-family: 'Google Sans', sans-serif !important;
            font-size: 12px;
            line-height: 1.6;
            color: #64748b;
          }
          .footer-lead-link {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <!-- Exact Header Image (Randomly selected from h1, h2, h3, h4 without editing) -->
          <div class="header-img-container">
            <img src="cid:emailHeader" alt="GDGoC SVEC Header" class="header-img" width="580" />
          </div>

          <!-- Main Body Content -->
          <div class="body-content">
            ${contentHtml}
          </div>

          <!-- Single Bigger Random Footer Logo (Exact image from l1 to l5 without editing) -->
          <div class="footer-section">
            <div class="footer-logo-box">
              <img src="cid:footerLogo" alt="GDGoC Chapter Emblem" class="footer-logo-img" width="70" height="96" />
            </div>
            <div class="footer-title">
              Google Developer Groups on Campus &bull; SVEC
            </div>
            <div class="footer-meta">
              Sri Vasavi Engineering College, Pedatadepalli, Tadepalligudem<br>
              Contact Chapter Lead: <a href="mailto:vinaysiddha19@gmail.com" class="footer-lead-link">vinaysiddha19@gmail.com</a><br>
              Eight tracks. One campus. Everyone building.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// 1. Home page Apply Link Email
export async function sendApplyLinkEmail(toEmail: string, applyUrl: string) {
  const mailer = getMailer();
  const headerKey = getRandomHeaderKey();
  const footerLogoKey = getRandomFooterLogoKey();
  const singleDot = getRandomDot();
  const mascotHtml = renderSingleMascotHtml(singleDot);

  const html = getEmailWrapper(`
    ${mascotHtml}
    <h1 class="title">Here is your link to apply</h1>
    <p class="paragraph" style="text-align: center;">
      Thanks for your interest in joining <strong>GDGoC SVEC</strong>! Click the button below to start your application:
    </p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="${applyUrl}" class="btn-primary">Apply Now &rarr;</a>
    </div>
    <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 18px;">
      Remember to sign in with your Google account before submitting your application.
    </p>
  `);

  const attachments = getEmailAttachments(headerKey, footerLogoKey);

  if (!mailer) {
    console.log(`[Email Simulation] To: ${toEmail} | Header: ${headerKey} | FooterLogo: ${footerLogoKey} | Subject: Your GDGoC SVEC Application Link`);
    return true;
  }

  try {
    await mailer.sendMail({
      from: `"GDGoC SVEC" <${GMAIL_USER}>`,
      to: toEmail,
      subject: "Your GDGoC SVEC Application Link",
      html,
      attachments,
    });
    return true;
  } catch (err) {
    console.error("Failed to send apply link email:", err);
    return false;
  }
}

// 2. Application Submitted Email with WhatsApp Link
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
  const headerKey = getRandomHeaderKey();
  const footerLogoKey = getRandomFooterLogoKey();
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
      Please join our official WhatsApp community group for recruitment schedules, interview slots, and chapter announcements:
    </p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="${whatsappGroupUrl}" class="btn-whatsapp">
        Join WhatsApp Updates Group &rarr;
      </a>
    </div>
    <p style="font-size: 13px; color: #64748b; text-align: center;">
      Our leads will review your application and reach out shortly.
    </p>
  `);

  const attachments = getEmailAttachments(headerKey, footerLogoKey);

  if (!mailer) {
    console.log(`[Email Simulation] To: ${toEmail} | Header: ${headerKey} | FooterLogo: ${footerLogoKey} | Subject: Application Received (${applicationId}) - GDGoC SVEC`);
    return true;
  }

  try {
    await mailer.sendMail({
      from: `"GDGoC SVEC" <${GMAIL_USER}>`,
      to: toEmail,
      subject: `Application Received (${applicationId}) - GDGoC SVEC`,
      html,
      attachments,
    });
    return true;
  } catch (err) {
    console.error("Failed to send application submitted email:", err);
    return false;
  }
}

// 3. Post-Interview Decision Email
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
  const headerKey = getRandomHeaderKey();
  const footerLogoKey = getRandomFooterLogoKey();
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
        If you are selected, you will receive an acceptance offer shortly. If not, don't worry — our community is open to everyone! Follow our upcoming sessions and build with us:
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
  const attachments = getEmailAttachments(headerKey, footerLogoKey);

  if (!mailer) {
    console.log(`[Email Simulation] To: ${toEmail} | Header: ${headerKey} | FooterLogo: ${footerLogoKey} | Subject: GDGoC SVEC Interview Update - ${studentName}`);
    return true;
  }

  try {
    await mailer.sendMail({
      from: `"GDGoC SVEC" <${GMAIL_USER}>`,
      to: toEmail,
      subject: `Update on your GDGoC SVEC Interview - ${studentName}`,
      html,
      attachments,
    });
    return true;
  } catch (err) {
    console.error("Failed to send interview feedback email:", err);
    return false;
  }
}

// 4. Admin Access Request Email sent to vinaysiddha19@gmail.com
export async function sendAdminAccessRequestEmail({
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
  const mailer = getMailer();
  const headerKey = getRandomHeaderKey();
  const footerLogoKey = getRandomFooterLogoKey();
  const singleDot = getRandomDot();
  const mascotHtml = renderSingleMascotHtml(singleDot);

  const html = getEmailWrapper(`
    ${mascotHtml}
    <h1 class="title">New RBAC Access Request 🛡️</h1>
    <p class="paragraph">
      Hi Vinay,
    </p>
    <p class="paragraph">
      A user has requested elevated role privileges in the GDGoC SVEC Admin Portal:
    </p>
    <div style="background-color: #f1f5f9; padding: 18px; border-radius: 14px; margin: 18px 0; border: 1px solid #cbd5e1;">
      <p style="margin: 4px 0; font-size: 14px;"><strong>User Name:</strong> ${userName}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${userEmail}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Current Role:</strong> <span style="background: #e2e8f0; padding: 2px 8px; border-radius: 6px;">${currentRole}</span></p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Requested Role:</strong> <span style="background: #dbeafe; color: #1e40af; font-weight: 600; padding: 2px 8px; border-radius: 6px;">${requestedRole}</span></p>
      ${reason ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #475569;"><strong>Reason:</strong> ${reason}</p>` : ""}
    </div>
    <p class="paragraph">
      You can grant or update their role directly in the Admin Panel:
    </p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="https://gdg-hiring-4-0.vercel.app/admin/users" class="btn-primary">Manage Users & RBAC &rarr;</a>
    </div>
  `);

  const attachments = getEmailAttachments(headerKey, footerLogoKey);

  if (!mailer) {
    console.log(`[Email Simulation] To: vinaysiddha19@gmail.com | Header: ${headerKey} | FooterLogo: ${footerLogoKey} | Subject: [RBAC Request] ${userName} requests ${requestedRole} access`);
    return true;
  }

  try {
    await mailer.sendMail({
      from: `"GDGoC SVEC Portal" <${GMAIL_USER}>`,
      to: "vinaysiddha19@gmail.com",
      replyTo: userEmail,
      subject: `[RBAC Request] ${userName} requests ${requestedRole} role`,
      html,
      attachments,
    });
    return true;
  } catch (err) {
    console.error("Failed to send admin access request email:", err);
    return false;
  }
}
