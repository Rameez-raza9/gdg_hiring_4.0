// Teams from the GDG 4.0 org chart. Safe to import from client components.
import { G, type Shape } from "@/lib/brand";

export type TeamName = "Architect" | "Pioneer" | "Creator" | "Connector";

export const TEAMS: Record<TeamName, { color: string; shape: Shape; line: string; roles: string[] }> = {
  Architect: {
    color: G.green,
    shape: "squircle",
    line: "You build what the community runs on.",
    roles: ["Web Development Lead", "App Development Lead", "AI & Emerging Tech Lead"],
  },
  Pioneer: {
    color: "#A142F4",
    shape: "round",
    line: "You shape how GDG looks, feels and is remembered.",
    roles: ["UI/UX & Design Lead", "Photography & Videography Lead"],
  },
  Creator: {
    color: G.yellow,
    shape: "tall",
    line: "You are the voice that brings people in.",
    roles: ["Media & Marketing Lead", "PR Lead"],
  },
  Connector: {
    color: G.blue,
    shape: "lean",
    line: "You keep people, plans and events moving together.",
    roles: ["People & HR Lead", "Events & Operations Lead"],
  },
};

export type Outcome = "Accepted" | "Waitlist" | "Not selected";

export type ResultEntry = {
  email: string;
  roll: string;
  name: string;
  outcome: Outcome;
  team?: TeamName;
  role?: string;
  no?: number;
};
