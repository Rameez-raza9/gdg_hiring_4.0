-- ==============================================================================
-- GDG On Campus SVEC (Recruitment & Hiring 4.0) Database Schema
-- Database: Turso Cloud SQLite (libsql)
-- Description: Comprehensive relational schema capturing Applicants, Reviewers,
--              Reviews/Evaluations, Role-Based Access Control (RBAC), Events,
--              Attendance, and Chapter Settings.
-- ==============================================================================

-- 1. APPLICANTS & APPLICATIONS
-- Stores full applicant student details submitted through the recruitment portal.
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,                       -- e.g. 'A-1001', 'A-4026'
  name TEXT NOT NULL,                        -- Applicant full name
  email TEXT NOT NULL,                       -- Applicant college/personal email
  phone TEXT,                                -- WhatsApp contact number (e.g. '+91 9848022338')
  roll TEXT,                                 -- College roll number (e.g. '22A81A0501')
  branch TEXT,                               -- Department (CSE, IT, AI & DS, ECE, EEE, etc.)
  year TEXT,                                 -- Year of study (1, 2, 3, 4)
  tracks TEXT NOT NULL,                      -- JSON array of selected tracks: '["genai-aiml","web-app"]'
  why TEXT,                                  -- Statement of motivation / purpose
  link TEXT,                                 -- Portfolio, GitHub, or LinkedIn URL
  status TEXT DEFAULT 'New',                 -- 'New' | 'In review' | 'Shortlisted' | 'Interview' | 'Accepted' | 'Rejected'
  submitted TEXT NOT NULL,                   -- Submission date ISO string (YYYY-MM-DD)
  created_at TEXT DEFAULT (datetime('now'))  -- Record creation timestamp
);

-- Indexes for lightning-fast queries on applications
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON applications(submitted DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_roll ON applications(roll);


-- 2. REVIEWS & EVALUATIONS
-- Stores evaluations, rubric scores, comments, and hiring decisions linked to an applicant.
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id TEXT NOT NULL,              -- Foreign reference to applications(id)
  reviewer TEXT NOT NULL,                    -- Reviewer display name (e.g. 'Vinay Siddha')
  reviewer_email TEXT,                       -- Reviewer Google email
  rating_skills INTEGER DEFAULT 0,           -- Rubric rating 1-5 (Technical skills & potential)
  rating_motivation INTEGER DEFAULT 0,       -- Rubric rating 1-5 (Motivation & dedication)
  rating_communication INTEGER DEFAULT 0,    -- Rubric rating 1-5 (Communication & articulation)
  rating_fit INTEGER DEFAULT 0,              -- Rubric rating 1-5 (Culture & team fit)
  average_score REAL DEFAULT 0,              -- Computed average rating (1.0 to 5.0)
  note TEXT,                                 -- Detailed feedback notes for the core team
  decision TEXT,                             -- Decision: 'Shortlisted' | 'Interview' | 'Accepted' | 'Rejected'
  created_at TEXT DEFAULT (datetime('now')), -- Timestamp of evaluation
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Fast lookup for reviews by application
CREATE INDEX IF NOT EXISTS idx_reviews_app_id ON reviews(application_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_email ON reviews(reviewer_email);


-- 3. USERS & ROLE-BASED ACCESS CONTROL (RBAC)
-- Stores Google authenticated users, Chapter Leads, Reviewers, and Members.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                       -- Firebase Auth UID or generated user ID
  name TEXT,                                 -- User display name
  email TEXT UNIQUE NOT NULL,                -- User verified Google email
  role TEXT DEFAULT 'Member',                -- RBAC Role: 'Admin' | 'Lead' | 'Reviewer' | 'Member'
  status TEXT DEFAULT 'Active',              -- 'Active' | 'Invited' | 'Suspended'
  photo_url TEXT,                            -- Google profile avatar photo URL
  last_active TEXT DEFAULT (datetime('now')),-- Last activity / login timestamp
  created_at TEXT DEFAULT (datetime('now'))  -- Account creation timestamp
);

-- Index for filtering users by assigned role
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);


-- 4. HOME PAGE PRE-SIGNUPS & NEWSLETTER
CREATE TABLE IF NOT EXISTS signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,                -- Student email interested in apply alerts
  created_at TEXT DEFAULT (datetime('now'))
);


-- 5. CHAPTER EVENTS & WORKSHOPS
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,                       -- Event ID (e.g. 'EV-101')
  title TEXT NOT NULL,                       -- Event title
  date TEXT NOT NULL,                        -- Event date (YYYY-MM-DD)
  venue TEXT NOT NULL,                       -- Venue (Auditorium, Seminar Hall, Lab)
  track TEXT,                                -- Associated track name
  created_at TEXT DEFAULT (datetime('now'))
);


-- 6. ATTENDANCE & PARTICIPATION TRACKING
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,                    -- Foreign reference to events(id)
  application_id TEXT,                       -- Optional reference to applications(id)
  student_name TEXT NOT NULL,                -- Participant full name
  roll_number TEXT NOT NULL,                 -- College roll number
  branch TEXT NOT NULL,                      -- Department (CSE, IT, etc.)
  section TEXT DEFAULT 'A',                  -- Section (A, B, C, D)
  status TEXT DEFAULT 'Present',             -- 'Present' | 'Absent'
  marked_at TEXT DEFAULT (datetime('now')),  -- Timestamp marked
  UNIQUE(event_id, roll_number),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attendance_event ON attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_roll ON attendance(roll_number);


-- 7. APPLICATION & SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,                      -- Config key: 'applications_open'
  value TEXT NOT NULL,                       -- 'true' | 'false'
  updated_at TEXT DEFAULT (datetime('now'))
);
