const SHEET_NAME = 'Applications'
// For a standalone Apps Script project, set the spreadsheet ID in
// Project Settings > Script Properties as SPREADSHEET_ID.
// A script attached through a Sheet's Extensions > Apps Script can use the
// active spreadsheet automatically when that property is left blank.
const SPREADSHEET_ID_PROPERTY = 'SPREADSHEET_ID'
const LAST_APPLICATION_ID_PROPERTY = 'LAST_APPLICATION_ID'
const HEADERS = [
  'Submitted At', 'Application ID', 'Full Name', 'Roll Number', 'Email', 'Phone',
  'Year', 'Branch', 'Section', 'Domain', 'Wing', 'Prerequisite Confirmation',
  'Why GDG', 'Why This Wing', 'Experience Level', 'Related Projects',
  'Project Description', 'Wing Specific Answers', 'Additional Wing Response',
  'Previous Event Experience', 'Accuracy Confirmed',
]

function doGet(e) {
  return ContentService.createTextOutput('GDGoC SVEC 4.0 Form API is active and connected to Rameez sheet.')
}

function testAuth() {
  const spreadsheetId = '105h2_S65Uyv4uf40yxAA1fAt405cHbYq3-JMr7JsRp4'
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME)
  ensureHeaders(sheet)
  Logger.log('SUCCESS! Connected to spreadsheet: ' + spreadsheet.getName() + ' (' + spreadsheetId + ')')
}

function doPost(event) {
  const lock = LockService.getScriptLock()
  let requestId = ''
  try {
    const application = JSON.parse(event.parameter.payload)
    requestId = String(application.requestId || '')
    validateApplication(application)
    lock.waitLock(10000)

    const configuredId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_ID_PROPERTY)
    const spreadsheetId = configuredId || '105h2_S65Uyv4uf40yxAA1fAt405cHbYq3-JMr7JsRp4'
    const spreadsheet = spreadsheetId
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet()
    if (!spreadsheet) {
      throw new Error('Spreadsheet not configured. Could not open spreadsheet ID: ' + spreadsheetId)
    }
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME)
    const sheetHeaders = ensureHeaders(sheet)
    const row = {
      'Submitted At': new Date(),
      'Application ID': nextApplicationId(),
      'Full Name': safeCell(application.name),
      'Roll Number': safeCell(application.rollNumber),
      'Email': safeCell(application.email),
      'Phone': safeCell(application.phone),
      'Year': safeCell(application.year),
      'Branch': safeCell(application.branch),
      'Section': safeCell(application.section),
      'Domain': safeCell(application.domain),
      'Wing': safeCell(application.wing),
      'Prerequisite Confirmation': safeCell(application.prerequisiteConfirmation),
      'Why GDG': safeCell(application.whyGDG),
      'Why This Wing': safeCell(application.whyWing),
      'Experience Level': safeCell(application.experienceLevel),
      'Related Projects': safeCell(application.domain === 'Tech' && application.year === '3rd Year' ? application.hasProjects : ''),
      'Project Description': safeCell(application.domain === 'Tech' && application.year === '3rd Year' ? application.projectDescription : ''),
      'Wing Specific Answers': safeCell(JSON.stringify(application.wingSpecific || [])),
      'Additional Wing Response': safeCell(application.wingSpecificText),
      'Previous Event Experience': safeCell(application.wingSpecificYes),
      'Accuracy Confirmed': application.confirmed === true ? 'Yes' : 'No',
    }
    sheet.appendRow(sheetHeaders.map(function (header) { return row[header] == null ? '' : row[header] }))
    console.log('Application row appended to ' + SHEET_NAME + '.')
    return postMessageResponse({ ok: true, requestId: requestId })
  } catch (error) {
    console.error('Application submission failed: ' + String(error.message || error))
    return postMessageResponse({ ok: false, requestId: requestId, error: String(error.message || error) })
  } finally {
    if (lock.hasLock()) lock.releaseLock()
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    return HEADERS
  }

  const columnCount = Math.max(sheet.getLastColumn(), 1)
  const current = sheet.getRange(1, 1, 1, columnCount).getValues()[0]
    .map(function (header) { return String(header || '').trim() })
  const missing = HEADERS.filter(function (header) { return current.indexOf(header) === -1 })
  if (missing.length) {
    sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing])
    current.push.apply(current, missing)
  }
  if (sheet.getFrozenRows() < 1) sheet.setFrozenRows(1)
  return current
}

// Called while the script lock is held, so simultaneous submissions cannot
// receive the same sequential 10-digit ID. Script Properties persist across
// deployments. This allows IDs from 1000000001 through 9999999999.
function nextApplicationId() {
  const properties = PropertiesService.getScriptProperties()
  const lastId = Number(properties.getProperty(LAST_APPLICATION_ID_PROPERTY) || '1000000000')
  const nextId = lastId + 1
  if (!Number.isSafeInteger(nextId) || nextId > 9999999999) {
    throw new Error('The 10-digit application ID range has been exhausted.')
  }
  properties.setProperty(LAST_APPLICATION_ID_PROPERTY, String(nextId))
  return String(nextId)
}

function validateApplication(application) {
  if (!application || typeof application !== 'object') throw new Error('Invalid application payload.')
  const requiredFields = [
    'name', 'rollNumber', 'email', 'phone', 'year', 'branch', 'section',
    'domain', 'wing', 'prerequisiteConfirmation', 'whyGDG', 'whyWing',
    'experienceLevel',
  ]
  requiredFields.forEach(function (field) {
    if (!String(application[field] || '').trim()) throw new Error('Missing required field: ' + field)
  })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) throw new Error('Invalid email address.')
  if (!/^\d{10}$/.test(String(application.phone).replace(/\D/g, ''))) throw new Error('Invalid phone number.')
  if (application.whyGDG.length > 500 || application.whyWing.length > 500) throw new Error('A response exceeds 500 characters.')
  if (application.domain === 'Tech' && application.year === '3rd Year' && !String(application.hasProjects || '').trim()) {
    throw new Error('Related project experience is required for third-year applicants.')
  }
  if (application.domain === 'Tech' && application.year === '3rd Year' && application.hasProjects === 'Yes' && !String(application.projectDescription || '').trim()) {
    throw new Error('Project description is required.')
  }
  if (application.confirmed !== true) throw new Error('Accuracy confirmation is required.')
}

function safeCell(value) {
  const text = String(value == null ? '' : value).slice(0, 5000)
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text
}

function postMessageResponse(value) {
  const message = JSON.stringify(value).replace(/</g, '\\u003c')
  const html = '<!doctype html><meta charset="utf-8"><script>' +
    'window.parent.postMessage(' + message + ', "*");' +
    '</script>'
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}
