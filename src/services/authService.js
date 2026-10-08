// Role-Based Authentication Service for GDGoC SVEC 4.0 Recruitment

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  INTERVIEWER: 'interviewer'
}

export const PRESET_USERS = [
  {
    id: 'super-1',
    username: 'superadmin',
    email: 'superadmin@gdg.svec',
    password: 'gdgsuper2026',
    name: 'Lead Organizer (Super Admin)',
    role: ROLES.SUPER_ADMIN,
    avatar: '👑'
  },
  {
    id: 'tech-lead-1',
    username: 'interviewer.tech',
    email: 'tech@gdg.svec',
    password: 'techhire2026',
    name: 'Tech Panel Reviewer',
    role: ROLES.INTERVIEWER,
    domain: 'Tech',
    avatar: '💻'
  },
  {
    id: 'core-lead-1',
    username: 'interviewer.core',
    email: 'core@gdg.svec',
    password: 'corehire2026',
    name: 'Core & Non-Tech Reviewer',
    role: ROLES.INTERVIEWER,
    domain: 'Non-Tech',
    avatar: '🎯'
  }
]

const AUTH_STORAGE_KEY = 'gdg_auth_session'

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function login(usernameOrEmail, password, remember = true) {
  const cleanInput = (usernameOrEmail || '').trim().toLowerCase()
  const cleanPass = (password || '').trim()

  const user = PRESET_USERS.find(u =>
    (u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput) &&
    u.password === cleanPass
  )

  if (!user) {
    return { ok: false, error: 'Invalid username or password. Check credentials and try again.' }
  }

  const session = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    domain: user.domain || 'All',
    avatar: user.avatar,
    loginAt: new Date().toISOString()
  }

  const storage = remember ? localStorage : sessionStorage
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))

  return { ok: true, user: session }
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {}
}

export function isSuperAdmin(user = getCurrentUser()) {
  return Boolean(user && user.role === ROLES.SUPER_ADMIN)
}

export function isInterviewer(user = getCurrentUser()) {
  return Boolean(user && (user.role === ROLES.INTERVIEWER || user.role === ROLES.SUPER_ADMIN))
}
