"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, MapPin, Send, CheckCircle2, Loader2, ShieldCheck, FileText } from "lucide-react";
import { TRACK_GROUPS } from "@/lib/brand";

const FOOTER_LOGOS = ["l1", "l2", "l3", "l4", "l5"] as const;

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
  { label: "GitHub", href: "https://github.com", Icon: GithubIcon },
  { label: "X (Twitter)", href: "https://x.com", Icon: TwitterIcon },
];

const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "Team", href: "/#team" },
  { label: "FAQ & Answers", href: "/faq" },
  { label: "Apply Now", href: "/apply" },
  { label: "Login Portal", href: "/login" },
];

const linkCls = "text-sm text-muted-foreground transition-colors hover:text-foreground";
const headCls = "mb-4 text-sm font-semibold tracking-tight text-foreground";

export default function SiteFooter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Terms and Privacy modal state
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Single bigger random footer logo
  const [randomLogo, setRandomLogo] = useState<string>("l1");
  useEffect(() => {
    const chosen = FOOTER_LOGOS[Math.floor(Math.random() * FOOTER_LOGOS.length)];
    setRandomLogo(chosen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      console.error("Failed to send contact message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="border-t border-border bg-slate-50/70 pb-24 pt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_1.1fr_1.4fr]">
          {/* 1. Brand with Official Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground">
              <img
                src="/assets/logos/main_logo.jpeg"
                alt="GDGoC SVEC Logo"
                className="size-8 rounded-lg object-contain border border-border shadow-xs"
              />
              <span>GDGoC SVEC</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Google Developer Groups on Campus at Sri Vasavi Engineering College.
              A student-led community exploring AI, Cloud, Web, Design, and real-world technology.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            {/* Single Bigger Random Footer Logo */}
            <div className="mt-5">
              <img
                src={`/assets/logos/${randomLogo}.svg`}
                alt="GDGoC Chapter Emblem"
                className="h-16 w-auto object-contain transition-transform hover:scale-105 duration-200"
              />
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 text-blue-600" />
                <span>Chapter Lead: <a href="mailto:vinaysiddha19@gmail.com" className="text-foreground hover:underline font-medium">vinaysiddha19@gmail.com</a></span>
              </p>
              <p className="flex items-start gap-2 mt-2 leading-relaxed">
                <MapPin className="size-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>Sri Vasavi Engineering College, Pedatadepalli, Tadepalligudem - 534101</span>
              </p>
            </div>
          </div>

          {/* 2. Explore Navigation */}
          <nav aria-label="Explore">
            <p className={headCls}>Explore</p>
            <ul className="space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkCls}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. Recruitment Tracks */}
          <div>
            <p className={headCls}>Recruitment Tracks</p>
            <div className="space-y-4">
              {TRACK_GROUPS.map((g) => (
                <div key={g.group}>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{g.group}</p>
                  <ul className="space-y-2">
                    {g.tracks.map((t) => (
                      <li key={t.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="size-1.5 rounded-full shrink-0" style={{ background: t.color }} />
                        <Link href="/apply" className="hover:text-foreground">{t.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Interactive Clean Contact Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="size-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Get in touch with us</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Have questions about recruitment, sponsorship, or events? Messages are delivered to <strong>vinaysiddha19@gmail.com</strong>.
            </p>

            {sent ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="size-8 text-green-600 mx-auto" />
                <p className="text-sm font-semibold text-foreground">Message Dispatched!</p>
                <p className="text-xs text-muted-foreground">
                  Thank you for reaching out. Our chapter lead will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-3 text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-foreground/40 text-foreground"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email (student@svec.edu.in)"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-foreground/40 text-foreground"
                />
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-foreground/40 text-foreground"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2.5 text-xs font-semibold transition hover:brightness-105 cursor-pointer disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar & Terms and Conditions Modal triggers */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 GDGoC SVEC. All rights reserved. Supported by Google Developers.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <button
              onClick={() => setShowTerms(true)}
              className="hover:text-foreground transition cursor-pointer underline-offset-4 hover:underline"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => setShowPrivacy(true)}
              className="hover:text-foreground transition cursor-pointer underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <Link href="/admin" className="hover:text-foreground transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-3 text-foreground font-semibold text-base">
              <FileText className="size-5 text-blue-600" />
              <h3>Terms and Conditions</h3>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                <strong>1. Acceptance of Community Terms:</strong> By joining GDGoC SVEC or submitting an application for recruitment, participants agree to uphold an inclusive, collaborative, and respectful environment aligned with Google Community Guidelines.
              </p>
              <p>
                <strong>2. Academic Eligibility:</strong> Recruitment is open to bona fide students of Sri Vasavi Engineering College (SVEC). All student records provided during registration are verified against college credentials.
              </p>
              <p>
                <strong>3. Project &amp; Contribution Ethics:</strong> All code, designs, and content developed as part of GDGoC SVEC hackathons or workshops must adhere to intellectual property rules and avoid plagiarism.
              </p>
              <p>
                <strong>4. Code of Conduct:</strong> Harassment, academic dishonesty, unauthorized access to administrative systems, or disruptive behavior during events may result in revocation of membership privileges.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTerms(false)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:brightness-105 cursor-pointer"
              >
                Close Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-3 text-foreground font-semibold text-base">
              <ShieldCheck className="size-5 text-green-600" />
              <h3>Privacy Policy</h3>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                <strong>1. Information Collection:</strong> We collect student names, college email addresses, roll numbers, branches, and portfolios solely to process chapter applications and send verified interview and workshop notifications.
              </p>
              <p>
                <strong>2. Data Usage &amp; Security:</strong> Student data is stored in our secured Turso Cloud database with role-based access control. Information is never sold, shared with third-party advertisers, or used outside chapter activities.
              </p>
              <p>
                <strong>3. Communications:</strong> We use your email to deliver application status updates, interview schedules, and attendance records. You may contact <code>vinaysiddha19@gmail.com</code> at any time to request data modification or removal.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPrivacy(false)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:brightness-105 cursor-pointer"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
