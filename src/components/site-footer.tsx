import Link from "next/link";
import { MapPin } from "lucide-react";
import { G, TRACK_GROUPS } from "@/lib/brand";

const COLORS = [G.blue, G.red, G.yellow, G.green];

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
  { label: "FAQ", href: "/faq" },
  { label: "Apply now", href: "/apply" },
  { label: "Login", href: "/login" },
];

const linkCls = "text-sm text-muted-foreground transition-colors hover:text-foreground";
const headCls = "mb-4 text-sm font-medium";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 pb-32 pt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.6fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
              <span className="grid grid-cols-2 gap-[3px]" aria-hidden="true">
                {COLORS.map((c) => (
                  <i key={c} className="size-2.5 rounded-full" style={{ background: c }} />
                ))}
              </span>
              GDGoC SVEC
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Google Developer Groups on Campus at Sri Vasavi Engineering
              College. Students learning and building together.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
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

          {/* Tracks */}
          <div>
            <p className={headCls}>Tracks</p>
            <div className="grid gap-8 sm:grid-cols-2">
              {TRACK_GROUPS.map((g) => (
                <div key={g.group}>
                  <p className="mb-3 text-xs text-muted-foreground/70">{g.group}</p>
                  <ul className="space-y-3">
                    {g.tracks.map((t) => (
                      <li key={t.id} className="flex items-start gap-2.5">
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full"
                          style={{ background: t.color }}
                          aria-hidden="true"
                        />
                        <Link href="/apply" className={linkCls}>{t.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className={headCls}>Find us</p>
            <p className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              Sri Vasavi Engineering College, Pedatadepalli, Tadepalligudem, West Godavari District, Andhra Pradesh - 534101
            </p>
            <a
              href="https://gdg.community.dev/gdg-on-campus-sri-vasavi-engineering-college-tadepalligudem-india/"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:border-foreground/40"
            >
              Community page
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 GDGoC SVEC. Built by students.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex gap-1.5" aria-hidden="true">
              {COLORS.map((c) => (
                <i key={c} className="size-1.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <Link href="/admin" className="text-xs text-muted-foreground/70 hover:text-foreground">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
