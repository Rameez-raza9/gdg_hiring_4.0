"use client";

import React, { useState, useEffect } from 'react'
import {
  Mail, Send, CheckCircle2, Clock, RefreshCw
} from 'lucide-react'
import { getMailLogs, sendEmail, GDG_COMMUNITY_LINKS } from '../services/mailService'

const TEMPLATES = [
  {
    id: 'whatsapp_cloud',
    name: 'WhatsApp Community & Google Cloud Voucher',
    subject: 'Welcome to GDGoC SVEC 4.0 — WhatsApp Group & Cloud Access Code',
    defaultBody: `Hi {name},

Thank you for applying to Google Developer Groups On Campus (GDGoC) SVEC for the {wing} wing!

Next Steps:
1. Join our Official Recruitment WhatsApp Community:
${GDG_COMMUNITY_LINKS.WHATSAPP_GROUP}

2. Google Cloud Skills Boost:
Explore Google Cloud skill badges and certifications:
${GDG_COMMUNITY_LINKS.GOOGLE_CLOUD_STUDY}
Access Code: ${GDG_COMMUNITY_LINKS.GOOGLE_CLOUD_VOUCHER}

Complete this to build cloud skills and stay connected with the Google Developer ecosystem.

Best regards,
GDGoC SVEC 4.0 Core Team`
  },
  {
    id: 'interview_thank_you',
    name: 'Post-Interview Thank You',
    subject: 'Thank You for Interviewing With GDGoC SVEC 4.0!',
    defaultBody: `Hi {name},

Thank you for attending your interview with GDGoC SVEC 4.0 for the {wing} wing!

Our panel enjoyed learning about your perspective and technical enthusiasm.

The Core Team is reviewing evaluations. Shortlist and final announcements will follow soon on WhatsApp:
${GDG_COMMUNITY_LINKS.WHATSAPP_GROUP}

Warm regards,
GDGoC SVEC 4.0 Recruitment Panel`
  },
  {
    id: 'selection_offer',
    name: 'Selection & Offer Letter',
    subject: 'Congratulations! You are Selected for GDGoC SVEC 4.0!',
    defaultBody: `Dear {name},

Congratulations! We are thrilled to welcome you to Google Developer Groups On Campus SVEC 4.0 as a member of the {wing} wing!

Orientation and onboarding details will follow on our community group.

Welcome aboard!

Warm regards,
GDGoC SVEC 4.0 Lead & Organizer Team`
  },
  {
    id: 'custom',
    name: 'Custom Broadcast',
    subject: 'Announcement from GDGoC SVEC 4.0',
    defaultBody: `Hi {name},

[Enter your message here]

Best regards,
GDGoC SVEC Core Team`
  }
]

export default function MailStation({ candidates = [] }) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id)
  const [subject, setSubject] = useState(TEMPLATES[0].subject)
  const [body, setBody] = useState(TEMPLATES[0].defaultBody)
  const [recipientFilter, setRecipientFilter] = useState('ALL')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    setLogs(getMailLogs())
  }, [])

  const handleSelectTemplate = (tplId) => {
    setSelectedTemplate(tplId)
    const tpl = TEMPLATES.find(t => t.id === tplId)
    if (tpl) {
      setSubject(tpl.subject)
      setBody(tpl.defaultBody)
    }
  }

  const targetRecipients = candidates.filter(c => {
    if (!c.email) return false
    if (recipientFilter === 'ALL') return true
    if (recipientFilter === 'SELECTED') return c.superadminDecision === 'Selected' || c.review?.decision === 'Selected'
    if (recipientFilter === 'SHORTLISTED') return c.superadminDecision === 'Shortlisted' || c.review?.decision === 'Shortlisted'
    if (recipientFilter === 'ATTENDED') return c.review?.attendance === 'Attended'
    return true
  })

  const handleSendBatch = async () => {
    if (targetRecipients.length === 0) return
    setSending(true)
    setSendResult(null)

    let successCount = 0
    let failureCount = 0

    for (const cand of targetRecipients) {
      const interpolatedBody = body
        .replace(/\{name\}/g, cand.name || 'Applicant')
        .replace(/\{wing\}/g, cand.wing || 'Team')
        .replace(/\{domain\}/g, cand.domain || 'Tech')
        .replace(/\{roll\}/g, cand.rollNumber || '')

      const interpolatedSubject = subject
        .replace(/\{name\}/g, cand.name || 'Applicant')
        .replace(/\{wing\}/g, cand.wing || 'Team')

      const res = await sendEmail({
        to: cand.email,
        toName: cand.name,
        subject: interpolatedSubject,
        textContent: interpolatedBody,
        templateType: selectedTemplate
      })

      if (res.ok) successCount++
      else failureCount++
    }

    setSending(false)
    setSendResult({ successCount, failureCount, total: targetRecipients.length })
    setLogs(getMailLogs())
  }

  return (
    <div className="clean-mail-station">
      <div className="mail-composer-card">
        <div className="composer-header">
          <h3 className="section-title">Email Dispatch Center</h3>
          <p className="section-desc">Broadcast updates, orientation invites, and decision letters to applicants.</p>
        </div>

        {/* Template selector chips */}
        <div className="form-row">
          <label className="clean-label">Select Template:</label>
          <div className="clean-pill-selector">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                type="button"
                className={`clean-pill-btn ${selectedTemplate === t.id ? 'active' : ''}`}
                onClick={() => handleSelectTemplate(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="form-row">
          <label className="clean-label">Target Audience:</label>
          <select
            className="clean-select"
            value={recipientFilter}
            onChange={(e) => setRecipientFilter(e.target.value)}
          >
            <option value="ALL">All Applicants ({candidates.length})</option>
            <option value="SELECTED">Selected / Hired Candidates</option>
            <option value="SHORTLISTED">Shortlisted Candidates</option>
            <option value="ATTENDED">Attended Candidates</option>
          </select>
          <span className="audience-hint">Will dispatch to {targetRecipients.length} recipients.</span>
        </div>

        {/* Subject */}
        <div className="form-row">
          <label className="clean-label">Email Subject:</label>
          <input
            type="text"
            className="clean-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="form-row">
          <label className="clean-label">Email Body:</label>
          <textarea
            className="clean-textarea"
            rows={9}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="button primary clean-send-btn"
          disabled={sending || targetRecipients.length === 0}
          onClick={handleSendBatch}
        >
          <Send size={15} />
          <span>{sending ? 'Dispatching...' : `Dispatch to ${targetRecipients.length} Candidates`}</span>
        </button>

        {sendResult && (
          <div className="clean-success-alert">
            <CheckCircle2 size={16} />
            <span>Dispatched to {sendResult.successCount} of {sendResult.total} candidates successfully.</span>
          </div>
        )}
      </div>

      {/* Delivery Logs */}
      <div className="mail-logs-card">
        <div className="logs-header">
          <h4 className="logs-title">Delivery Activity</h4>
          <button className="icon-btn" onClick={() => setLogs(getMailLogs())} title="Refresh">
            <RefreshCw size={13} />
          </button>
        </div>

        <div className="logs-list">
          {logs.length === 0 ? (
            <p className="no-logs">No emails logged yet.</p>
          ) : (
            logs.slice(0, 10).map((log) => (
              <div key={log.id} className="log-item">
                <div className="log-top">
                  <span className="log-to">{log.recipientName}</span>
                  <span className="log-time">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="log-sub">{log.subject}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
