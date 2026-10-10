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

export const APPLICATIONS: Application[] = [
  {
    id: "A-1001",
    name: "K. Sai Teja",
    email: "saiteja.k@svec.edu.in",
    phone: "+91 9848022338",
    roll: "22A81A0501",
    branch: "CSE",
    year: 3,
    tracks: ["genai-aiml", "cloud-devops"],
    status: "Shortlisted",
    submitted: "2026-10-02",
    why: "Active member of open source clubs, built RAG pipelines using Gemini API, seeking to mentor junior builders in GDGoC SVEC.",
    link: "https://github.com/saiteja-k",
    reviews: [
      { reviewer: "Vinay Siddha", reviewerColor: G.blue, score: 5, recommend: "Yes", note: "Outstanding Gemini API knowledge and strong leadership attitude.", date: "2026-10-03" },
      { reviewer: "Madhu Somala", reviewerColor: G.yellow, score: 4, recommend: "Yes", note: "Demonstrated deep cloud experience with hands-on projects.", date: "2026-10-04" },
    ],
  },
  {
    id: "A-1002",
    name: "P. Bhavya Sri",
    email: "bhavyasri.p@svec.edu.in",
    phone: "+91 9440123456",
    roll: "23A81A05B4",
    branch: "AI & DS",
    year: 2,
    tracks: ["genai-aiml"],
    status: "Interview",
    submitted: "2026-10-04",
    why: "Keen on fine-tuning vision and language models, eager to conduct interactive sessions on modern deep learning frameworks.",
    link: "https://github.com/bhavyasri",
    reviews: [
      { reviewer: "Jaswanth Thota", reviewerColor: G.red, score: 4, recommend: "Yes", note: "Very focused on AI/ML and willing to lead peer cohorts.", date: "2026-10-05" },
    ],
  },
  {
    id: "A-1003",
    name: "V. Chaitanya Krishna",
    email: "chaitanya.v@svec.edu.in",
    phone: "+91 9866554433",
    roll: "22A81A1208",
    branch: "IT",
    year: 3,
    tracks: ["web-app", "coding"],
    status: "Accepted",
    submitted: "2026-09-28",
    why: "Full stack developer proficient with Next.js, React 19, TypeScript and Tailwind CSS. Built college portals and hackathon winning apps.",
    link: "https://github.com/chaitanyakrishna",
    reviews: [
      { reviewer: "Rohith Goli", reviewerColor: G.green, score: 5, recommend: "Yes", note: "Superb Next.js and frontend skills. Ready to ship club projects immediately.", date: "2026-09-29" },
    ],
  },
  {
    id: "A-1004",
    name: "M. Durga Prasad",
    email: "durgaprasad.m@svec.edu.in",
    phone: "+91 9121234567",
    roll: "24A81A0412",
    branch: "ECE",
    year: 1,
    tracks: ["cloud-devops"],
    status: "In review",
    submitted: "2026-10-06",
    why: "Passionate about Docker, Linux systems, and cloud fundamentals. Want to gain hands-on production deployment experience.",
    link: "https://github.com/durgaprasad-m",
    reviews: [
      { reviewer: "A. V. S. S. S. K. Koushik", reviewerColor: G.blue, score: 4, recommend: "Maybe", note: "Strong curiosity in Docker. Solid potential for year 1 student.", date: "2026-10-07" },
    ],
  },
  {
    id: "A-1005",
    name: "G. Harini",
    email: "harini.g@svec.edu.in",
    phone: "+91 9988776655",
    roll: "23A81A0589",
    branch: "CSE",
    year: 2,
    tracks: ["design", "events"],
    status: "Accepted",
    submitted: "2026-09-30",
    why: "Designed branding and flyers for college tech fest, proficient in Figma and community storytelling.",
    link: "https://figma.com/@harinig",
    reviews: [
      { reviewer: "S. P. V. Sai Akhil", reviewerColor: G.yellow, score: 5, recommend: "Yes", note: "Impressive portfolio in Figma with clean typography.", date: "2026-10-01" },
    ],
  },
  {
    id: "A-1006",
    name: "N. Rakesh",
    email: "rakesh.n@svec.edu.in",
    phone: "+91 9700112233",
    roll: "24A81A0215",
    branch: "EEE",
    year: 1,
    tracks: ["coding"],
    status: "New",
    submitted: "2026-10-08",
    why: "Competitive programmer solving LeetCode daily, eager to participate in Google Solution Challenge.",
    link: "https://github.com/rakesh-n",
    reviews: [],
  },
  {
    id: "A-1007",
    name: "S. Sneha Latha",
    email: "snehalatha.s@svec.edu.in",
    phone: "+91 9490887766",
    roll: "22A81A05G1",
    branch: "CSE",
    year: 3,
    tracks: ["social", "pr"],
    status: "Shortlisted",
    submitted: "2026-10-05",
    why: "Active social media coordinator, helped drive 500+ registrations for campus events.",
    link: "https://linkedin.com/in/snehalatha",
    reviews: [
      { reviewer: "R. Shanmuka Rao", reviewerColor: G.red, score: 4, recommend: "Yes", note: "High energy and strong interpersonal communication skills.", date: "2026-10-06" },
    ],
  },
  {
    id: "A-1008",
    name: "D. Varun Tej",
    email: "varuntej.d@svec.edu.in",
    phone: "+91 9618112244",
    roll: "23A81A4210",
    branch: "AI & DS",
    year: 2,
    tracks: ["web-app"],
    status: "New",
    submitted: "2026-10-09",
    why: "Front-end engineer building accessible React applications and looking to contribute to SVEC web initiatives.",
    link: "https://github.com/varuntej-d",
    reviews: [],
  },
];

/* ---------- Database Fetchers (Turso Cloud) ---------- */

export async function fetchLiveApplications(): Promise<Application[]> {
  try {
    const [res, revRes] = await Promise.all([
      turso.execute("SELECT * FROM applications ORDER BY submitted DESC"),
      turso.execute("SELECT * FROM reviews ORDER BY created_at DESC"),
    ]);

    if (!res.rows.length) return APPLICATIONS;

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
        reviews: reviewsByApp[String(r.id)] || [],
      };
    });
  } catch (error) {
    console.error("Failed to fetch live applications from Turso:", error);
    return APPLICATIONS;
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
export const dailyCounts = () => {
  const map = countBy(APPLICATIONS, (a) => a.submitted);
  const dates = Array.from(map.keys()).sort();
  return dates.map((date) => ({ date, count: map.get(date) ?? 0 }));
};
