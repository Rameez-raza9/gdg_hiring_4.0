// Plain module (no "use client") so server components can import it safely.

export const G = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
} as const;

export const SHAPES = {
  lean: "M40 14 C56 10 64 28 76 44 C90 62 86 84 64 86 L36 86 C14 86 10 66 22 46 C30 32 28 18 40 14Z",
  round: "M50 10 C78 10 90 30 90 54 C90 78 72 90 50 90 C28 90 10 78 10 54 C10 30 22 10 50 10Z",
  squircle: "M30 12 L70 12 C84 12 90 18 90 32 L90 68 C90 82 84 88 70 88 L30 88 C16 88 10 82 10 68 L10 32 C10 18 16 12 30 12Z",
  tall: "M50 8 C70 8 80 26 80 48 C80 72 74 90 50 90 C26 90 20 72 20 48 C20 26 30 8 50 8Z",
} as const;

export type Shape = keyof typeof SHAPES;

export type Track = {
  id: string;
  label: string;
  group: "Technical" | "Non-Technical";
  color: string;
  shape: Shape;
};

export const TRACK_GROUPS: {
  group: "Technical" | "Non-Technical";
  tracks: Track[];
}[] = [
  {
    group: "Technical",
    tracks: [
      { id: "genai-aiml", label: "GenAI & AIML", group: "Technical", color: G.red, shape: "lean" },
      { id: "cloud-devops", label: "Cloud & DevOps", group: "Technical", color: G.blue, shape: "squircle" },
      { id: "web-app", label: "Web and App", group: "Technical", color: G.yellow, shape: "round" },
      { id: "coding", label: "Coding and Programming", group: "Technical", color: G.green, shape: "tall" },
    ],
  },
  {
    group: "Non-Technical",
    tracks: [
      { id: "events", label: "Event Management", group: "Non-Technical", color: G.yellow, shape: "tall" },
      { id: "pr", label: "Public Relations & Outreach", group: "Non-Technical", color: G.green, shape: "lean" },
      { id: "social", label: "Social Media & Marketing", group: "Non-Technical", color: G.blue, shape: "round" },
      { id: "design", label: "Creative Design", group: "Non-Technical", color: G.red, shape: "squircle" },
    ],
  },
];

export const TRACKS: Track[] = TRACK_GROUPS.flatMap((g) => g.tracks);

export const TRACK_ALIASES: Record<string, string> = {
  "coding-programming": "coding",
  "creative-design": "design",
  "event-management": "events",
  "pr-outreach": "pr",
  "social-media-marketing": "social",
};

export const trackById = (id: string): Track => {
  const normalizedId = TRACK_ALIASES[id] || id;
  const found = TRACKS.find((t) => t.id === normalizedId);
  if (found) return found;

  return {
    id,
    label: id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    group: "Technical",
    color: G.blue,
    shape: "lean",
  };
};
