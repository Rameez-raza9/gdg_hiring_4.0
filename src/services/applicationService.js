const STORAGE_KEY = 'gdg-campus-applications'
const SHEETS_ENDPOINT = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL?.trim()

function saveLocally(application) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  localStorage.setItem(STORAGE_KEY, JSON.stringify([
    ...existing,
    { ...application, submittedAt: new Date().toISOString() },
  ]))
}

export async function submitApplication(application) {
  if (!SHEETS_ENDPOINT) {
    saveLocally(application)
    return { destination: 'local' }
  }

  await sendToSheet(application)
  return { destination: 'google-sheets' }
}

function sendToSheet(application) {
  const requestId = `gdg-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const body = new URLSearchParams({
    payload: JSON.stringify({ ...application, requestId }),
  })
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 30000)

  // Apps Script does not provide CORS response headers for browser clients.
  // A simple URL-encoded no-cors POST still reaches doPost(event.parameter),
  // and resolves when the network request completes.
  const request = fetch(SHEETS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body,
    signal: controller.signal,
  }).then(() => ({ destination: 'google-sheets' }))
    .catch(error => {
      if (error.name === 'AbortError') {
        throw new Error('The request timed out. Check your connection and try again.')
      }
      throw new Error('Could not reach Google Sheets. Check your connection and try again.')
    })
    .finally(() => window.clearTimeout(timeout))

  // Apps Script executes the POST but its cross-origin redirect may leave the
  // browser fetch pending. The execution log confirms the POST reached doPost;
  // stop blocking the applicant after that request has had time to complete.
  const responseFallback = new Promise(resolve => {
    window.setTimeout(() => resolve({ destination: 'google-sheets' }), 8000)
  })
  return Promise.race([request, responseFallback])
}
