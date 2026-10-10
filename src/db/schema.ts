/**
 * TypeScript Type Definitions representing the Database Schema
 * for GDGoC SVEC (Recruitment & Hiring 4.0)
 * Database Engine: Turso Cloud SQLite
 */

export type ApplicationStatus =
  | "New"
  | "In review"
  | "Shortlisted"
  | "Interview"
  | "Accepted"
  | "Rejected";

export interface ApplicationRecord {
  /** Unique applicant tracking ID, e.g. 'A-1001' */
  id: string;
  /** Full student name */
  name: string;
  /** College or personal email address */
  email: string;
  /** Phone number with WhatsApp */
  phone: string | null;
  /** College student roll number, e.g. '22A81A0501' */
  roll: string | null;
  /** Engineering department, e.g. 'CSE', 'IT', 'AI & DS' */
  branch: string | null;
  /** Academic year of study: '1', '2', '3', '4' */
  year: string | null;
  /** Serialized JSON string array of selected tracks: '["genai-aiml","web-app"]' */
  tracks: string;
  /** Statement of interest & motivation */
  why: string | null;
  /** Primary URL link to Portfolio, GitHub, or LinkedIn */
  link: string | null;
  /** JSON array of other clubs student belongs to */
  other_clubs?: string | null;
  /** Role in other clubs: 'Member' | 'Associate' | 'Lead' */
  club_role?: string | null;
  /** JSON array of dynamic extra links added with + button */
  extra_links?: string | null;
  /** Current evaluation status in recruitment pipeline */
  status: ApplicationStatus;
  /** ISO Date string of application submission (YYYY-MM-DD) */
  submitted: string;
  /** Timestamp record was created in database */
  created_at?: string;
}

export type ReviewDecision = "Shortlisted" | "Interview" | "Accepted" | "Rejected" | "In review";

export interface ReviewRecord {
  /** Auto-incrementing review record ID */
  id: number;
  /** Reference to applications.id */
  application_id: string;
  /** Display name of the reviewer */
  reviewer: string;
  /** Email of the reviewer */
  reviewer_email: string | null;
  /** Rating 1-5 for Technical skills and potential */
  rating_skills: number;
  /** Rating 1-5 for Motivation and dedication */
  rating_motivation: number;
  /** Rating 1-5 for Communication skills */
  rating_communication: number;
  /** Rating 1-5 for Team and culture fit */
  rating_fit: number;
  /** Average computed score across ratings */
  average_score: number;
  /** Qualitative notes for the review committee */
  note: string | null;
  /** Hiring recommendation or stage decision */
  decision: ReviewDecision | null;
  /** ISO Timestamp of review submission */
  created_at?: string;
}

export type UserRole = "Admin" | "Lead" | "Reviewer" | "Member";
export type UserStatus = "Active" | "Invited" | "Suspended";

export interface UserRecord {
  /** Firebase Auth UID or generated user ID */
  id: string;
  /** Display name */
  name: string | null;
  /** Email address used to sign in */
  email: string;
  /** Assigned RBAC role */
  role: UserRole;
  /** Account status */
  status: UserStatus;
  /** Google profile avatar URL */
  photo_url: string | null;
  /** Timestamp of most recent activity */
  last_active: string;
  /** Timestamp account was created */
  created_at: string;
}

export interface EventRecord {
  /** Event ID e.g. 'EV-101' */
  id: string;
  /** Title of the chapter workshop / event */
  title: string;
  /** Date of the event (YYYY-MM-DD) */
  date: string;
  /** Venue of the event */
  venue: string;
  /** Related track */
  track: string | null;
  /** Timestamp created */
  created_at: string;
}

export interface AttendanceRecord {
  /** Auto-increment ID */
  id: number;
  /** Reference to events.id */
  event_id: string;
  /** Optional reference to applications.id */
  application_id: string | null;
  /** Student participant name */
  student_name: string;
  /** College student roll number */
  roll_number: string;
  /** Department */
  branch: string;
  /** Section: 'A', 'B', 'C', 'D' */
  section: string;
  /** Attendance mark: 'Present' | 'Absent' */
  status: "Present" | "Absent";
  /** Timestamp attendance was recorded */
  marked_at: string;
}

export interface SettingRecord {
  /** Setting key e.g. 'applications_open' */
  key: string;
  /** Value string e.g. 'true' | 'false' */
  value: string;
  /** Timestamp last modified */
  updated_at: string;
}
