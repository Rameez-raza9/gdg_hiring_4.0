export function validateStep(step, form) {
  const errors = {}
  const required = (key, label) => { if (!String(form[key] ?? '').trim()) errors[key] = `${label} is required.` }
  if (step === 0) {
    required('name', 'Full name'); required('rollNumber', 'Roll number'); required('email', 'Email address'); required('phone', 'Phone number')
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email address.'
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Please enter a valid 10-digit phone number.'
  }
  if (step === 1) { required('year', 'Year'); required('branch', 'Branch'); if (form.branch) required('section', 'Section') }
  if (step === 2) { required('domain', 'Domain'); required('wing', 'Wing'); required('prerequisiteConfirmation', 'Please confirm your prerequisite response') }
  if (step === 3) {
    required('whyGDG', 'This response'); required('whyWing', 'This response'); required('experienceLevel', 'Experience level')
    if (form.domain === 'Tech' && form.year === '3rd Year') {
      required('hasProjects', 'Please select an option')
      if (form.hasProjects === 'Yes') required('projectDescription', 'Project description')
    }
    if (form.domain === 'Non-Tech' && form.wing === 'Public Relations (PR)') required('wingSpecificText', 'This response')
    if (form.wing === 'Event Management' && form.wingSpecificYes === 'Yes') required('wingSpecificText', 'Event description')
  }
  return errors
}
