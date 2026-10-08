import { createClient } from '@libsql/client/web'

// Environment variables or localStorage config for Turso DB
export function getTursoConfig() {
  const envUrl = import.meta.env.VITE_TURSO_DATABASE_URL?.trim()
  const envToken = import.meta.env.VITE_TURSO_AUTH_TOKEN?.trim()

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('gdg_turso_url')?.trim() : null
  const localToken = typeof window !== 'undefined' ? localStorage.getItem('gdg_turso_token')?.trim() : null

  return {
    url: localUrl || envUrl || '',
    authToken: localToken || envToken || ''
  }
}

export function saveTursoConfig(url, token) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('gdg_turso_url', url.trim())
    else localStorage.removeItem('gdg_turso_url')

    if (token) localStorage.setItem('gdg_turso_token', token.trim())
    else localStorage.removeItem('gdg_turso_token')
  }
}

let tursoClientInstance = null
let currentConfigKey = ''

export function getTursoClient() {
  const config = getTursoConfig()
  if (!config.url || !config.authToken) {
    return null
  }

  // Convert libsql:// to https:// if required by the browser web fetch driver
  let formattedUrl = config.url
  if (formattedUrl.startsWith('libsql://')) {
    formattedUrl = formattedUrl.replace('libsql://', 'https://')
  }

  const key = `${formattedUrl}:${config.authToken}`
  if (tursoClientInstance && currentConfigKey === key) {
    return tursoClientInstance
  }

  try {
    tursoClientInstance = createClient({
      url: formattedUrl,
      authToken: config.authToken
    })
    currentConfigKey = key
    return tursoClientInstance
  } catch (err) {
    console.warn('Failed to create Turso DB client:', err)
    return null
  }
}

let schemaInitialized = false

export async function initTursoSchema() {
  const client = getTursoClient()
  if (!client || schemaInitialized) return false

  try {
    await client.batch([
      `CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id TEXT UNIQUE,
        name TEXT NOT NULL,
        roll_number TEXT,
        email TEXT,
        phone TEXT,
        year TEXT,
        branch TEXT,
        section TEXT,
        domain TEXT,
        wing TEXT,
        prerequisite_confirmation TEXT,
        why_gdg TEXT,
        why_wing TEXT,
        experience_level TEXT,
        has_projects TEXT,
        project_description TEXT,
        wing_specific TEXT,
        wing_specific_text TEXT,
        wing_specific_yes TEXT,
        submitted_at TEXT,
        confirmed INTEGER DEFAULT 1
      );`,
      `CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id TEXT UNIQUE,
        reviewer_name TEXT,
        attendance TEXT,
        decision TEXT,
        tech_rating REAL,
        comm_rating REAL,
        passion_rating REAL,
        feedback TEXT,
        reviewed_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number TEXT UNIQUE,
        name TEXT,
        branch TEXT,
        section TEXT,
        year TEXT,
        status TEXT DEFAULT 'Pending',
        notes TEXT,
        marked_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS shortlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id TEXT UNIQUE,
        roll_number TEXT,
        name TEXT,
        domain TEXT,
        wing TEXT,
        status TEXT,
        superadmin_decision TEXT,
        notes TEXT,
        updated_at TEXT
      );`
    ], 'write')
    schemaInitialized = true
    return true
  } catch (err) {
    console.warn('Could not initialize Turso schema:', err)
    return false
  }
}

export async function testTursoConnection(url, token) {
  try {
    let formattedUrl = url.trim()
    if (formattedUrl.startsWith('libsql://')) {
      formattedUrl = formattedUrl.replace('libsql://', 'https://')
    }
    const testClient = createClient({
      url: formattedUrl,
      authToken: token.trim()
    })
    const res = await testClient.execute('SELECT 1 as connected;')
    return { ok: true, rows: res.rows }
  } catch (err) {
    return { ok: false, error: err.message || String(err) }
  }
}

/**
 * Fetch all applications and their reviews from Turso DB
 */
export async function fetchFromTurso() {
  const client = getTursoClient()
  if (!client) return null

  try {
    await initTursoSchema()

    const appsResult = await client.execute(
      `SELECT a.*, r.reviewer_name, r.attendance, r.decision, r.tech_rating, r.comm_rating, r.passion_rating, r.feedback, r.reviewed_at 
       FROM applications a 
       LEFT JOIN reviews r ON a.application_id = r.application_id 
       ORDER BY a.id DESC;`
    )

    const candidates = appsResult.rows.map(row => {
      let wingSpecificParsed = []
      try {
        wingSpecificParsed = row.wing_specific ? JSON.parse(row.wing_specific) : []
      } catch {
        wingSpecificParsed = row.wing_specific ? [row.wing_specific] : []
      }

      const hasReview = !!row.decision || !!row.reviewed_at
      const review = hasReview ? {
        reviewerName: row.reviewer_name || '',
        attendance: row.attendance || 'Attended',
        decision: row.decision || 'Selected',
        techRating: row.tech_rating || 4,
        commRating: row.comm_rating || 4,
        passionRating: row.passion_rating || 4,
        feedback: row.feedback || '',
        reviewedAt: row.reviewed_at || ''
      } : null

      return {
        applicationId: row.application_id,
        name: row.name,
        rollNumber: row.roll_number,
        email: row.email,
        phone: row.phone,
        year: row.year,
        branch: row.branch,
        section: row.section,
        domain: row.domain,
        wing: row.wing,
        prerequisiteConfirmation: row.prerequisite_confirmation,
        whyGDG: row.why_gdg,
        whyWing: row.why_wing,
        experienceLevel: row.experience_level,
        hasProjects: row.has_projects,
        projectDescription: row.project_description,
        wingSpecific: wingSpecificParsed,
        wingSpecificText: row.wing_specific_text,
        wingSpecificYes: row.wing_specific_yes,
        submittedAt: row.submitted_at,
        confirmed: Boolean(row.confirmed),
        isReviewed: hasReview,
        review
      }
    })

    return candidates
  } catch (err) {
    console.warn('Error reading from Turso DB:', err)
    return null
  }
}

/**
 * Save candidate application into Turso DB
 */
export async function saveApplicationToTurso(app) {
  const client = getTursoClient()
  if (!client) return false

  try {
    await initTursoSchema()
    const appId = app.applicationId || `APP-${Date.now().toString().slice(-6)}`
    const submittedAt = app.submittedAt || new Date().toISOString()
    const wingSpecStr = JSON.stringify(app.wingSpecific || [])

    await client.execute({
      sql: `INSERT INTO applications (
        application_id, name, roll_number, email, phone, year, branch, section,
        domain, wing, prerequisite_confirmation, why_gdg, why_wing, experience_level,
        has_projects, project_description, wing_specific, wing_specific_text,
        wing_specific_yes, submitted_at, confirmed
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
      ) ON CONFLICT(application_id) DO UPDATE SET
        name=excluded.name,
        roll_number=excluded.roll_number,
        email=excluded.email,
        phone=excluded.phone,
        year=excluded.year,
        branch=excluded.branch,
        section=excluded.section,
        domain=excluded.domain,
        wing=excluded.wing,
        prerequisite_confirmation=excluded.prerequisite_confirmation,
        why_gdg=excluded.why_gdg,
        why_wing=excluded.why_wing,
        experience_level=excluded.experience_level,
        has_projects=excluded.has_projects,
        project_description=excluded.project_description,
        wing_specific=excluded.wing_specific,
        wing_specific_text=excluded.wing_specific_text,
        wing_specific_yes=excluded.wing_specific_yes;`,
      args: [
        appId,
        app.name || '',
        app.rollNumber || '',
        app.email || '',
        app.phone || '',
        app.year || '',
        app.branch || '',
        app.section || '',
        app.domain || '',
        app.wing || '',
        app.prerequisiteConfirmation || '',
        app.whyGDG || '',
        app.whyWing || '',
        app.experienceLevel || '',
        app.hasProjects || '',
        app.projectDescription || '',
        wingSpecStr,
        app.wingSpecificText || '',
        app.wingSpecificYes || '',
        submittedAt,
        app.confirmed ? 1 : 0
      ]
    })
    return true
  } catch (err) {
    console.warn('Failed to insert application into Turso DB:', err)
    return false
  }
}

/**
 * Save candidate interview review into Turso DB
 */
export async function saveReviewToTurso(rev) {
  const client = getTursoClient()
  if (!client) return false

  try {
    await initTursoSchema()
    const reviewedAt = rev.reviewedAt || new Date().toISOString()

    await client.execute({
      sql: `INSERT INTO reviews (
        application_id, reviewer_name, attendance, decision,
        tech_rating, comm_rating, passion_rating, feedback, reviewed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(application_id) DO UPDATE SET
        reviewer_name=excluded.reviewer_name,
        attendance=excluded.attendance,
        decision=excluded.decision,
        tech_rating=excluded.tech_rating,
        comm_rating=excluded.comm_rating,
        passion_rating=excluded.passion_rating,
        feedback=excluded.feedback,
        reviewed_at=excluded.reviewed_at;`,
      args: [
        rev.applicationId,
        rev.reviewerName || 'Reviewer',
        rev.attendance || 'Attended',
        rev.decision || 'Selected',
        Number(rev.techRating) || 4,
        Number(rev.commRating) || 4,
        Number(rev.passionRating) || 4,
        rev.feedback || '',
        reviewedAt
      ]
    })
    return true
  } catch (err) {
    console.warn('Failed to save review in Turso DB:', err)
    return false
  }
}

const ATTENDANCE_STORAGE_KEY = 'gdg_attendance_records'
const SHORTLIST_STORAGE_KEY = 'gdg_shortlist_records'

export async function fetchAttendanceFromTurso() {
  const local = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || '{}')
  const client = getTursoClient()
  if (!client) return local

  try {
    await initTursoSchema()
    const res = await client.execute('SELECT * FROM attendance ORDER BY branch ASC, section ASC, name ASC;')
    const map = { ...local }
    for (const row of res.rows) {
      if (row.roll_number) {
        map[row.roll_number] = {
          rollNumber: row.roll_number,
          name: row.name,
          branch: row.branch,
          section: row.section,
          year: row.year,
          status: row.status,
          notes: row.notes,
          markedAt: row.marked_at
        }
      }
    }
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(map))
    return map
  } catch (err) {
    console.warn('Could not fetch attendance from Turso DB:', err)
    return local
  }
}

export async function saveAttendanceToTurso(record) {
  try {
    const local = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || '{}')
    local[record.rollNumber] = { ...record, markedAt: record.markedAt || new Date().toISOString() }
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(local))
  } catch {}

  const client = getTursoClient()
  if (!client) return true

  try {
    await initTursoSchema()
    const markedAt = record.markedAt || new Date().toISOString()
    await client.execute({
      sql: `INSERT INTO attendance (
        roll_number, name, branch, section, year, status, notes, marked_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(roll_number) DO UPDATE SET
        name=excluded.name,
        branch=excluded.branch,
        section=excluded.section,
        year=excluded.year,
        status=excluded.status,
        notes=excluded.notes,
        marked_at=excluded.marked_at;`,
      args: [
        record.rollNumber,
        record.name || '',
        record.branch || '',
        record.section || '',
        record.year || '',
        record.status || 'Pending',
        record.notes || '',
        markedAt
      ]
    })
    return true
  } catch (err) {
    console.warn('Could not write attendance to Turso:', err)
    return false
  }
}

export async function fetchShortlistsFromTurso() {
  const local = JSON.parse(localStorage.getItem(SHORTLIST_STORAGE_KEY) || '{}')
  const client = getTursoClient()
  if (!client) return local

  try {
    await initTursoSchema()
    const res = await client.execute('SELECT * FROM shortlists ORDER BY updated_at DESC;')
    const map = { ...local }
    for (const row of res.rows) {
      if (row.application_id) {
        map[row.application_id] = {
          applicationId: row.application_id,
          rollNumber: row.roll_number,
          name: row.name,
          domain: row.domain,
          wing: row.wing,
          status: row.status,
          superadminDecision: row.superadmin_decision,
          notes: row.notes,
          updatedAt: row.updated_at
        }
      }
    }
    localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(map))
    return map
  } catch (err) {
    console.warn('Could not fetch shortlists from Turso:', err)
    return local
  }
}

export async function saveShortlistToTurso(record) {
  try {
    const local = JSON.parse(localStorage.getItem(SHORTLIST_STORAGE_KEY) || '{}')
    local[record.applicationId] = { ...record, updatedAt: record.updatedAt || new Date().toISOString() }
    localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(local))
  } catch {}

  const client = getTursoClient()
  if (!client) return true

  try {
    await initTursoSchema()
    const updatedAt = record.updatedAt || new Date().toISOString()
    await client.execute({
      sql: `INSERT INTO shortlists (
        application_id, roll_number, name, domain, wing, status, superadmin_decision, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(application_id) DO UPDATE SET
        status=excluded.status,
        superadmin_decision=excluded.superadmin_decision,
        notes=excluded.notes,
        updated_at=excluded.updated_at;`,
      args: [
        record.applicationId,
        record.rollNumber || '',
        record.name || '',
        record.domain || '',
        record.wing || '',
        record.status || 'Under Review',
        record.superadminDecision || 'Pending',
        record.notes || '',
        updatedAt
      ]
    })
    return true
  } catch (err) {
    console.warn('Could not write shortlist to Turso:', err)
    return false
  }
}

