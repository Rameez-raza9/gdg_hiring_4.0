export const years = ['2nd Year', '3rd Year']
export const branches = ['CSD', 'AIML', 'CAI', 'CSE', 'CST', 'ECE', 'ECT', 'MECH', 'EEE', 'Civil']
export const sections = { AIML: ['A', 'B', 'C'], CAI: ['A', 'B', 'C'], CSE: ['A', 'B', 'C', 'D', 'E'], ECE: ['A', 'B', 'C', 'D'] }
export const getSections = branch => sections[branch] || (branch ? ['A'] : [])
export const steps = ['Personal Details', 'Academic Details', 'Domain & Wing', 'Additional Questions', 'Review & Submit']
export const wings = {
  Tech: [
    { name: 'AI & ML', icon: 'brain', prerequisites: ['Basic Python knowledge', 'Interest in Machine Learning & AI'] },
    { name: 'Web Development', icon: 'code', prerequisites: ['Basic HTML, CSS & JavaScript', 'Interest in building websites'] },
    { name: 'Coding', icon: 'terminal', prerequisites: ['Good programming fundamentals in any language', 'Basic problem-solving & DSA'] },
    { name: 'Cloud & DevOps', icon: 'cloud', prerequisites: ['Basic Linux/Git knowledge', 'Interest in Cloud, Docker & deployment'] },
  ],
  'Non-Tech': [
    { name: 'Public Relations (PR)', icon: 'megaphone', prerequisites: ['Good communication skills', 'Confidence in interacting with people'] },
    { name: 'Creative Design', icon: 'palette', prerequisites: ['Basic design sense', 'Familiarity with Canva/Figma or similar tools'] },
    { name: 'Social Media Marketing', icon: 'share', prerequisites: ['Knowledge of social media platforms', 'Creativity in content creation'] },
    { name: 'Event Management', icon: 'calendar', prerequisites: ['Good coordination skills', 'Ability to communicate and work in a team'] },
  ],
}
export const wingOptions = {
  'AI & ML': { label: 'Which Python libraries/tools have you used?', options: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Other'] },
  'Web Development': { label: 'Which technologies have you worked with?', options: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Other'] },
  Coding: { label: 'Which programming languages do you know?', options: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Other'] },
  'Cloud & DevOps': { label: 'Which technologies/tools have you used?', options: ['Linux', 'Git/GitHub', 'Docker', 'AWS', 'Azure', 'GCP', 'Other'] },
  'Creative Design': { label: 'Which design tools have you used?', options: ['Canva', 'Figma', 'Photoshop', 'Illustrator', 'Other'] },
  'Social Media Marketing': { label: 'Which social media platforms have you worked with?', options: ['Instagram', 'LinkedIn', 'YouTube', 'X', 'Other'] },
}
