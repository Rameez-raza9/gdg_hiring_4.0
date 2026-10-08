import React, { useState, useEffect, useMemo } from 'react'
import {
  Search, Check, CheckCircle2, Star, User, Phone, Mail,
  CalendarCheck, Award, LogOut, ArrowLeft, ArrowRight,
  ChevronLeft, ChevronRight, AlertTriangle, RefreshCw
} from 'lucide-react'
import { fetchApplications, submitInterviewReview } from '../services/adminService'
import { getCurrentUser, login, logout, isSuperAdmin, PRESET_USERS } from '../services/authService'
import AttendanceStation from './AttendanceStation'
import ShortlistStation from './ShortlistStation'
import MailStation from './MailStation'

export default function AdminPortal({ onBackToForm }) {
  const [sessionUser, setSessionUser] = useState(() => getCurrentUser())
  const superAdmin = isSuperAdmin(sessionUser)

  // Login states for unauthenticated view
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Tabs for Super Admin: 'evaluation', 'attendance', 'shortlist', 'mail'
  const [activeTab, setActiveTab] = useState('evaluation')

  const [candidates, setCandidates] = useState([])
  const [stats, setStats] = useState({ total: 0, reviewed: 0, pending: 0, tech: 0, nonTech: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState(() => sessionUser?.domain || 'All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  // Review form state
  const [reviewerName, setReviewerName] = useState(() => sessionUser?.name || 'Reviewer')
  const [attendance, setAttendance] = useState('Attended')
  const [techRating, setTechRating] = useState(4)
  const [commRating, setCommRating] = useState(4)
  const [passionRating, setPassionRating] = useState(4)
  const [decision, setDecision] = useState('Selected')
  const [feedback, setFeedback] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchApplications()
      setCandidates(data.candidates)
      setStats(data.stats)
      if (data.candidates.length > 0 && !selectedCandidate) {
        setSelectedCandidate(data.candidates[0])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sessionUser) {
      loadData()
    }
  }, [sessionUser])

  useEffect(() => {
    if (selectedCandidate) {
      if (selectedCandidate.review) {
        const rev = selectedCandidate.review
        setAttendance(rev.attendance || 'Attended')
        setTechRating(Number(rev.techRating) || 4)
        setCommRating(Number(rev.commRating) || 4)
        setPassionRating(Number(rev.passionRating) || 4)
        setDecision(rev.decision || 'Selected')
        setFeedback(rev.feedback || '')
        if (rev.reviewerName) setReviewerName(rev.reviewerName)
      } else {
        setAttendance('Attended')
        setTechRating(4)
        setCommRating(4)
        setPassionRating(4)
        setDecision('Selected')
        setFeedback('')
        if (sessionUser?.name) setReviewerName(sessionUser.name)
      }
    }
  }, [selectedCandidate, sessionUser])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handlePerformLogin = (e) => {
    e?.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    const result = login(loginUsername, loginPassword)
    setLoginLoading(false)
    if (result.ok) {
      setSessionUser(result.user)
      if (result.user.domain && result.user.domain !== 'All') {
        setDomainFilter(result.user.domain)
      }
    } else {
      setLoginError(result.error)
    }
  }

  const handleLogout = () => {
    logout()
    setSessionUser(null)
  }

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch = !q ||
        candidate.name.toLowerCase().includes(q) ||
        candidate.rollNumber.toLowerCase().includes(q) ||
        candidate.wing.toLowerCase().includes(q) ||
        (candidate.branch && candidate.branch.toLowerCase().includes(q))

      const matchesDomain = domainFilter === 'All' || candidate.domain === domainFilter
      const matchesStatus = statusFilter === 'All' ||
        (statusFilter === 'Reviewed' && candidate.isReviewed) ||
        (statusFilter === 'Pending' && !candidate.isReviewed)

      return matchesSearch && matchesDomain && matchesStatus
    })
  }, [candidates, searchQuery, domainFilter, statusFilter])

  const currentIndex = useMemo(() => {
    if (!selectedCandidate) return -1
    return filteredCandidates.findIndex(c => c.applicationId === selectedCandidate.applicationId)
  }, [filteredCandidates, selectedCandidate])

  const handlePrev = () => {
    if (currentIndex > 0) setSelectedCandidate(filteredCandidates[currentIndex - 1])
  }

  const handleNext = () => {
    if (currentIndex < filteredCandidates.length - 1) setSelectedCandidate(filteredCandidates[currentIndex + 1])
  }

  const handleSaveReview = async (e) => {
    e.preventDefault()
    if (!selectedCandidate) return
    setSaving(true)

    const reviewPayload = {
      applicationId: selectedCandidate.applicationId,
      name: selectedCandidate.name,
      rollNumber: selectedCandidate.rollNumber,
      year: selectedCandidate.year,
      branch: selectedCandidate.branch,
      section: selectedCandidate.section,
      domain: selectedCandidate.domain,
      wing: selectedCandidate.wing,
      email: selectedCandidate.email,
      phone: selectedCandidate.phone,
      reviewerName,
      attendance,
      decision,
      techRating,
      commRating,
      passionRating,
      feedback,
      reviewedAt: new Date().toISOString()
    }

    try {
      await submitInterviewReview(reviewPayload, selectedCandidate)
      setCandidates(prev => prev.map(c => {
        if (c.applicationId === selectedCandidate.applicationId) {
          return { ...c, isReviewed: true, review: reviewPayload }
        }
        return c
      }))
      setSelectedCandidate(prev => ({ ...prev, isReviewed: true, review: reviewPayload }))
      setStats(prev => ({
        ...prev,
        reviewed: prev.reviewed + (selectedCandidate.isReviewed ? 0 : 1),
        pending: Math.max(0, prev.pending - (selectedCandidate.isReviewed ? 0 : 1))
      }))
      showToast(`Review for ${selectedCandidate.name} saved! Email confirmation sent.`)

      if (currentIndex < filteredCandidates.length - 1) {
        setTimeout(() => setSelectedCandidate(filteredCandidates[currentIndex + 1]), 600)
      }
    } catch {
      showToast('Review saved locally.', 'warning')
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // UNLOGGED-IN: SIMPLE CLEAN LOGIN
  // ==========================================
  if (!sessionUser) {
    return (
      <div className="clean-portal-login-screen">
        <div className="clean-login-box">
          <div className="login-box-header">
            <h2 className="login-heading">Portal Login</h2>
            <p className="login-subheading">Sign in with your recruitment panel credentials.</p>
          </div>

          {/* Quick preset selector buttons */}
          <div className="clean-role-chips">
            {PRESET_USERS.map(u => (
              <button
                key={u.id}
                type="button"
                className={`clean-role-chip ${loginUsername === u.username ? 'active' : ''}`}
                onClick={() => { setLoginUsername(u.username); setLoginPassword(u.password); setLoginError('') }}
              >
                <span>{u.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handlePerformLogin} className="clean-login-form">
            {loginError && (
              <div className="clean-error-banner">
                <AlertTriangle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="clean-input"
                placeholder="Username"
                value={loginUsername}
                onChange={e => { setLoginUsername(e.target.value); setLoginError('') }}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="clean-input"
                placeholder="Password"
                value={loginPassword}
                onChange={e => { setLoginPassword(e.target.value); setLoginError('') }}
                required
              />
            </div>

            <div className="login-form-actions">
              <button type="button" className="button secondary clean-btn" onClick={onBackToForm}>
                Back to Site
              </button>
              <button type="submit" className="button primary clean-btn" disabled={loginLoading || !loginUsername || !loginPassword}>
                {loginLoading ? 'Entering...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ==========================================
  // LOGGED-IN: SIMPLE CLEAN PORTAL
  // ==========================================
  return (
    <div className="clean-admin-container">
      {/* Toast Alert */}
      {toast && (
        <div className={`clean-floating-toast ${toast.type}`}>
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Clean Top Navigation Bar */}
      <header className="clean-portal-header">
        <div className="header-user-info">
          <h2 className="portal-brand-title">Recruitment Portal</h2>
          <span className="user-role-badge">
            {superAdmin ? 'Super Admin' : `${sessionUser.domain} Reviewer`}
          </span>
        </div>

        {/* Navigation Tabs for Super Admin */}
        {superAdmin && (
          <nav className="clean-tab-navigation">
            <button
              className={`clean-tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`}
              onClick={() => setActiveTab('evaluation')}
            >
              Candidate Reviews
            </button>
            <button
              className={`clean-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </button>
            <button
              className={`clean-tab-btn ${activeTab === 'shortlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('shortlist')}
            >
              Shortlist
            </button>
            <button
              className={`clean-tab-btn ${activeTab === 'mail' ? 'active' : ''}`}
              onClick={() => setActiveTab('mail')}
            >
              Email Broadcast
            </button>
          </nav>
        )}

        <div className="header-actions">
          <button className="clean-ghost-btn" onClick={loadData} title="Sync data">
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
            <span>Sync</span>
          </button>
          <button className="clean-ghost-btn danger" onClick={handleLogout} title="Log out">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Attendance Tab */}
      {superAdmin && activeTab === 'attendance' && (
        <AttendanceStation candidates={candidates} onRefresh={loadData} />
      )}

      {/* Shortlist Tab */}
      {superAdmin && activeTab === 'shortlist' && (
        <ShortlistStation candidates={candidates} />
      )}

      {/* Email Broadcast Tab */}
      {superAdmin && activeTab === 'mail' && (
        <MailStation candidates={candidates} />
      )}

      {/* Candidate Evaluation Tab (Default & for Interviewers) */}
      {(!superAdmin || activeTab === 'evaluation') && (
        <div className="clean-evaluation-layout">
          {/* Left: Candidate List Directory */}
          <aside className="clean-candidate-directory">
            <div className="directory-search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="clean-search-input"
              />
            </div>

            <div className="directory-filters-row">
              <select
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value)}
                className="clean-mini-select"
              >
                <option value="All">All Domains</option>
                <option value="Tech">Tech</option>
                <option value="Non-Tech">Non-Tech</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="clean-mini-select"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
              </select>
            </div>

            <div className="candidate-rows-list">
              {filteredCandidates.length === 0 ? (
                <div className="empty-message">No candidates match criteria.</div>
              ) : (
                filteredCandidates.map(c => {
                  const isSelected = selectedCandidate?.applicationId === c.applicationId
                  return (
                    <div
                      key={c.applicationId}
                      className={`clean-candidate-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <div className="row-left">
                        <span className="row-name">{c.name}</span>
                        <span className="row-sub">{c.rollNumber} · {c.branch}-{c.section}</span>
                      </div>
                      <div className="row-right">
                        <span className="wing-tag">{c.wing}</span>
                        {c.isReviewed && (
                          <span className="reviewed-badge">Reviewed</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </aside>

          {/* Right: Candidate Evaluation & Scoring */}
          <main className="clean-candidate-stage">
            {selectedCandidate ? (
              <div className="candidate-dossier-grid">
                {/* Dossier Card */}
                <div className="clean-dossier-card">
                  <div className="dossier-top-bar">
                    <div>
                      <h3 className="candidate-display-name">{selectedCandidate.name}</h3>
                      <p className="candidate-display-meta">
                        {selectedCandidate.rollNumber} · {selectedCandidate.branch} (Sec {selectedCandidate.section}) · {selectedCandidate.year}
                      </p>
                    </div>

                    <div className="nav-controls">
                      <button className="nav-btn" onClick={handlePrev} disabled={currentIndex <= 0} title="Previous">
                        <ChevronLeft size={16} />
                      </button>
                      <span className="nav-text">{currentIndex + 1} / {filteredCandidates.length}</span>
                      <button className="nav-btn" onClick={handleNext} disabled={currentIndex >= filteredCandidates.length - 1} title="Next">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="candidate-contact-tags">
                    <span className="contact-tag"><Mail size={13} /> {selectedCandidate.email}</span>
                    <span className="contact-tag"><Phone size={13} /> {selectedCandidate.phone}</span>
                    <span className="contact-tag wing">{selectedCandidate.wing} ({selectedCandidate.domain})</span>
                  </div>

                  <div className="answers-section">
                    <div className="answer-block">
                      <h4>Why GDGoC SVEC?</h4>
                      <p>{selectedCandidate.whyGDG || 'No response provided.'}</p>
                    </div>

                    <div className="answer-block">
                      <h4>Why {selectedCandidate.wing}?</h4>
                      <p>{selectedCandidate.whyWing || 'No response provided.'}</p>
                    </div>

                    {selectedCandidate.projectDescription && (
                      <div className="answer-block highlight">
                        <h4>Projects & Experience</h4>
                        <p>{selectedCandidate.projectDescription}</p>
                      </div>
                    )}

                    {selectedCandidate.wingSpecific && selectedCandidate.wingSpecific.length > 0 && (
                      <div className="answer-block">
                        <h4>Skills & Frameworks</h4>
                        <div className="skills-cloud">
                          {selectedCandidate.wingSpecific.map((skill, i) => (
                            <span key={i} className="skill-pill">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Evaluation Form Card */}
                <div className="clean-evaluation-form-card">
                  <h3 className="form-card-title">Interview Evaluation</h3>

                  <form onSubmit={handleSaveReview} className="clean-review-form">
                    <div className="form-group">
                      <label>Reviewer Name</label>
                      <input
                        type="text"
                        className="clean-input"
                        value={reviewerName}
                        onChange={e => setReviewerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Attendance Status</label>
                      <div className="chip-selector">
                        {['Attended', 'Absent', 'Rescheduled'].map(status => (
                          <button
                            key={status}
                            type="button"
                            className={`choice-btn ${attendance === status ? 'active' : ''}`}
                            onClick={() => setAttendance(status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="ratings-block">
                      <div className="rating-row">
                        <span className="rating-title">Technical Knowledge</span>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              className={`star-icon-btn ${techRating >= star ? 'filled' : ''}`}
                              onClick={() => setTechRating(star)}
                            >
                              <Star size={16} />
                            </button>
                          ))}
                          <span className="score-label">{techRating}/5</span>
                        </div>
                      </div>

                      <div className="rating-row">
                        <span className="rating-title">Communication & Clarity</span>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              className={`star-icon-btn ${commRating >= star ? 'filled' : ''}`}
                              onClick={() => setCommRating(star)}
                            >
                              <Star size={16} />
                            </button>
                          ))}
                          <span className="score-label">{commRating}/5</span>
                        </div>
                      </div>

                      <div className="rating-row">
                        <span className="rating-title">Passion & Community Fit</span>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              className={`star-icon-btn ${passionRating >= star ? 'filled' : ''}`}
                              onClick={() => setPassionRating(star)}
                            >
                              <Star size={16} />
                            </button>
                          ))}
                          <span className="score-label">{passionRating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Recommendation</label>
                      <div className="chip-selector">
                        {['Selected', 'Shortlisted', 'Under Review', 'Reject'].map(dec => (
                          <button
                            key={dec}
                            type="button"
                            className={`choice-btn ${decision === dec ? 'active' : ''}`}
                            onClick={() => setDecision(dec)}
                          >
                            {dec}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Feedback & Evaluation Notes</label>
                      <textarea
                        className="clean-textarea"
                        rows={4}
                        placeholder="Candidate strengths, topics discussed, notes..."
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="button primary full-width-btn" disabled={saving}>
                      <Check size={16} />
                      <span>{saving ? 'Saving...' : 'Save Evaluation'}</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="no-selection-placeholder">
                <User size={36} />
                <p>Select a candidate from the directory to review their application.</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  )
}
