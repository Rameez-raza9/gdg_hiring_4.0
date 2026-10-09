import { STORAGE_KEY, REVIEWS_STORAGE_KEY } from './applicationService'
import { fetchFromTurso, saveReviewToTurso } from './tursoService'
import { sendInterviewCompletedEmail } from './mailService'

export const SAMPLE_APPLICATIONS = [
  {
    applicationId: 'APP-100201',
    rowIndex: 2,
    name: 'K. Sai Varun',
    rollNumber: '22A81A0512',
    email: 'saivarun.k@srivasaviengg.ac.in',
    phone: '9848012345',
    year: '3rd Year',
    branch: 'CSE',
    section: 'A',
    domain: 'Tech',
    wing: 'Web Development',
    prerequisiteConfirmation: 'Yes',
    whyGDG: 'I want to build real-world applications that solve campus and community problems while collaborating with passionate developers.',
    whyWing: 'I have strong foundation in React and Node.js and have built several full-stack web applications. I want to build platforms for GDG events.',
    experienceLevel: 'Intermediate',
    hasProjects: 'Yes',
    projectDescription: 'Built a College Campus Event Hub in Next.js & Tailwind CSS with over 500 active student users.',
    wingSpecific: ['React.js', 'Node.js', 'Tailwind CSS', 'TypeScript'],
    wingSpecificText: 'Familiar with REST APIs and Supabase authentication.',
    wingSpecificYes: '',
    previousEventExperience: 'Volunteered for TechFest 2024 web team.',
    submittedAt: '2026-10-06T10:15:00Z',
    confirmed: true,
  },
  {
    applicationId: 'APP-100202',
    rowIndex: 3,
    name: 'P. Ananya Sri',
    rollNumber: '23A81A4228',
    email: 'ananya.p@srivasaviengg.ac.in',
    phone: '9440123456',
    year: '2nd Year',
    branch: 'AIML',
    section: 'B',
    domain: 'Tech',
    wing: 'Machine Learning & AI',
    prerequisiteConfirmation: 'Yes',
    whyGDG: 'GDG is the best peer-learning group on campus to exchange research papers, explore GenAI, and host workshops.',
    whyWing: 'I am fascinated by computer vision and LLM agents. I have been fine-tuning HuggingFace models for local tasks.',
    experienceLevel: 'Intermediate',
    hasProjects: 'Yes',
    projectDescription: 'Plant Disease Detector using PyTorch and Transfer Learning with 93% test accuracy.',
    wingSpecific: ['Python', 'PyTorch', 'HuggingFace', 'OpenCV'],
    wingSpecificText: 'Actively participating in Kaggle competitions.',
    wingSpecificYes: '',
    previousEventExperience: '',
    submittedAt: '2026-10-06T11:42:00Z',
    confirmed: true,
  },
  {
    applicationId: 'APP-100203',
    rowIndex: 4,
    name: 'V. Raghava Chowdary',
    rollNumber: '22A81A0445',
    email: 'raghava.v@srivasaviengg.ac.in',
    phone: '9123456789',
    year: '3rd Year',
    branch: 'ECE',
    section: 'A',
    domain: 'Non-Tech',
    wing: 'Event Management',
    prerequisiteConfirmation: 'Yes',
    whyGDG: 'I love bringing people together and managing logistics so tech events run smoothly without hiccups.',
    whyWing: 'Organized our college annual cultural and technical symposium with over 1200 participants.',
    experienceLevel: 'Advanced',
    hasProjects: '',
    projectDescription: '',
    wingSpecific: ['Stage Management', 'Logistics', 'Budgeting'],
    wingSpecificText: 'Headed stage coordination and hospitality for college annual fest.',
    wingSpecificYes: 'Yes',
    previousEventExperience: 'Head Coordinator, ECE Tech Symposium 2024',
    submittedAt: '2026-10-06T14:20:00Z',
    confirmed: true,
  },
  {
    applicationId: 'APP-100204',
    rowIndex: 5,
    name: 'M. Divya Teja',
    rollNumber: '23A81A0589',
    email: 'divya.teja@srivasaviengg.ac.in',
    phone: '9876543210',
    year: '2nd Year',
    branch: 'CST',
    section: 'A',
    domain: 'Non-Tech',
    wing: 'UI / UX & Design',
    prerequisiteConfirmation: 'Yes',
    whyGDG: 'Visual communication is key for developer communities. I want to create beautiful posters, badges, and brand assets for GDGoC.',
    whyWing: 'I actively design in Figma and Photoshop. I maintain a Behance portfolio of mobile app and branding designs.',
    experienceLevel: 'Intermediate',
    hasProjects: '',
    projectDescription: '',
    wingSpecific: ['Figma', 'Adobe Illustrator', 'Canva', 'Photoshop'],
    wingSpecificText: 'Created branding kits and Instagram story templates for college coding club.',
    wingSpecificYes: '',
    previousEventExperience: 'Designer for College Hackathon brochure',
    submittedAt: '2026-10-07T09:05:00Z',
    confirmed: true,
  },
  {
    applicationId: 'APP-100205',
    rowIndex: 6,
    name: 'B. Karthik Varma',
    rollNumber: '22A81A0563',
    email: 'karthik.varma@srivasaviengg.ac.in',
    phone: '9988776655',
    year: '3rd Year',
    branch: 'CSE',
    section: 'B',
    domain: 'Tech',
    wing: 'Cloud & DevOps',
    prerequisiteConfirmation: 'Yes',
    whyGDG: 'To deepen my knowledge in Google Cloud Platform and help students deploy scalable systems.',
    whyWing: 'Hands-on experience with Docker, GCP Compute Engine, and CI/CD pipelines with GitHub Actions.',
    experienceLevel: 'Intermediate',
    hasProjects: 'Yes',
    projectDescription: 'Automated CI/CD pipeline deploying microservices to GCP Cloud Run with automated test reporting.',
    wingSpecific: ['Docker', 'Google Cloud Platform (GCP)', 'GitHub Actions', 'Linux'],
    wingSpecificText: 'Completed Google Cloud Skills Boost 30-day challenge.',
    wingSpecificYes: '',
    previousEventExperience: '',
    submittedAt: '2026-10-07T12:30:00Z',
    confirmed: true,
  },
  {
    applicationId: 'APP-100206',
    rowIndex: 7,
    name: 'S. Haritha',
    rollNumber: '23A81A05K4',
    email: 'haritha.s@srivasaviengg.ac.in',
    phone: '9550011223',
    year: '2nd Year',
    branch: 'CSE',
    section: 'C',
    domain: 'Non-Tech',
    wing: 'Public Relations (PR)',
    prerequisiteConfirmation: 'Yes',
    whyGDG: 'I want to build strong outreach, engage student communities across all branches, and invite external industry speakers.',
    whyWing: 'I have excellent verbal and written communication skills and active connections with GDG chapters in other colleges.',
    experienceLevel: 'Advanced',
    hasProjects: '',
    projectDescription: '',
    wingSpecific: ['Public Speaking', 'Social Media Management', 'Sponsorship Outreach'],
    wingSpecificText: 'Anchored 4 major college events and managed Instagram account for student chapters.',
    wingSpecificYes: '',
    previousEventExperience: 'Anchor & PR Lead for SVEC Induction Program 2024',
    submittedAt: '2026-10-07T15:10:00Z',
    confirmed: true,
  },
  {
    applicationId: 'APP-100207',
    rowIndex: 8,
    name: 'G. Tarun Kumar',
    rollNumber: '22A81A4418',
    email: 'tarun.g@srivasaviengg.ac.in',
    phone: '9676123489',
    year: '3rd Year',
    branch: 'AIDS',
    section: 'A',
    domain: 'Tech',
    wing: 'Mobile Development',
    prerequisiteConfirmation: 'Yes',
    whyGDG: 'Mobile apps put technology right into students hands. GDG is the premier hub for Flutter & Android development.',
    whyWing: 'Built 2 Flutter mobile apps published on GitHub, integrating Firebase auth and real-time database.',
    experienceLevel: 'Intermediate',
    hasProjects: 'Yes',
    projectDescription: 'Vasavi Student Companion: A Flutter app for attendance tracking and timetable notifications.',
    wingSpecific: ['Flutter', 'Dart', 'Firebase', 'Android Studio'],
    wingSpecificText: 'Passionate about Clean Architecture and Riverpod state management.',
    wingSpecificYes: '',
    previousEventExperience: 'Attended Flutter Forward Extended 2023',
    submittedAt: '2026-10-08T08:45:00Z',
    confirmed: true,
  }
]

export function getLocalReviews() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveLocalReview(applicationId, review) {
  if (typeof window === 'undefined') return {}
  try {
    const existing = getLocalReviews()
    existing[applicationId] = {
      ...review,
      reviewedAt: review.reviewedAt || new Date().toISOString()
    }
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(existing))
    return existing
  } catch (err) {
    console.error('Failed to save review in localStorage', err)
    return {}
  }
}

/**
 * Fetch applications and reviews.
 * 1. Checks Turso DB first if configured.
 * 2. Augments with local submissions and sample candidate pool.
 * 3. Augments candidate list with saved review status.
 */
export async function fetchApplications() {
  let tursoCandidates = null
  try {
    tursoCandidates = await fetchFromTurso()
  } catch (err) {
    console.warn('Turso DB read failed:', err)
  }

  // Load reviews from localStorage
  const localReviewsMap = getLocalReviews()

  // Read locally stored submitted applications from localStorage
  let localSubmitted = []
  if (typeof window !== 'undefined') {
    try {
      localSubmitted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      localSubmitted = []
    }
  }

  const formattedLocal = localSubmitted.map((app, idx) => ({
    applicationId: app.applicationId || `APP-LOC-${idx + 1}`,
    rowIndex: 1000 + idx,
    name: app.name || 'Applicant',
    rollNumber: app.rollNumber || '',
    email: app.email || '',
    phone: app.phone || '',
    year: app.year || '',
    branch: app.branch || '',
    section: app.section || 'A',
    domain: app.domain || 'Tech',
    wing: app.wing || '',
    prerequisiteConfirmation: app.prerequisiteConfirmation || '',
    whyGDG: app.whyGDG || '',
    whyWing: app.whyWing || '',
    experienceLevel: app.experienceLevel || '',
    hasProjects: app.hasProjects || '',
    projectDescription: app.projectDescription || '',
    wingSpecific: app.wingSpecific || [],
    wingSpecificText: app.wingSpecificText || '',
    wingSpecificYes: app.wingSpecificYes || '',
    previousEventExperience: app.previousEventExperience || '',
    submittedAt: app.submittedAt || new Date().toISOString(),
    confirmed: app.confirmed || false
  }))

  let combined = []
  let source = 'local-database'

  if (tursoCandidates && Array.isArray(tursoCandidates) && tursoCandidates.length > 0) {
    combined = [...tursoCandidates]
    source = 'turso'
    // Merge any recent local submissions
    const existingIds = new Set(tursoCandidates.map(a => a.applicationId || a.rollNumber))
    for (const loc of formattedLocal) {
      if (!existingIds.has(loc.applicationId) && !existingIds.has(loc.rollNumber)) {
        combined.unshift(loc)
      }
    }
  } else if (formattedLocal.length > 0) {
    combined = [...formattedLocal, ...SAMPLE_APPLICATIONS]
  } else {
    combined = [...SAMPLE_APPLICATIONS]
  }

  // Merge review information into each candidate
  const candidates = combined.map(candidate => {
    const rev = candidate.review ||
      localReviewsMap[candidate.applicationId] ||
      localReviewsMap[candidate.rollNumber] ||
      null

    return {
      ...candidate,
      isReviewed: !!rev,
      review: rev || null
    }
  })

  return {
    candidates,
    source,
    stats: {
      total: candidates.length,
      reviewed: candidates.filter(c => c.isReviewed).length,
      pending: candidates.filter(c => !c.isReviewed).length,
      tech: candidates.filter(c => c.domain === 'Tech').length,
      nonTech: candidates.filter(c => c.domain === 'Non-Tech').length,
    }
  }
}

/**
 * Save candidate interview review into the system database.
 * Simultaneously writes to localStorage and Turso DB,
 * and auto-dispatches the Thank You email.
 */
export async function submitInterviewReview(reviewPayload, candidate) {
  // 1. Immediately cache in localStorage
  saveLocalReview(reviewPayload.applicationId, reviewPayload)

  // 2. Persist to Turso DB in parallel
  let tursoSaved = false
  try {
    tursoSaved = await saveReviewToTurso(reviewPayload)
  } catch (e) {
    console.warn('Turso review save error:', e)
  }

  // 3. Automatically dispatch Thank You email to candidate
  if (candidate && candidate.email) {
    try {
      sendInterviewCompletedEmail(candidate, reviewPayload).catch(() => {})
    } catch (err) {
      console.warn('Mail dispatch error:', err)
    }
  }

  return {
    ok: true,
    destination: tursoSaved ? 'turso-cloud' : 'local-database'
  }
}
