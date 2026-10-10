// Production Data Layer for GDGoC SVEC Admin and Recruitment
// Connects to Turso Cloud SQLite database with fallback defaults.

import { G, TRACKS } from "@/lib/brand";
import { turso } from "@/lib/turso";

export type Status =
  | "New"
  | "In review"
  | "Shortlisted"
  | "Interview"
  | "Accepted"
  | "Rejected";

export const STATUSES: Status[] = [
  "New",
  "In review",
  "Shortlisted",
  "Interview",
  "Accepted",
  "Rejected",
];

export const STATUS_COLOR: Record<Status, string> = {
  New: "#8d97b3",
  "In review": G.blue,
  Shortlisted: G.yellow,
  Interview: "#A142F4",
  Accepted: G.green,
  Rejected: G.red,
};

export type Role = "Admin" | "Lead" | "Reviewer" | "Member";
export type UserStatus = "Active" | "Invited" | "Suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastActive: string;
  color: string;
};

export type Review = {
  reviewer: string;
  reviewerColor: string;
  score: number; // 1-5
  recommend: "Yes" | "Maybe" | "No";
  note: string;
  date: string; // ISO
};

export type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roll: string;
  branch: string;
  year: number;
  tracks: string[]; // track ids
  status: Status;
  submitted: string; // ISO date
  why: string;
  link?: string;
  otherClubs?: string[];
  clubRole?: string;
  extraLinks?: { label: string; url: string }[];
  reviews: Review[];
};

export const USERS: User[] = [
  { id: "Zmut7C1IotTdvYGpBv0QdK3C8I42", name: "Vinay Siddha", email: "vinaysiddha19@gmail.com", role: "Admin", status: "Active", lastActive: "Just now", color: G.blue },
  { id: "u_jaswanth", name: "Jaswanth Thota", email: "jaswanththota@svec.edu.in", role: "Member", status: "Active", lastActive: "10 min ago", color: G.red },
  { id: "u_madhu", name: "Madhu Somala", email: "madhusomala@svec.edu.in", role: "Member", status: "Active", lastActive: "1 hour ago", color: G.yellow },
  { id: "u_rohith", name: "Rohith Goli", email: "rohithgoli@svec.edu.in", role: "Member", status: "Active", lastActive: "2 hours ago", color: G.green },
  { id: "u_meghana", name: "K. L. M. Meghana", email: "klmmeghana@svec.edu.in", role: "Member", status: "Active", lastActive: "Yesterday", color: G.green },
  { id: "u_koushik", name: "A. V. S. S. S. K. Koushik", email: "koushikofficial@svec.edu.in", role: "Member", status: "Active", lastActive: "Today", color: G.blue },
  { id: "u_saiakhil", name: "S. P. V. Sai Akhil", email: "saiakhil@svec.edu.in", role: "Member", status: "Active", lastActive: "Today", color: G.yellow },
  { id: "u_shanmuka", name: "R. Shanmuka Rao", email: "shanmukarao@svec.edu.in", role: "Member", status: "Active", lastActive: "3 days ago", color: G.red },
];

export const REVIEWERS = USERS.filter((u) => ["Admin"].includes(u.role) && u.status === "Active");

export const APPLICATIONS: Application[] = [];

/* ---------- Database Fetchers (Turso Cloud) ---------- */

export async function fetchLiveApplications(): Promise<Application[]> {
  try {
    const [res, revRes] = await Promise.all([
      turso.execute("SELECT * FROM applications ORDER BY submitted DESC"),
      turso.execute("SELECT * FROM reviews ORDER BY created_at DESC"),
    ]);

    if (!res.rows.length) return [];

    const reviewsByApp: Record<string, Review[]> = {};

    for (const r of revRes.rows) {
      const appId = String(r.application_id);
      if (!reviewsByApp[appId]) reviewsByApp[appId] = [];
      reviewsByApp[appId].push({
        reviewer: String(r.reviewer || "Reviewer"),
        reviewerColor: colorFor(String(r.reviewer || "R")),
        score: Math.round(Number(r.average_score || 4)),
        recommend: (String(r.decision || "Yes") as "Yes" | "Maybe" | "No"),
        note: String(r.note || ""),
        date: String(r.created_at || "2026-10-09").slice(0, 10),
      });
    }

    return res.rows.map((r) => {
      let tracks: string[] = [];
      try {
        tracks = JSON.parse(String(r.tracks || "[]"));
      } catch {
        tracks = [];
      }

      let otherClubs: string[] = [];
      try {
        otherClubs = JSON.parse(String(r.other_clubs || "[]"));
      } catch {
        otherClubs = [];
      }

      let extraLinks: { label: string; url: string }[] = [];
      try {
        extraLinks = JSON.parse(String(r.extra_links || "[]"));
      } catch {
        extraLinks = [];
      }

      return {
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        phone: String(r.phone || ""),
        roll: String(r.roll || ""),
        branch: String(r.branch || "General"),
        year: Number(r.year || 1),
        tracks,
        status: (String(r.status || "New") as Status),
        submitted: String(r.submitted || "2026-10-09"),
        why: String(r.why || ""),
        link: r.link ? String(r.link) : undefined,
        otherClubs,
        clubRole: r.club_role ? String(r.club_role) : undefined,
        extraLinks,
        reviews: reviewsByApp[String(r.id)] || [],
      };
    });
  } catch (error) {
    console.error("Failed to fetch live applications from Turso:", error);
    return [];
  }
}

export async function fetchLiveUsers(): Promise<User[]> {
  try {
    const res = await turso.execute(`
      SELECT * FROM users 
      ORDER BY 
        CASE WHEN LOWER(email) = 'vinaysiddha19@gmail.com' THEN 0 ELSE 1 END,
        created_at ASC
    `);
    if (!res.rows.length) return USERS;

    return res.rows.map((u) => {
      const email = String(u.email || "");
      const isSuperAdmin = email.trim().toLowerCase() === "vinaysiddha19@gmail.com";
      const role = (isSuperAdmin ? "Admin" : String(u.role || "Member")) as Role;
      const name = String(u.name || email.split("@")[0]);

      return {
        id: String(u.id),
        name,
        email,
        role,
        status: (String(u.status || "Active") as UserStatus),
        lastActive: u.last_active ? String(u.last_active).slice(0, 16) : "Recent",
        color: colorFor(name),
      };
    });
  } catch (error) {
    console.error("Failed to fetch live users from Turso:", error);
    return USERS;
  }
}

/* ---------- helpers ---------- */

export const TODAY = "2026-10-09";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDate = (isoDate: string) => {
  if (!isoDate || !isoDate.includes("-")) return isoDate;
  const parts = isoDate.split("-").map(Number);
  if (parts.length < 3) return isoDate;
  const [, m, d] = parts;
  return `${d} ${MONTHS[(m || 1) - 1]}`;
};

export const avgScore = (a: Application) =>
  a.reviews.length ? a.reviews.reduce((s, r) => s + r.score, 0) / a.reviews.length : 0;

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const colorFor = (key: string) => {
  const palette = [G.blue, G.red, G.yellow, G.green];
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return palette[h % 4];
};

export const countBy = <T,>(items: T[], key: (t: T) => string) => {
  const m = new Map<string, number>();
  items.forEach((i) => m.set(key(i), (m.get(key(i)) ?? 0) + 1));
  return m;
};

/** applications per day across the window, for trend charts */
export const dailyCounts = (apps: Application[] = []) => {
  const map = countBy(apps, (a) => a.submitted);
  const dates = Array.from(map.keys()).sort();
  return dates.map((date) => ({ date, count: map.get(date) ?? 0 }));
};
