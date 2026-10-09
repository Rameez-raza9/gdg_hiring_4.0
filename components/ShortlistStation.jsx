"use client";

import React, { useState, useEffect, useMemo } from 'react'
import {
  Award, CheckCircle2, Clock, XCircle, Search, Filter, Download,
  FileSpreadsheet, Star, Sparkles, UserCheck, ShieldCheck, ArrowUpDown
} from 'lucide-react'
import { fetchShortlistsFromTurso, saveShortlistToTurso } from '../services/tursoService'

export default function ShortlistStation({ candidates = [] }) {
  const [shortlistMap, setShortlistMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [domainFilter, setDomainFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('score_desc')

  // Load shortlists from Turso on mount
  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const data = await fetchShortlistsFromTurso()
      if (mounted) {
        setShortlistMap(data || {})
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Consolidate candidates
  const evaluatedCandidates = useMemo(() => {
    return candidates.map(c => {
      const review = c.review || {}
      const shortlistRecord = shortlistMap[c.applicationId] || {}

      const tech = Number(review.techRating) || 0
      const comm = Number(review.commRating) || 0
      const passion = Number(review.passionRating) || 0
      const avgScore = review.decision ? ((tech + comm + passion) / 3).toFixed(1) : '—'

      // Final decision: Super admin decision overrides interviewer decision
      const finalDecision = shortlistRecord.superadminDecision || review.decision || 'Pending Review'

      return {
        ...c,
        techScore: tech,
        commScore: comm,
        passionScore: passion,
        avgScore: avgScore,
        rawScore: review.decision ? (tech + comm + passion) / 3 : 0,
        interviewerDecision: review.decision || 'Not Interviewed',
        superadminDecision: finalDecision,
        reviewerName: review.reviewerName || 'Panel',
        reviewNotes: review.feedback || '',
        adminNotes: shortlistRecord.notes || '',
        updatedAt: shortlistRecord.updatedAt || review.reviewedAt || ''
      }
    })
  }, [candidates, shortlistMap])

  // Filter & sort
  const filteredList = useMemo(() => {
    return evaluatedCandidates
      .filter(c => {
        if (selectedFilter === 'SHORTLISTED') {
          return c.superadminDecision === 'Shortlisted' || c.superadminDecision === 'Selected'
        }
        if (selectedFilter === 'SELECTED') {
          return c.superadminDecision === 'Selected'
        }
        if (selectedFilter === 'PENDING') {
          return c.superadminDecision === 'Pending Review' || !c.isReviewed
        }
        if (domainFilter !== 'ALL' && c.domain !== domainFilter) return false

        if (search) {
          const q = search.toLowerCase()
          return (
            c.name.toLowerCase().includes(q) ||
            c.rollNumber.toLowerCase().includes(q) ||
            c.wing.toLowerCase().includes(q) ||
            c.branch.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') return b.rawScore - a.rawScore
        if (sortBy === 'score_asc') return a.rawScore - b.rawScore
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return 0
      })
  }, [evaluatedCandidates, selectedFilter, domainFilter, search, sortBy])

  // Quick stats
  const stats = useMemo(() => {
    const total = evaluatedCandidates.length
    const selected = evaluatedCandidates.filter(c => c.superadminDecision === 'Selected').length
    const shortlisted = evaluatedCandidates.filter(c => c.superadminDecision === 'Shortlisted').length
    const evaluatedCount = evaluatedCandidates.filter(c => c.isReviewed).length
    return { total, selected, shortlisted, evaluatedCount }
  }, [evaluatedCandidates])

  // Toggle Super Admin hiring decision
  const handleDecisionChange = async (candidate, newDecision) => {
    const record = {
      applicationId: candidate.applicationId,
      rollNumber: candidate.rollNumber,
      name: candidate.name,
      domain: candidate.domain,
      wing: candidate.wing,
      status: newDecision,
      superadminDecision: newDecision,
      notes: candidate.adminNotes,
      updatedAt: new Date().toISOString()
    }

    setShortlistMap(prev => ({
      ...prev,
      [candidate.applicationId]: record
    }))

    await saveShortlistToTurso(record)
  }

  // Export Shortlist CSV
  const exportShortlistCSV = () => {
    const headers = ['Roll Number', 'Candidate Name', 'Branch', 'Section', 'Domain', 'Wing', 'Average Score', 'Interviewer Rec', 'Super Admin Decision', 'Review Notes']
    const rows = filteredList.map(c => [
      `"${c.rollNumber}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.branch}"`,
      `"${c.section}"`,
      `"${c.domain}"`,
      `"${c.wing}"`,
      `"${c.avgScore}"`,
      `"${c.interviewerDecision}"`,
      `"${c.superadminDecision}"`,
      `"${(c.reviewNotes || '').replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `GDGoC_SVEC_Shortlist_Candidates_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="shortlist-station-panel">
      {/* Top Banner & Metrics */}
      <div className="station-metrics-strip">
        <div className="metric-capsule">
          <span className="metric-label">Total Pool</span>
          <span className="metric-val">{stats.total}</span>
        </div>
        <div className="metric-capsule green">
          <span className="metric-label">Hired / Selected</span>
          <span className="metric-val text-emerald-400">{stats.selected}</span>
        </div>
        <div className="metric-capsule blue">
          <span className="metric-label">Shortlisted</span>
          <span className="metric-val text-blue-400">{stats.shortlisted}</span>
        </div>
        <div className="metric-capsule amber">
          <span className="metric-label">Evaluated by Panels</span>
          <span className="metric-val text-amber-400">{stats.evaluatedCount}</span>
        </div>
      </div>

      {/* Control Bar: Filters & Export */}
      <div className="station-controls-bar brutal-panel">
        <div className="controls-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input brutal-input"
            placeholder="Search candidate name, roll number, wing…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="controls-filters-group">
          {/* Status Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-tag">Filter:</span>
            <select
              className="brutal-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="ALL">All Candidates</option>
              <option value="SHORTLISTED">Shortlisted & Selected</option>
              <option value="SELECTED">Selected Only (Hired)</option>
              <option value="PENDING">Pending Evaluation</option>
            </select>
          </div>

          {/* Domain Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-tag">Domain:</span>
            <select
              className="brutal-select"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="ALL">All Domains</option>
              <option value="Tech">Tech Domain</option>
              <option value="Non-Tech">Non-Tech Domain</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-select-wrapper">
            <span className="filter-tag">Sort:</span>
            <select
              className="brutal-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="score_desc">Rating (High to Low)</option>
              <option value="score_asc">Rating (Low to High)</option>
              <option value="name">Candidate Name</option>
            </select>
          </div>
        </div>

        {/* Export CSV Button */}
        <div className="controls-export-actions">
          <button
            className="button brutal-export-btn csv-btn"
            onClick={exportShortlistCSV}
            title="Download Shortlist & Decision CSV"
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Candidate Decision Grid / Table */}
      <div className="station-table-container brutal-panel">
        <table className="station-table">
          <thead>
            <tr>
              <th className="th-roll">Roll No</th>
              <th className="th-name">Candidate</th>
              <th className="th-wing">Domain & Wing</th>
              <th className="th-rating">Score (Avg)</th>
              <th className="th-rec">Panel Rec</th>
              <th className="th-decision">Super Admin Hiring Decision</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-cell">
                  No candidates match the shortlist filters.
                </td>
              </tr>
            ) : (
              filteredList.map((c) => {
                const isSelected = c.superadminDecision === 'Selected'
                const isShortlisted = c.superadminDecision === 'Shortlisted'
                return (
                  <tr key={c.applicationId} className={`station-row ${isSelected ? 'hired-row' : ''}`}>
                    <td className="td-roll">
                      <span className="roll-badge">{c.rollNumber}</span>
                    </td>
                    <td className="td-name">
                      <div className="name-block">
                        <strong>{c.name}</strong>
                        <small>{c.branch} - Sec {c.section} ({c.year})</small>
                      </div>
                    </td>
                    <td className="td-wing">
                      <div className="wing-stack">
                        <span className="wing-pill">{c.wing}</span>
                        <small className="domain-label">{c.domain}</small>
                      </div>
                    </td>
                    <td className="td-rating">
                      <div className="rating-pill-box">
                        <Star size={13} className="star-icon" />
                        <span className="score-val">{c.avgScore}</span>
                        {c.isReviewed && (
                          <span className="score-sub">/5.0</span>
                        )}
                      </div>
                    </td>
                    <td className="td-rec">
                      <span className={`panel-rec-badge ${c.interviewerDecision.toLowerCase()}`}>
                        {c.interviewerDecision}
                      </span>
                    </td>
                    <td className="td-decision">
                      <div className="decision-toggle-group">
                        <button
                          type="button"
                          className={`decision-btn select-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => handleDecisionChange(c, isSelected ? 'Under Review' : 'Selected')}
                          title="Confirm Hiring Selection"
                        >
                          <CheckCircle2 size={13} />
                          <span>{isSelected ? 'Selected (Hired)' : 'Select'}</span>
                        </button>
                        <button
                          type="button"
                          className={`decision-btn shortlist-btn ${isShortlisted ? 'active' : ''}`}
                          onClick={() => handleDecisionChange(c, isShortlisted ? 'Under Review' : 'Shortlisted')}
                          title="Place on Shortlist"
                        >
                          <Award size={13} />
                          <span>Shortlist</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
