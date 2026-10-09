"use client";

import React, { useState, useEffect, useMemo } from 'react'
import {
  CheckCircle2, XCircle, Clock, Search, Filter, Download,
  FileSpreadsheet, FileText, RefreshCw, UserCheck, Check,
  ChevronDown, ArrowUpDown, Sparkles
} from 'lucide-react'
import { fetchAttendanceFromTurso, saveAttendanceToTurso } from '../services/tursoService'
import jsPDF from 'jspdf'

const STATUSES = [
  { id: 'Attended', label: 'Attended', color: 'emerald', icon: CheckCircle2 },
  { id: 'Absent', label: 'Absent', color: 'rose', icon: XCircle },
  { id: 'Rescheduled', label: 'Rescheduled', color: 'amber', icon: Clock },
  { id: 'Pending', label: 'Pending', color: 'slate', icon: Clock }
]

export default function AttendanceStation({ candidates = [], onRefresh }) {
  const [attendanceMap, setAttendanceMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('ALL')
  const [selectedSection, setSelectedSection] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [savingRoll, setSavingRoll] = useState(null)

  // Load attendance map on mount
  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const data = await fetchAttendanceFromTurso()
      if (mounted) {
        setAttendanceMap(data || {})
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Consolidate candidate list with attendance records
  const studentList = useMemo(() => {
    return candidates.map(c => {
      const record = attendanceMap[c.rollNumber] || {}
      return {
        rollNumber: c.rollNumber || '—',
        name: c.name || 'Unnamed Applicant',
        branch: (c.branch || 'CSE').trim().toUpperCase(),
        section: (c.section || 'A').trim().toUpperCase(),
        year: c.year || '2nd Year',
        domain: c.domain || 'Tech',
        wing: c.wing || 'General',
        email: c.email || '',
        phone: c.phone || '',
        status: record.status || (c.review?.attendance || 'Pending'),
        notes: record.notes || '',
        markedAt: record.markedAt || record.marked_at || ''
      }
    })
  }, [candidates, attendanceMap])

  // Extract unique branches and sections for filter pills
  const availableBranches = useMemo(() => {
    const set = new Set(studentList.map(s => s.branch).filter(Boolean))
    return ['ALL', ...Array.from(set).sort()]
  }, [studentList])

  const availableSections = useMemo(() => {
    const set = new Set(studentList.map(s => s.section).filter(Boolean))
    return ['ALL', ...Array.from(set).sort()]
  }, [studentList])

  // Filter and sort by Branch & Section (e.g. CSE-A, CSE-B, CST-A...)
  const filteredAndSortedList = useMemo(() => {
    return studentList
      .filter(s => {
        if (selectedBranch !== 'ALL' && s.branch !== selectedBranch) return false
        if (selectedSection !== 'ALL' && s.section !== selectedSection) return false
        if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            s.name.toLowerCase().includes(q) ||
            s.rollNumber.toLowerCase().includes(q) ||
            s.branch.toLowerCase().includes(q) ||
            s.phone.includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        // 1. Sort by Branch
        const branchComp = a.branch.localeCompare(b.branch)
        if (branchComp !== 0) return branchComp

        // 2. Sort by Section
        const secComp = a.section.localeCompare(b.section)
        if (secComp !== 0) return secComp

        // 3. Sort by Roll Number or Name
        return a.rollNumber.localeCompare(b.rollNumber)
      })
  }, [studentList, selectedBranch, selectedSection, selectedStatus, search])

  // Aggregate metrics
  const stats = useMemo(() => {
    const total = studentList.length
    const attended = studentList.filter(s => s.status === 'Attended').length
    const absent = studentList.filter(s => s.status === 'Absent').length
    const rescheduled = studentList.filter(s => s.status === 'Rescheduled').length
    const pending = total - attended - absent - rescheduled
    return { total, attended, absent, rescheduled, pending }
  }, [studentList])

  // Set attendance status for candidate
  const handleSetStatus = async (student, newStatus) => {
    setSavingRoll(student.rollNumber)
    const record = {
      rollNumber: student.rollNumber,
      name: student.name,
      branch: student.branch,
      section: student.section,
      year: student.year,
      status: newStatus,
      notes: student.notes,
      markedAt: new Date().toISOString()
    }

    setAttendanceMap(prev => ({
      ...prev,
      [student.rollNumber]: record
    }))

    await saveAttendanceToTurso(record)
    setSavingRoll(null)
  }

  // Export to CSV sorted by Branch & Section
  const exportToCSV = () => {
    const headers = ['Roll Number', 'Full Name', 'Branch', 'Section', 'Year', 'Wing', 'Status', 'Marked Timestamp', 'Notes']
    const rows = filteredAndSortedList.map(s => [
      `"${s.rollNumber}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.branch}"`,
      `"${s.section}"`,
      `"${s.year}"`,
      `"${s.wing}"`,
      `"${s.status}"`,
      `"${s.markedAt || 'N/A'}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `GDGoC_SVEC_Attendance_Branch_Section_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export to PDF sorted by Branch & Section using jsPDF
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Title & Branding
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(24, 24, 27)
    doc.text('Google Developer Groups On Campus · SVEC', 40, 48)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    doc.text('Sri Vasavi Engineering College — Recruitment 4.0 Official Attendance Roll', 40, 66)
    doc.text(`Generated: ${new Date().toLocaleString()} | Sorted: Branch & Section`, 40, 80)

    // Summary line
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(1)
    doc.line(40, 92, pageWidth - 40, 92)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(`Total: ${stats.total}  |  Attended: ${stats.attended}  |  Absent: ${stats.absent}  |  Rescheduled: ${stats.rescheduled}`, 40, 106)

    // Table Header
    let startY = 125
    doc.setFillColor(241, 245, 249)
    doc.rect(40, startY - 14, pageWidth - 80, 20, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(30, 41, 59)
    doc.text('ROLL NO', 45, startY)
    doc.text('NAME', 140, startY)
    doc.text('BRANCH', 270, startY)
    doc.text('SEC', 335, startY)
    doc.text('WING', 370, startY)
    doc.text('STATUS', 480, startY)

    startY += 18
    let rowCount = 0

    filteredAndSortedList.forEach((s) => {
      if (startY > pageHeight - 50) {
        doc.addPage()
        startY = 50
        // Repeat Header on new page
        doc.setFillColor(241, 245, 249)
        doc.rect(40, startY - 14, pageWidth - 80, 20, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8.5)
        doc.setTextColor(30, 41, 59)
        doc.text('ROLL NO', 45, startY)
        doc.text('NAME', 140, startY)
        doc.text('BRANCH', 270, startY)
        doc.text('SEC', 335, startY)
        doc.text('WING', 370, startY)
        doc.text('STATUS', 480, startY)
        startY += 18
      }

      // Alternate row backgrounds
      if (rowCount % 2 === 1) {
        doc.setFillColor(248, 250, 252)
        doc.rect(40, startY - 12, pageWidth - 80, 16, 'F')
      }

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(15, 23, 42)

      doc.text(String(s.rollNumber), 45, startY)
      doc.text(String(s.name).slice(0, 24), 140, startY)
      doc.text(String(s.branch), 270, startY)
      doc.text(String(s.section), 335, startY)
      doc.text(String(s.wing).slice(0, 20), 370, startY)

      // Colorize Status
      if (s.status === 'Attended') doc.setTextColor(22, 101, 52)
      else if (s.status === 'Absent') doc.setTextColor(153, 27, 27)
      else if (s.status === 'Rescheduled') doc.setTextColor(180, 83, 9)
      else doc.setTextColor(100, 116, 139)

      doc.setFont('helvetica', 'bold')
      doc.text(String(s.status), 480, startY)

      startY += 16
      rowCount++
    })

    doc.save(`GDGoC_SVEC_Attendance_RollSheet_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div className="attendance-station-panel">
      {/* Top Banner & Metrics */}
      <div className="station-metrics-strip">
        <div className="metric-capsule">
          <span className="metric-label">Total Applicants</span>
          <span className="metric-val">{stats.total}</span>
        </div>
        <div className="metric-capsule green">
          <span className="metric-label">Attended</span>
          <span className="metric-val text-emerald-400">{stats.attended}</span>
        </div>
        <div className="metric-capsule red">
          <span className="metric-label">Absent</span>
          <span className="metric-val text-rose-400">{stats.absent}</span>
        </div>
        <div className="metric-capsule amber">
          <span className="metric-label">Rescheduled</span>
          <span className="metric-val text-amber-400">{stats.rescheduled}</span>
        </div>
        <div className="metric-capsule slate">
          <span className="metric-label">Pending</span>
          <span className="metric-val text-slate-300">{stats.pending}</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Export */}
      <div className="station-controls-bar brutal-panel">
        <div className="controls-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input brutal-input"
            placeholder="Search by student name, roll number, or branch…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch('')}>×</button>
          )}
        </div>

        <div className="controls-filters-group">
          {/* Branch Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-tag">Branch:</span>
            <select
              className="brutal-select"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {availableBranches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-tag">Section:</span>
            <select
              className="brutal-select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {availableSections.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-tag">Status:</span>
            <select
              className="brutal-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Attended">Attended</option>
              <option value="Absent">Absent</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Action Buttons: CSV & PDF Export */}
        <div className="controls-export-actions">
          <button
            className="button brutal-export-btn csv-btn"
            onClick={exportToCSV}
            title="Download CSV sorted by Branch & Section"
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
          <button
            className="button brutal-export-btn pdf-btn"
            onClick={exportToPDF}
            title="Download PDF sorted by Branch & Section"
          >
            <FileText size={15} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Sorting Note Badge */}
      <div className="sorting-badge-bar">
        <ArrowUpDown size={13} />
        <span>Automatically grouped & sorted by <strong>Branch</strong> (CSE, CST, AIML…) & <strong>Section</strong> (A, B, C)</span>
        <span className="matching-count">({filteredAndSortedList.length} students matched)</span>
      </div>

      {/* Student Attendance Table */}
      <div className="station-table-container brutal-panel">
        <table className="station-table">
          <thead>
            <tr>
              <th className="th-roll">Roll Number</th>
              <th className="th-name">Student Name</th>
              <th className="th-class">Branch & Sec</th>
              <th className="th-wing">Wing</th>
              <th className="th-status">Attendance Status</th>
              <th className="th-actions">Quick Mark</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedList.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-cell">
                  No applicants match the current search or filters.
                </td>
              </tr>
            ) : (
              filteredAndSortedList.map((student) => {
                const isMarking = savingRoll === student.rollNumber
                return (
                  <tr key={student.rollNumber} className={`station-row ${student.status.toLowerCase()}`}>
                    <td className="td-roll">
                      <span className="roll-badge">{student.rollNumber}</span>
                    </td>
                    <td className="td-name">
                      <div className="name-block">
                        <strong>{student.name}</strong>
                        <small>{student.phone}</small>
                      </div>
                    </td>
                    <td className="td-class">
                      <span className="class-pill">
                        {student.branch} - {student.section}
                      </span>
                    </td>
                    <td className="td-wing">
                      <span className="wing-pill">{student.wing}</span>
                    </td>
                    <td className="td-status">
                      <span className={`status-badge-capsule ${student.status.toLowerCase()}`}>
                        {student.status === 'Attended' && <CheckCircle2 size={13} />}
                        {student.status === 'Absent' && <XCircle size={13} />}
                        {student.status === 'Rescheduled' && <Clock size={13} />}
                        <span>{student.status}</span>
                      </span>
                    </td>
                    <td className="td-actions">
                      <div className="quick-mark-btn-group">
                        <button
                          type="button"
                          className={`mark-pill attended ${student.status === 'Attended' ? 'active' : ''}`}
                          onClick={() => handleSetStatus(student, 'Attended')}
                          title="Mark Attended"
                          disabled={isMarking}
                        >
                          <Check size={12} /> Attended
                        </button>
                        <button
                          type="button"
                          className={`mark-pill absent ${student.status === 'Absent' ? 'active' : ''}`}
                          onClick={() => handleSetStatus(student, 'Absent')}
                          title="Mark Absent"
                          disabled={isMarking}
                        >
                          <XCircle size={12} /> Absent
                        </button>
                        <button
                          type="button"
                          className={`mark-pill rescheduled ${student.status === 'Rescheduled' ? 'active' : ''}`}
                          onClick={() => handleSetStatus(student, 'Rescheduled')}
                          title="Mark Rescheduled"
                          disabled={isMarking}
                        >
                          <Clock size={12} /> Reschedule
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
