import { saveApplicationToTurso } from './tursoService'
import { sendApplicationSubmittedEmail } from './mailService'

export const STORAGE_KEY = 'gdg_local_applications'
export const REVIEWS_STORAGE_KEY = 'gdg_candidate_reviews'

function saveLocally(application) {
  if (typeof window === 'undefined') return
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      ...existing,
      { ...application, submittedAt: new Date().toISOString() },
    ]))
  } catch {}
}

export async function submitApplication(application) {
  saveLocally(application)

  let tursoSaved = false
  try {
    tursoSaved = await saveApplicationToTurso(application)
  } catch (e) {
    console.warn('Turso save error:', e)
  }

  // Automatically dispatch onboarding email with WhatsApp group link & Google Cloud voucher
  try {
    sendApplicationSubmittedEmail(application).catch(() => {})
  } catch (err) {
    console.warn('Mail dispatch notice:', err)
  }

  return {
    ok: true,
    destination: tursoSaved ? 'turso-cloud' : 'local-db'
  }
}
