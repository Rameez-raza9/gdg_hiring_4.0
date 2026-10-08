const SHEET_NAME = 'Applications';
const REVIEW_SHEET_NAME = 'Candidate_Review';
const RESULTS_SHEET_NAME = 'Reviewed_Candidates';
const SPREADSHEET_ID = '105h2_S65Uyv4uf40yxAA1fAt405cHbYq3-JMr7JsRp4';

const HEADERS = [
  'Submitted At', 'Application ID', 'Full Name', 'Roll Number', 'Email', 'Phone',
  'Year', 'Branch', 'Section', 'Domain', 'Wing', 'Prerequisite Confirmation',
  'Why GDG', 'Why This Wing', 'Experience Level', 'Related Projects',
  'Project Description', 'Wing Specific Answers', 'Additional Wing Response',
  'Previous Event Experience', 'Accuracy Confirmed',
];

const REVIEWED_HEADERS = [
  'Reviewed At', 'Reviewer Name', 'Attendance Status', 'Final Decision',
  'Technical Rating (1-5)', 'Communication Rating (1-5)', 'Passion & Fit (1-5)',
  'Interview Notes & Feedback', 'Application ID', 'Full Name', 'Roll Number',
  'Year', 'Branch', 'Section', 'Domain', 'Wing', 'Email', 'Phone',
  'Why GDG', 'Why This Wing', 'Project Description'
];

/**
 * Custom Menu inside Google Sheets
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎯 GDGoC Review Portal')
    .addItem('🛠️ 1. Setup / Refresh Review Sheets', 'setupReviewSystem')
    .addItem('💾 2. Submit Current Review', 'submitCandidateReview')
    .addSeparator()
    .addItem('➡️ Next Candidate', 'loadNextCandidate')
    .addItem('⬅️ Previous Candidate', 'loadPreviousCandidate')
    .addToUi();
}

/**
 * Web App GET endpoint
 * Returns applications and existing reviews as JSON (or JSONP if callback is specified)
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getApplications';
  const callback = e && e.parameter && e.parameter.callback;

  if (action === 'health') {
    return ContentService.createTextOutput('GDGoC SVEC 4.0 Form API is active and connected.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    const spreadsheet = getSpreadsheet();
    const appSheet = spreadsheet.getSheetByName(SHEET_NAME);
    const reviewedSheet = spreadsheet.getSheetByName(RESULTS_SHEET_NAME);

    const applications = [];
    if (appSheet && appSheet.getLastRow() > 1) {
      const numRows = appSheet.getLastRow() - 1;
      const numCols = Math.min(appSheet.getLastColumn(), HEADERS.length);
      const data = appSheet.getRange(2, 1, numRows, numCols).getValues();

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        let wingSpecificList = [];
        try {
          wingSpecificList = typeof row[17] === 'string' && row[17].startsWith('[') ? JSON.parse(row[17]) : row[17];
        } catch (err) {
          wingSpecificList = [row[17]];
        }

        applications.push({
          rowIndex: i + 1,
          submittedAt: row[0] ? (row[0] instanceof Date ? row[0].toISOString() : String(row[0])) : '',
          applicationId: row[1] || ('APP-' + (i + 1)),
          name: String(row[2] || ''),
          rollNumber: String(row[3] || ''),
          email: String(row[4] || ''),
          phone: String(row[5] || ''),
          year: String(row[6] || ''),
          branch: String(row[7] || ''),
          section: String(row[8] || ''),
          domain: String(row[9] || ''),
          wing: String(row[10] || ''),
          prerequisiteConfirmation: String(row[11] || ''),
          whyGDG: String(row[12] || ''),
          whyWing: String(row[13] || ''),
          experienceLevel: String(row[14] || ''),
          hasProjects: String(row[15] || ''),
          projectDescription: String(row[16] || ''),
          wingSpecific: wingSpecificList,
          wingSpecificText: String(row[18] || ''),
          wingSpecificYes: String(row[19] || ''),
          confirmed: row[20] === 'Yes' || row[20] === true
        });
      }
    }

    const reviews = [];
    if (reviewedSheet && reviewedSheet.getLastRow() > 1) {
      const rRows = reviewedSheet.getLastRow() - 1;
      const rCols = Math.min(reviewedSheet.getLastColumn(), REVIEWED_HEADERS.length);
      const rData = reviewedSheet.getRange(2, 1, rRows, rCols).getValues();

      for (let j = 0; j < rData.length; j++) {
        const r = rData[j];
        reviews.push({
          reviewedAt: r[0] ? (r[0] instanceof Date ? r[0].toISOString() : String(r[0])) : '',
          reviewerName: String(r[1] || ''),
          attendance: String(r[2] || ''),
          decision: String(r[3] || ''),
          techRating: r[4] || '',
          commRating: r[5] || '',
          passionRating: r[6] || '',
          feedback: String(r[7] || ''),
          applicationId: String(r[8] || ''),
          name: String(r[9] || ''),
          rollNumber: String(r[10] || ''),
          year: String(r[11] || ''),
          branch: String(r[12] || ''),
          section: String(r[13] || ''),
          domain: String(r[14] || ''),
          wing: String(r[15] || '')
        });
      }
    }

    const responsePayload = {
      ok: true,
      count: applications.length,
      applications: applications,
      reviews: reviews,
      timestamp: new Date().toISOString()
    };

    if (callback) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(responsePayload) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService.createTextOutput(JSON.stringify(responsePayload))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const errorPayload = { ok: false, error: String(error) };
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(errorPayload) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(JSON.stringify(errorPayload))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Web App POST endpoint - Submissions and Interview Reviews
 */
function doPost(event) {
  const lock = LockService.getScriptLock();
  let requestId = '';
  try {
    const payload = JSON.parse(event.parameter.payload);
    requestId = String(payload.requestId || '');
    lock.waitLock(10000);

    const spreadsheet = getSpreadsheet();

    // Check if this is an interview review submission
    if (payload.action === 'saveReview' || payload.type === 'interviewReview') {
      let reviewedSheet = spreadsheet.getSheetByName(RESULTS_SHEET_NAME);
      if (!reviewedSheet) {
        reviewedSheet = spreadsheet.insertSheet(RESULTS_SHEET_NAME);
      }

      if (reviewedSheet.getLastRow() === 0) {
        reviewedSheet.appendRow(REVIEWED_HEADERS);
        reviewedSheet.setFrozenRows(1);
        reviewedSheet.getRange(1, 1, 1, REVIEWED_HEADERS.length)
          .setBackground('#1a73e8')
          .setFontColor('#ffffff')
          .setFontWeight('bold');
      }

      const reviewRow = [
        new Date(),
        payload.reviewerName || 'Reviewer',
        payload.attendance || 'Attended',
        payload.decision || 'Selected',
        payload.techRating || '',
        payload.commRating || '',
        payload.passionRating || '',
        payload.feedback || '',
        payload.applicationId || '',
        payload.name || '',
        payload.rollNumber || '',
        payload.year || '',
        payload.branch || '',
        payload.section || '',
        payload.domain || '',
        payload.wing || '',
        payload.email || '',
        payload.phone || '',
        payload.whyGDG || '',
        payload.whyWing || '',
        payload.projectDescription || ''
      ];

      reviewedSheet.appendRow(reviewRow);

      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        action: 'saveReview',
        sheet: RESULTS_SHEET_NAME,
        applicationId: payload.applicationId,
        requestId: requestId,
        message: 'Interview review saved to ' + RESULTS_SHEET_NAME
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Default: New Candidate Application Submission
    const application = payload;
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    const row = [
      new Date(),
      'APP-' + Date.now().toString().slice(-6),
      application.name || '',
      application.rollNumber || '',
      application.email || '',
      application.phone || '',
      application.year || '',
      application.branch || '',
      application.section || '',
      application.domain || '',
      application.wing || '',
      application.prerequisiteConfirmation || '',
      application.whyGDG || '',
      application.whyWing || '',
      application.experienceLevel || '',
      application.domain === 'Tech' && application.year === '3rd Year' ? application.hasProjects : '',
      application.domain === 'Tech' && application.year === '3rd Year' ? application.projectDescription : '',
      JSON.stringify(application.wingSpecific || []),
      application.wingSpecificText || '',
      application.wingSpecificYes || '',
      application.confirmed === true ? 'Yes' : 'No'
    ];

    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true, requestId: requestId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

/**
 * Helper to get active or open by ID
 */
function getSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
}

/**
 * Set up the Candidate_Review and Reviewed_Candidates sheets
 */
function setupReviewSystem() {
  const ss = getSpreadsheet();
  
  // 1. Ensure Reviewed_Candidates sheet exists with headers
  let reviewedSheet = ss.getSheetByName(RESULTS_SHEET_NAME);
  if (!reviewedSheet) {
    reviewedSheet = ss.insertSheet(RESULTS_SHEET_NAME);
  }
  if (reviewedSheet.getLastRow() === 0) {
    reviewedSheet.appendRow(REVIEWED_HEADERS);
    reviewedSheet.setFrozenRows(1);
    reviewedSheet.getRange(1, 1, 1, REVIEWED_HEADERS.length)
      .setBackground('#1a73e8')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
  }

  // 2. Setup Candidate_Review sheet
  let reviewSheet = ss.getSheetByName(REVIEW_SHEET_NAME);
  if (!reviewSheet) {
    reviewSheet = ss.insertSheet(REVIEW_SHEET_NAME, 0); // place first
  }
  
  // Format Review Sheet layout
  reviewSheet.getRange('A1:D35').clear();
  reviewSheet.setColumnWidth(1, 220);
  reviewSheet.setColumnWidth(2, 450);
  reviewSheet.setColumnWidth(3, 200);
  reviewSheet.setColumnWidth(4, 300);

  // Title Banner
  reviewSheet.getRange('A1:D1').merge()
    .setValue('📋 GDGoC SVEC 4.0 — Candidate Review & Evaluation Station')
    .setBackground('#1a73e8')
    .setFontColor('#ffffff')
    .setFontSize(14)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Candidate Navigation
  reviewSheet.getRange('A3').setValue('Candidate Number (Index):').setFontWeight('bold');
  reviewSheet.getRange('B3').setValue(1).setHorizontalAlignment('left').setFontWeight('bold');
  reviewSheet.getRange('C3').setValue('💡 Instructions:').setFontWeight('bold');
  reviewSheet.getRange('D3').setValue('Use Menu: GDGoC Review Portal ➔ Next / Previous');

  // Section 1: Candidate Details (Auto-populated)
  reviewSheet.getRange('A5:B5').merge().setValue('👤 CANDIDATE PROFILE').setBackground('#e8f0fe').setFontWeight('bold');
  
  const profileFields = [
    ['Full Name', ''],
    ['Application ID', ''],
    ['Roll Number', ''],
    ['Year & Branch & Section', ''],
    ['Domain & Wing', ''],
    ['Email', ''],
    ['Phone', ''],
    ['Experience Level', ''],
    ['Why GDG?', ''],
    ['Why This Wing?', ''],
    ['Projects / Description', ''],
    ['Previous Event Experience', '']
  ];

  for (let i = 0; i < profileFields.length; i++) {
    const row = 6 + i;
    reviewSheet.getRange(row, 1).setValue(profileFields[i][0]).setFontWeight('bold').setBackground('#f8f9fa');
    reviewSheet.getRange(row, 2).setWrap(true);
  }

  // Section 2: Review Form (Input fields on Columns C & D)
  reviewSheet.getRange('C5:D5').merge().setValue('⭐ INTERVIEW EVALUATION').setBackground('#fef7e0').setFontWeight('bold');

  const reviewFields = [
    ['Reviewer Name:', ''],
    ['Attendance Status:', ''],
    ['Technical Rating (1-5):', ''],
    ['Communication Rating (1-5):', ''],
    ['Passion & Culture Fit (1-5):', ''],
    ['Final Recommendation:', ''],
    ['Detailed Notes & Feedback:', '']
  ];

  for (let j = 0; j < reviewFields.length; j++) {
    const r = 6 + j;
    reviewSheet.getRange(r, 3).setValue(reviewFields[j][0]).setFontWeight('bold').setBackground('#fff8e1');
  }

  // Dropdown Validations
  // Attendance:
  const attendanceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Attended', 'Absent', 'Rescheduled'], true)
    .build();
  reviewSheet.getRange('D7').setDataValidation(attendanceRule).setValue('Attended');

  // Ratings 1-5:
  const ratingRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['5 - Exceptional', '4 - Strong', '3 - Average', '2 - Needs Improvement', '1 - Poor'], true)
    .build();
  reviewSheet.getRange('D8').setDataValidation(ratingRule).setValue('4 - Strong');
  reviewSheet.getRange('D9').setDataValidation(ratingRule).setValue('4 - Strong');
  reviewSheet.getRange('D10').setDataValidation(ratingRule).setValue('4 - Strong');

  // Decision:
  const decisionRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Selected', 'Shortlisted', 'Waitlisted', 'Rejected'], true)
    .build();
  reviewSheet.getRange('D11').setDataValidation(decisionRule).setValue('Selected');

  // Detailed Notes formatting
  reviewSheet.getRange('D12:D17').merge()
    .setVerticalAlignment('top')
    .setWrap(true)
    .setBorder(true, true, true, true, false, false, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);

  // Submit banner instructions
  reviewSheet.getRange('C19:D19').merge()
    .setValue('💾 To Save: Click "🎯 GDGoC Review Portal ➔ Submit Current Review"')
    .setBackground('#34a853')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Load candidate 1
  loadCandidateByIndex(1);

  SpreadsheetApp.getActiveSpreadsheet().toast('Review System successfully configured!', 'Setup Complete', 5);
}

/**
 * Load Candidate by 1-based index (1 = first row in Applications)
 */
function loadCandidateByIndex(index) {
  const ss = getSpreadsheet();
  const appSheet = ss.getSheetByName(SHEET_NAME);
  const reviewSheet = ss.getSheetByName(REVIEW_SHEET_NAME);
  if (!appSheet || !reviewSheet) return;

  const totalCandidates = Math.max(appSheet.getLastRow() - 1, 0);
  if (totalCandidates === 0) {
    reviewSheet.getRange('B3').setValue(0);
    reviewSheet.getRange('B6:B17').clearContent();
    reviewSheet.getRange('B6').setValue('No applications submitted yet.');
    return;
  }

  const validIndex = Math.max(1, Math.min(index, totalCandidates));
  reviewSheet.getRange('B3').setValue(validIndex + ' of ' + totalCandidates);

  // Read applicant row (row 1 is header, so index + 1 is the candidate row)
  const appRow = appSheet.getRange(validIndex + 1, 1, 1, HEADERS.length).getValues()[0];

  reviewSheet.getRange('B6').setValue(appRow[2] || ''); // Full Name
  reviewSheet.getRange('B7').setValue(appRow[1] || ''); // Application ID
  reviewSheet.getRange('B8').setValue(appRow[3] || ''); // Roll Number
  reviewSheet.getRange('B9').setValue((appRow[6] || '') + ' | ' + (appRow[7] || '') + ' - ' + (appRow[8] || '')); // Year, Branch, Sec
  reviewSheet.getRange('B10').setValue((appRow[9] || '') + ' ➔ ' + (appRow[10] || '')); // Domain & Wing
  reviewSheet.getRange('B11').setValue(appRow[4] || ''); // Email
  reviewSheet.getRange('B12').setValue(appRow[5] || ''); // Phone
  reviewSheet.getRange('B13').setValue(appRow[14] || ''); // Experience Level
  reviewSheet.getRange('B14').setValue(appRow[12] || ''); // Why GDG
  reviewSheet.getRange('B15').setValue(appRow[13] || ''); // Why This Wing
  reviewSheet.getRange('B16').setValue((appRow[15] ? 'Projects: ' + appRow[15] + '\n' : '') + (appRow[16] || 'None')); // Projects
  reviewSheet.getRange('B17').setValue(appRow[19] || 'None'); // Event Exp
}

/**
 * Move to Next Candidate
 */
function loadNextCandidate() {
  const ss = getSpreadsheet();
  const reviewSheet = ss.getSheetByName(REVIEW_SHEET_NAME);
  if (!reviewSheet) return;

  const currentVal = String(reviewSheet.getRange('B3').getValue());
  const currentIndex = parseInt(currentVal.split(' ')[0], 10) || 1;
  loadCandidateByIndex(currentIndex + 1);
}

/**
 * Move to Previous Candidate
 */
function loadPreviousCandidate() {
  const ss = getSpreadsheet();
  const reviewSheet = ss.getSheetByName(REVIEW_SHEET_NAME);
  if (!reviewSheet) return;

  const currentVal = String(reviewSheet.getRange('B3').getValue());
  const currentIndex = parseInt(currentVal.split(' ')[0], 10) || 1;
  loadCandidateByIndex(currentIndex - 1);
}

/**
 * Submit and Save current review into Reviewed_Candidates
 */
function submitCandidateReview() {
  const ss = getSpreadsheet();
  const reviewSheet = ss.getSheetByName(REVIEW_SHEET_NAME);
  const reviewedSheet = ss.getSheetByName(RESULTS_SHEET_NAME);
  const appSheet = ss.getSheetByName(SHEET_NAME);

  if (!reviewSheet || !reviewedSheet || !appSheet) {
    SpreadsheetApp.getUi().alert('Review sheets are not set up. Click "Setup Review Sheets" first.');
    return;
  }

  const currentVal = String(reviewSheet.getRange('B3').getValue());
  const currentIndex = parseInt(currentVal.split(' ')[0], 10) || 1;
  const totalCandidates = Math.max(appSheet.getLastRow() - 1, 0);

  if (totalCandidates === 0 || !reviewSheet.getRange('B6').getValue()) {
    SpreadsheetApp.getUi().alert('No candidate selected to review.');
    return;
  }

  // Candidate Data
  const appRow = appSheet.getRange(currentIndex + 1, 1, 1, HEADERS.length).getValues()[0];

  // Review Form Inputs
  const reviewerName = reviewSheet.getRange('D6').getValue() || 'Reviewer';
  const attendance = reviewSheet.getRange('D7').getValue() || 'Attended';
  const techRating = reviewSheet.getRange('D8').getValue() || '';
  const commRating = reviewSheet.getRange('D9').getValue() || '';
  const passionRating = reviewSheet.getRange('D10').getValue() || '';
  const decision = reviewSheet.getRange('D11').getValue() || 'Selected';
  const feedback = reviewSheet.getRange('D12').getValue() || '';

  const reviewedRecord = [
    new Date(),
    reviewerName,
    attendance,
    decision,
    techRating,
    commRating,
    passionRating,
    feedback,
    appRow[1], // Application ID
    appRow[2], // Full Name
    appRow[3], // Roll Number
    appRow[6], // Year
    appRow[7], // Branch
    appRow[8], // Section
    appRow[9], // Domain
    appRow[10], // Wing
    appRow[4], // Email
    appRow[5], // Phone
    appRow[12], // Why GDG
    appRow[13], // Why Wing
    appRow[16] // Project Desc
  ];

  reviewedSheet.appendRow(reviewedRecord);

  // Clear review inputs for next candidate
  reviewSheet.getRange('D12').clearContent(); // Feedback notes

  SpreadsheetApp.getActiveSpreadsheet().toast(
    '✅ Review saved for ' + appRow[2] + ' (' + decision + ') in "' + RESULTS_SHEET_NAME + '"!',
    'Review Saved',
    5
  );

  // Automatically advance to next candidate if available
  if (currentIndex < totalCandidates) {
    loadCandidateByIndex(currentIndex + 1);
  }
}
