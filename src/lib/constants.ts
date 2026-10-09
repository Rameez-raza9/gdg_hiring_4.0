// ─── Site ────────────────────────────────────────────────────────────────────
export const SITE_NAME = "GDGoC SVEC";
export const SITE_URL = "gdgoc-svec.vercel.app";
export const SITE_DESCRIPTION =
  "Hands-on workshops, hackathons and study jams by students, for students at Sri Vasavi Engineering College, Tadepalligudem.";

// ─── Navigation ──────────────────────────────────────────────────────────────
export interface DropdownItem {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Events",
    href: "/events",
    hasDropdown: true,
    dropdownItems: [
      { label: "Upcoming", href: "/events/upcoming" },
      { label: "Past", href: "/events/past" },
      { label: "Workshops", href: "/events/workshops" },
    ],
  },
  { label: "Team", href: "/team" },
  { label: "About us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
];

// ─── Hero ────────────────────────────────────────────────────────────────────
export const HERO_DESCRIPTION =
  "Hands-on workshops, hackathons and study jams by students, for students. Level up your skills in Android, Web, Cloud and AI with Google technologies.";

export const EMAIL_PLACEHOLDER = "Enter your college email";

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "250+", label: "Active members" },
  { value: "20+", label: "Events hosted" },
];

// ─── Rating ──────────────────────────────────────────────────────────────────
export const AVERAGE_RATING = 4.5;
export const RATING_TEXT = "Average event rating";

// ─── Cookie ──────────────────────────────────────────────────────────────────
export const COOKIE_STORAGE_KEY = "cookie-consent";
