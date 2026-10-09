"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Brain, CalendarDays, Check, CheckCircle2,
  Cloud, Code2, CodeXml, Instagram, Linkedin, Megaphone, Palette,
  Share2, Sparkles, Terminal, Users, ExternalLink, Flame, Lock,
  Award, Rocket, Laptop, HelpCircle, Layers, CheckSquare
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Progress from '@/components/Progress'
import { Field, SelectField, TextArea } from '@/components/Field'
import { branches, getSections, sections, steps, wings, years, wingOptions } from '@/data/applicationData'
import { validateStep } from '@/utils/validation'
import { submitApplication } from '@/services/applicationService'
import { GDG_COMMUNITY_LINKS } from '@/services/mailService'

const initial = {
  name: '', rollNumber: '', email: '', phone: '', year: '', branch: '',
  section: '', domain: '', wing: '', prerequisiteConfirmation: '',
  whyGDG: '', whyWing: '', experienceLevel: '', hasProjects: '',
  projectDescription: '', wingSpecific: [], wingSpecificText: '', wingSpecificYes: ''
}

const iconMap = {
  brain: Brain, code: CodeXml, terminal: Terminal, cloud: Cloud,
  megaphone: Megaphone, palette: Palette, share: Share2, calendar: CalendarDays
}

const TRACKS_INFO = [
  {
    domain: 'Tech',
    name: 'Web & App Development',
    icon: CodeXml,
    badge: 'TECHNICAL TRACK',
    desc: 'Build scalable modern web platforms, student portals, and mobile applications using React, Next.js, Flutter, and Node.js.',
    skills: ['React.js', 'Flutter', 'TypeScript', 'Node.js', 'REST APIs'],
    prereqs: 'Basics of JavaScript / Dart and passion for building UI & backend systems.'
  },
  {
    domain: 'Tech',
    name: 'Machine Learning & AI',
    icon: Brain,
    badge: 'TECHNICAL TRACK',
    desc: 'Explore computer vision, NLP, and Generative AI. Train and fine-tune models to solve real-world problems on campus.',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'HuggingFace', 'OpenCV'],
    prereqs: 'Comfortable with Python and eager to explore neural networks & ML models.'
  },
  {
    domain: 'Tech',
    name: 'Cloud & DevOps',
    icon: Cloud,
    badge: 'TECHNICAL TRACK',
    desc: 'Deploy containerized microservices, build CI/CD automation pipelines, and master Google Cloud Platform infrastructure.',
    skills: ['Google Cloud (GCP)', 'Docker', 'Linux', 'GitHub Actions', 'Kubernetes'],
    prereqs: 'Familiarity with Linux commands and interest in cloud architecture.'
  },
  {
    domain: 'Non-Tech',
    name: 'UI / UX & Design',
    icon: Palette,
    badge: 'CREATIVE TRACK',
    desc: 'Craft striking event posters, brand design systems, and intuitive user experiences for community platforms in Figma.',
    skills: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Canva', 'Prototyping'],
    prereqs: 'Visual creativity and passion for typography, layout, and user flows.'
  },
  {
    domain: 'Non-Tech',
    name: 'Public Relations (PR)',
    icon: Megaphone,
    badge: 'CORE TRACK',
    desc: 'Lead campus-wide communication, anchor community meetups, manage social media channels, and invite tech leaders.',
    skills: ['Public Speaking', 'Social Media Growth', 'Anchoring', 'Sponsorships'],
    prereqs: 'Strong verbal & written communication skills and active networking enthusiasm.'
  },
  {
    domain: 'Non-Tech',
    name: 'Event Management',
    icon: CalendarDays,
    badge: 'CORE TRACK',
    desc: 'Coordinate flagship hackathons, technical symposiums, and hands-on workshops with flawless stage ops and logistics.',
    skills: ['Event Planning', 'Stage Operations', 'Logistics', 'Budgeting'],
    prereqs: 'Leadership mindset, teamwork skills, and ability to handle on-ground execution.'
  }
]

export default function HomePage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      if (hash === '#portal' || hash === '#admin') {
        router.push('/portal')
      } else if (hash === '#apply') {
        setStarted(true)
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    window.addEventListener('popstate', checkHash)
    return () => {
      window.removeEventListener('hashchange', checkHash)
      window.removeEventListener('popstate', checkHash)
    }
  }, [router])

  const startApplicationForWing = (domain, wingName) => {
    setForm(f => ({
      ...f,
      domain,
      wing: wingName,
      prerequisiteConfirmation: 'Yes'
    }))
    setStarted(true)
    setStep(0)
    window.location.hash = 'apply'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const update = (e) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: value,
      ...(name === 'branch' ? { section: value ? 'A' : '' } : {}),
      ...(name === 'year' && value === '2nd Year' ? { hasProjects: '', projectDescription: '' } : {})
    }))
    setErrors(v => ({ ...v, [name]: '' }))
  }

  const change = (name, value) => {
    setForm(f => ({ ...f, [name]: value }))
    setErrors(v => ({ ...v, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = validateStep(step, form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => {
        const el = document.querySelector('[aria-invalid="true"]')
        el?.focus()
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return false
    }
    return true
  }

  const goNext = () => {
    if (validate()) {
      setStep(s => Math.min(s + 1, 4))
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    setStep(s => Math.max(s - 1, 0))
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const editSection = (target) => {
    setStep(target)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async () => {
    if (isSubmitting) return
    if (!confirmed) {
      setSubmitError('Please confirm that your information is accurate.')
      return
    }
    setIsSubmitting(true)
    setSubmitError('')
    try {
      await submitApplication({ ...form, phone: form.phone.replace(/\D/g, ''), confirmed })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message || 'Could not save your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const pickDomain = (domain) => {
    setForm(f => ({
      ...f, domain, wing: '', prerequisiteConfirmation: '',
      wingSpecific: [], wingSpecificText: '', wingSpecificYes: '',
      hasProjects: '', projectDescription: ''
    }))
    setErrors({})
  }

  const pickWing = (wing) => {
    setForm(f => ({
      ...f, wing, prerequisiteConfirmation: '',
      wingSpecific: [], wingSpecificText: '', wingSpecificYes: ''
    }))
    setErrors({})
  }

  const toggleOption = (option) => {
    setForm(f => ({
      ...f,
      wingSpecific: f.wingSpecific.includes(option)
        ? f.wingSpecific.filter(x => x !== option)
        : [...f.wingSpecific, option]
    }))
  }

  const selectedWing = wings[form.domain]?.find(w => w.name === form.wing)

  return (
    <div id="home" className="app-shell">
      <Header
        isPortal={false}
        onTogglePortal={() => router.push('/portal')}
        onStartApply={() => {
          setStarted(true)
          window.location.hash = 'apply'
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      {!started ? (
        <>
          {/* Hero Section */}
          <section className="neo-hero-section">
            <div className="neo-hero-container">
              <div className="hero-kicker-badge">
                <span className="live-dot" />
                <span>GDG ON CAMPUS · SVEC 4.0 RECRUITMENT</span>
              </div>

              <h1 className="hero-main-title">
                <span className="title-college">GDGoC SVEC</span>
                <span className="title-emblem-wrap">
                  <img
                    className="hero-flaming-emblem"
                    src="/assets/flaming-4o-emblem-transparent.png"
                    alt="4.O"
                  />
                  <span className="title-hiring-word">Hiring</span>
                </span>
              </h1>

              <p className="hero-punchline">
                Be part of a community of builders, innovators, designers, and organizers at Sri Vasavi Engineering College.
              </p>

              <div className="hero-action-buttons">
                <button
                  type="button"
                  className="button primary hero-primary-cta"
                  onClick={() => {
                    setStarted(true)
                    window.location.hash = 'apply'
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <Flame size={18} className="text-amber-300" />
                  <span>Start Application</span>
                  <ArrowRight size={18} />
                </button>
                <a href="#tracks" className="button secondary hero-secondary-cta">
                  <span>Explore Tracks</span>
                </a>
              </div>

              {/* Metrics Strip */}
              <div className="hero-metric-strip">
                <div className="metric-brick">
                  <span className="brick-number">500+</span>
                  <span className="brick-label">Campus Builders</span>
                </div>
                <div className="metric-brick">
                  <span className="brick-number">6</span>
                  <span className="brick-label">Specialized Wings</span>
                </div>
                <div className="metric-brick">
                  <span className="brick-number">2</span>
                  <span className="brick-label">Tracks (Tech & Core)</span>
                </div>
                <div className="metric-brick">
                  <span className="brick-number">100%</span>
                  <span className="brick-label">Student Led</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tracks & Wings Section */}
          <section id="tracks" className="neo-tracks-section">
            <div className="section-header-centered">
              <span className="section-pill">CHOOSE YOUR IMPACT</span>
              <h2 className="section-heading-bold">Recruitment Tracks & Wings</h2>
              <p className="section-subtext">
                Select where you want to contribute. Find the wing matching your skills or enthusiasm to learn.
              </p>
            </div>

            <div className="neo-tracks-grid">
              {TRACKS_INFO.map((track) => {
                const Icon = track.icon
                return (
                  <div key={track.name} className="neo-track-card">
                    <div className="card-top-header">
                      <span className={`track-badge ${track.domain === 'Tech' ? 'tech' : 'core'}`}>
                        {track.badge}
                      </span>
                      <div className="track-icon-wrapper">
                        <Icon size={22} />
                      </div>
                    </div>

                    <h3 className="track-title">{track.name}</h3>
                    <p className="track-description">{track.desc}</p>

                    <div className="track-skills-list">
                      {track.skills.map(s => (
                        <span key={s} className="skill-tag">{s}</span>
                      ))}
                    </div>

                    <div className="track-prereq-box">
                      <strong>Prerequisite:</strong> {track.prereqs}
                    </div>

                    <button
                      type="button"
                      className="button track-apply-btn"
                      onClick={() => startApplicationForWing(track.domain, track.name)}
                    >
                      <span>Apply for {track.name}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Why Join GDGoC SVEC Section */}
          <section className="neo-perks-section">
            <div className="section-header-centered">
              <span className="section-pill">COMMUNITY PERKS</span>
              <h2 className="section-heading-bold">Why Join GDGoC SVEC 4.0?</h2>
              <p className="section-subtext">
                Level up your engineering journey with exclusive mentorship, cloud resources, and projects.
              </p>
            </div>

            <div className="neo-perks-grid">
              <div className="neo-perk-card">
                <span className="perk-icon">☁️</span>
                <h3>Google Cloud Vouchers & Badges</h3>
                <p>
                  Receive free access to Google Cloud Skills Boost labs, course vouchers, and official Google Cloud skill badges.
                </p>
              </div>

              <div className="neo-perk-card">
                <span className="perk-icon">🛠️</span>
                <h3>Real-World Campus Projects</h3>
                <p>
                  Build production platforms, registration portals, and student apps utilized by thousands across campus.
                </p>
              </div>

              <div className="neo-perk-card">
                <span className="perk-icon">🏆</span>
                <h3>Hackathons & DevFests</h3>
                <p>
                  Organize and participate in national hackathons, code jams, and regional Google Developer conferences.
                </p>
              </div>

              <div className="neo-perk-card">
                <span className="perk-icon">🤝</span>
                <h3>Lifelong Developer Network</h3>
                <p>
                  Connect with alumni, industry engineers, and Google Developer Experts to accelerate your career placement.
                </p>
              </div>
            </div>
          </section>

          {/* Community Strip */}
          <div className="neo-community-strip">
            <div className="strip-text">
              <strong>One community.</strong> A hundred ways to make a difference at SVEC.
            </div>
            <div className="strip-socials">
              <span>Follow GDGoC SVEC:</span>
              <a
                href="https://www.linkedin.com/company/gdgoc-svec/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="social-badge"
              >
                <Linkedin size={15} /> <span>LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/gdgoc.svec?stkn=ZXEwd2FxajB3c2p0"
                target="_blank"
                rel="noopener noreferrer"
                className="social-badge"
              >
                <Instagram size={15} /> <span>Instagram</span>
              </a>
            </div>
          </div>
        </>
      ) : submitted ? (
        /* Submission Success Page */
        <main className="success-page">
          <div className="success-card neo-brutal-card">
            <div className="success-icon"><Check size={36} /></div>
            <span className="success-kicker">APPLICATION SUBMITTED</span>
            <h1>Application Submitted Successfully!</h1>
            <p>
              Thank you for applying to <strong>GDGoC SVEC 4.0</strong>! Your profile has been recorded.
            </p>

            {/* Next Steps & Community Links */}
            <div className="submission-next-steps-card">
              <h3 className="next-steps-title">
                <Sparkles size={16} /> Important Next Steps:
              </h3>
              <div className="next-step-box whatsapp-box">
                <div className="step-info">
                  <strong>1. Join Official Recruitment WhatsApp Group</strong>
                  <p>Receive interview schedules, batch timings, and announcements:</p>
                </div>
                <a
                  href={GDG_COMMUNITY_LINKS.WHATSAPP_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary whatsapp-join-btn"
                >
                  Join WhatsApp <ExternalLink size={14} />
                </a>
              </div>

              <div className="next-step-box cloud-box">
                <div className="step-info">
                  <strong>2. Google Cloud Skills Boost Voucher</strong>
                  <p>Free Google Cloud labs and skill badges while preparing:</p>
                  <code className="voucher-code-badge">Access Code: {GDG_COMMUNITY_LINKS.GOOGLE_CLOUD_VOUCHER}</code>
                </div>
                <a
                  href={GDG_COMMUNITY_LINKS.GOOGLE_CLOUD_STUDY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button secondary cloud-boost-btn"
                >
                  Open Cloud Boost <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <p className="success-note">
              Good luck! Our recruitment team will review your application and notify you through email and WhatsApp.
            </p>

            <button
              className="button secondary"
              onClick={() => {
                setSubmitted(false)
                setStarted(false)
                setForm(initial)
                setStep(0)
                setConfirmed(false)
                window.location.hash = 'home'
              }}
            >
              Back to Home <ArrowRight size={16} />
            </button>
          </div>
        </main>
      ) : (
        /* Step-by-Step Application Form */
        <main className="application-page">
          <div className="application-heading">
            <div>
              <span className="eyebrow form-eyebrow">
                <span className="eyebrow-dot" /> GDG CAMPUS · APPLICATION
              </span>
              <h1>Your next chapter<br className="mobile-break" /> starts here.</h1>
              <p>A few details to help us find the right place for you in our community.</p>
            </div>
            <div className="secure-note">
              <span><CheckCircle2 size={15} /></span> Your details stay private
            </div>
          </div>

          <Progress current={step} />

          <section className="form-card neo-brutal-card" aria-labelledby="step-title">
            <div className="form-card-top">
              <span className="card-step-label">STEP 0{step + 1} <i /> {steps[step].toUpperCase()}</span>
              <span className="required-note"><b>*</b> Required fields</span>
            </div>

            <div className="form-content" key={step}>
              {step === 0 && (
                <>
                  <div className="step-heading">
                    <span className="step-icon"><Users size={19} /></span>
                    <div>
                      <h2 id="step-title">Let’s get to know you</h2>
                      <p>First, the basics. We’ll use these to keep in touch.</p>
                    </div>
                  </div>
                  <div className="fields-grid">
                    <Field label="Full Name" name="name" placeholder="Enter your full name" value={form.name} onChange={update} required error={errors.name} autoComplete="name" />
                    <Field label="Roll Number" name="rollNumber" placeholder="Enter your roll number" value={form.rollNumber} onChange={update} required error={errors.rollNumber} />
                    <Field label="Email Address" name="email" type="email" placeholder="example@gmail.com" value={form.email} onChange={update} required error={errors.email} autoComplete="email" />
                    <Field label="Phone Number" name="phone" type="tel" inputMode="numeric" maxLength="10" placeholder="Enter your phone number" value={form.phone} onChange={e => { if (/^[\d\s+()-]*$/.test(e.target.value)) update(e) }} required error={errors.phone} autoComplete="tel" />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="step-heading">
                    <span className="step-icon"><Sparkles size={19} /></span>
                    <div>
                      <h2 id="step-title">Academic Details</h2>
                      <p>Help us get to know your academic background.</p>
                    </div>
                  </div>
                  <div className="fields-grid academic-grid">
                    <SelectField label="Year" name="year" value={form.year} onChange={update} required options={years} error={errors.year} />
                    <SelectField label="Branch" name="branch" value={form.branch} onChange={update} required options={branches} error={errors.branch} />
                    <div className="field">
                      <SelectField label="Section" name="section" value={form.section} onChange={update} required={!!form.branch} options={getSections(form.branch)} error={errors.section} placeholder='Select a branch' disabled={!form.branch} />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="step-heading">
                    <span className="step-icon"><Code2 size={19} /></span>
                    <div>
                      <h2 id="step-title">Where do you want to contribute?</h2>
                      <p>Pick a domain, then choose the wing that feels right.</p>
                    </div>
                  </div>
                  <div className="domain-grid">
                    {[['Tech', 'Build, code and solve technical problems.', Code2], ['Non-Tech', 'Create, communicate and organize impactful experiences.', Users]].map(([name, desc, Icon]) => (
                      <button key={name} className={`domain-card ${form.domain === name ? 'selected' : ''}`} onClick={() => pickDomain(name)} aria-pressed={form.domain === name}>
                        <span className="domain-icon"><Icon size={21} /></span>
                        <span className="domain-copy"><b>{name}</b><small>{desc}</small></span>
                        <span className="select-radio">{form.domain === name && <i />}</span>
                      </button>
                    ))}
                  </div>
                  {errors.domain && <small className="error block-error">{errors.domain}</small>}

                  {form.domain && (
                    <div className="wing-section">
                      <div className="subsection-heading">
                        <h3>Choose your wing</h3>
                        <span>SELECT ONE</span>
                      </div>
                      <div className="wing-grid">
                        {wings[form.domain].map(w => {
                          const Icon = iconMap[w.icon]
                          return (
                            <button key={w.name} className={`wing-card ${form.wing === w.name ? 'selected' : ''}`} onClick={() => pickWing(w.name)} aria-pressed={form.wing === w.name}>
                              <span className="wing-icon"><Icon size={19} /></span>
                              <span className="wing-name">{w.name}</span>
                              <span className="wing-desc">{w.prerequisites.join('; ')}</span>
                              <span className="wing-select">{form.wing === w.name ? <><Check size={14} /> Selected</> : 'Select'}{form.wing !== w.name && <ArrowRight size={13} />}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedWing && (
                    <div className="prereq-panel">
                      <div className="prereq-title">
                        <span className="prereq-check"><Check size={15} /></span>
                        <div><b>{selectedWing.name}</b><small>Prerequisites</small></div>
                      </div>
                      <ul>
                        {selectedWing.prerequisites.map(p => <li key={p}><Check size={14} />{p}</li>)}
                      </ul>
                      <div className="prereq-question">
                        <b>Are you comfortable with these prerequisites?</b>
                        <div className="radio-row">
                          {['Yes', 'I am willing to learn'].map(value => (
                            <button key={value} className={`radio-choice ${form.prerequisiteConfirmation === value ? 'chosen' : ''}`} onClick={() => change('prerequisiteConfirmation', value)} aria-pressed={form.prerequisiteConfirmation === value}>
                              <span className="radio-dot" />{value}
                            </button>
                          ))}
                        </div>
                        {errors.prerequisiteConfirmation && <small className="error">{errors.prerequisiteConfirmation}</small>}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <div className="step-heading">
                    <span className="step-icon"><Sparkles size={19} /></span>
                    <div>
                      <h2 id="step-title">A little more about you</h2>
                      <p>There’s no perfect answer. We’d love to hear your perspective.</p>
                    </div>
                  </div>
                  <div className="question-stack">
                    <TextArea label="Why do you want to join GDG?" name="whyGDG" value={form.whyGDG} onChange={update} required error={errors.whyGDG} placeholder="What draws you to our community?" />
                    <TextArea label={`Why are you interested in ${form.wing || 'this wing'}?`} name="whyWing" value={form.whyWing} onChange={update} required error={errors.whyWing} placeholder="Tell us what excites you about this area." />
                    <div className="field">
                      <label>How much experience do you have in this area?<span className="required"> *</span></label>
                      <div className="choice-row">
                        {['Beginner', 'Intermediate', 'Advanced'].map(v => (
                          <button key={v} className={`choice-chip ${form.experienceLevel === v ? 'chosen' : ''}`} onClick={() => change('experienceLevel', v)} aria-pressed={form.experienceLevel === v}>{v}</button>
                        ))}
                      </div>
                      {errors.experienceLevel && <small className="error">{errors.experienceLevel}</small>}
                    </div>

                    {form.domain === 'Tech' && form.year === "3rd Year" && (
                      <>
                        <div className="field">
                          <label>Have you worked on any related projects?<span className="required"> *</span></label>
                          <div className="choice-row compact">
                            {["Yes", "No"].map(v => (
                              <button key={v} className={`choice-chip ${form.hasProjects === v ? 'chosen' : ''}`} onClick={() => change("hasProjects", v)} aria-pressed={form.hasProjects === v}>{v}</button>
                            ))}
                          </div>
                          {errors.hasProjects && <small className="error">{errors.hasProjects}</small>}
                        </div>
                        {form.hasProjects === "Yes" && (
                          <TextArea label="Briefly describe your project." name="projectDescription" value={form.projectDescription} onChange={update} error={errors.projectDescription} placeholder="What did you build, and what was your role?" />
                        )}
                      </>
                    )}

                    {form.wing === 'Public Relations (PR)' && (
                      <TextArea label="What makes you confident in communication and public interaction?" name="wingSpecificText" value={form.wingSpecificText} onChange={update} error={errors.wingSpecificText} placeholder="Share a little about your strengths." />
                    )}

                    {form.wing === 'Event Management' && (
                      <div className="field">
                        <label>Have you previously organized or coordinated an event?</label>
                        <div className="choice-row compact">
                          {['Yes', 'No'].map(v => (
                            <button key={v} className={`choice-chip ${form.wingSpecificYes === v ? 'chosen' : ''}`} onClick={() => change('wingSpecificYes', v)} aria-pressed={form.wingSpecificYes === v}>{v}</button>
                          ))}
                        </div>
                        {form.wingSpecificYes === 'Yes' && (
                          <div className="nested-field">
                            <TextArea label="Tell us about the event." name="wingSpecificText" value={form.wingSpecificText} onChange={update} error={errors.wingSpecificText} placeholder="What was your role?" />
                          </div>
                        )}
                      </div>
                    )}

                    {wingOptions[form.wing] && (
                      <div className="field">
                        <label>{wingOptions[form.wing].label} <span className="optional">OPTIONAL</span></label>
                        <div className="checkbox-grid">
                          {wingOptions[form.wing].options.map(option => (
                            <button key={option} className={`check-option ${form.wingSpecific.includes(option) ? 'checked' : ''}`} onClick={() => toggleOption(option)} aria-pressed={form.wingSpecific.includes(option)}>
                              <span>{form.wingSpecific.includes(option) && <Check size={13} />}</span>
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="step-heading">
                    <span className="step-icon"><CheckCircle2 size={19} /></span>
                    <div>
                      <h2 id="step-title">Review Your Application</h2>
                      <p>Take a moment to make sure everything looks good.</p>
                    </div>
                  </div>

                  <div className="review-stack">
                    <ReviewSection title="Personal Details" onEdit={() => editSection(0)}>
                      <ReviewItem label="Name" value={form.name} />
                      <ReviewItem label="Roll Number" value={form.rollNumber} />
                      <ReviewItem label="Email" value={form.email} />
                      <ReviewItem label="Phone" value={form.phone} />
                    </ReviewSection>

                    <ReviewSection title="Academic Details" onEdit={() => editSection(1)}>
                      <ReviewItem label="Year" value={form.year} />
                      <ReviewItem label="Branch" value={form.branch} />
                      <ReviewItem label="Section" value={form.section || 'A'} />
                    </ReviewSection>

                    <ReviewSection title="Domain & Wing" onEdit={() => editSection(2)}>
                      <ReviewItem label="Domain" value={form.domain} />
                      <ReviewItem label="Selected wing" value={form.wing} />
                      <ReviewItem label="Prerequisites" value={form.prerequisiteConfirmation} />
                    </ReviewSection>

                    <ReviewSection title="Your answers" onEdit={() => editSection(3)}>
                      <ReviewItem label="Why GDG?" value={form.whyGDG} />
                      <ReviewItem label="Why this wing?" value={form.whyWing} />
                      <ReviewItem label="Experience" value={form.experienceLevel} />
                      {form.domain === 'Tech' && form.year === "3rd Year" && (
                        <ReviewItem label="Related projects" value={form.hasProjects === "Yes" ? form.projectDescription : form.hasProjects} />
                      )}
                      {form.wingSpecific.length > 0 && (
                        <ReviewItem label="Tools / technologies" value={form.wingSpecific.join(', ')} />
                      )}
                      {form.wingSpecificText && (
                        <ReviewItem label="Additional response" value={form.wingSpecificText} />
                      )}
                    </ReviewSection>
                  </div>

                  <label className={`confirm-box ${submitError ? 'has-error' : ''}`}>
                    <input type="checkbox" checked={confirmed} onChange={e => { setConfirmed(e.target.checked); setSubmitError('') }} />
                    <span className="custom-check">{confirmed && <Check size={13} />}</span>
                    <span>I confirm that the information provided above is accurate.</span>
                  </label>
                  {submitError && <small className="error confirm-error">{submitError}</small>}
                </>
              )}
            </div>

            <div className="form-actions">
              {step > 0 ? (
                <button className="button back-button" onClick={goBack} disabled={isSubmitting}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <button className="button back-button" onClick={() => { setStarted(false); window.location.hash = 'home' }}>
                  <ArrowLeft size={16} /> Exit
                </button>
              )}

              {step < 4 ? (
                <button className="button primary" onClick={goNext}>
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button className="button primary submit-button" onClick={submit} disabled={isSubmitting} aria-live="polite">
                  {isSubmitting ? 'Submitting…' : 'Submit Application'} {!isSubmitting && <ArrowRight size={16} />}
                </button>
              )}
            </div>
          </section>

          <p className="privacy-foot">
            <span><CheckCircle2 size={14} /></span> Your information is only used for GDG Campus recruitment.
          </p>
        </main>
      )}

      <Footer
        onOpenPortal={() => router.push('/portal')}
        onStartApply={() => {
          setStarted(true)
          window.location.hash = 'apply'
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </div>
  )
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <section className="review-section">
      <div className="review-header">
        <h3>{title}</h3>
        <button onClick={onEdit}>Edit <ArrowRight size={13} /></button>
      </div>
      <div className="review-items">{children}</div>
    </section>
  )
}

function ReviewItem({ label, value }) {
  return (
    <div className="review-item">
      <span>{label}</span>
      <b>{value || '—'}</b>
    </div>
  )
}
