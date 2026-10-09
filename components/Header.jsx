"use client";

import React, { useState, useEffect } from 'react'
import {
  ArrowLeft, LogOut, ArrowUpRight, Flame, Lock, UserCheck
} from 'lucide-react'
import { getCurrentUser, logout } from '../services/authService'
import { GDG_COMMUNITY_LINKS } from '../services/mailService'
import { ThemeToggle } from './ThemeToggle'

export default function Header({
  isPortal,
  onTogglePortal,
  onStartApply
}) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    window.location.hash = 'home'
    window.location.reload()
  }

  return (
    <header className="floating-bubble-header-container">
      <nav className="minimalist-bubble-navbar" aria-label="Main Navigation">
        {/* Brand with Official Logo */}
        <a
          href={isPortal ? "#portal" : "#home"}
          className="bubble-brand-link"
          aria-label="Google Developer Groups On Campus SVEC"
          onClick={(e) => {
            if (isPortal) {
              e.preventDefault()
              onTogglePortal()
            }
          }}
        >
          <img
            src="/assets/gdgoc-svec-logo.png"
            alt="GDGoC SVEC"
            className="bubble-logo-img"
          />
        </a>

        {/* Center Navigation Links (When on Applicant/Landing Page) */}
        {!isPortal && (
          <div className="bubble-nav-links">
            <a href="#home" className="bubble-link active">Home</a>
            <a href="#tracks" className="bubble-link">Tracks</a>
            <a
              href={GDG_COMMUNITY_LINKS.WHATSAPP_GROUP}
              target="_blank"
              rel="noopener noreferrer"
              className="bubble-link community-link"
            >
              <span>Community</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        )}

        {/* Right Actions */}
        <div className="bubble-actions">
          {/* Apply button on homepage */}
          {!isPortal && onStartApply && (
            <button
              type="button"
              className="bubble-apply-btn"
              onClick={onStartApply}
            >
              <Flame size={14} className="flame-icon text-amber-400" />
              <span>Apply Now</span>
            </button>
          )}

          {/* User Session or Portal Login */}
          {currentUser && isPortal ? (
            <div className="bubble-user-badge">
              <span className="user-avatar-tag">{currentUser.avatar || '👤'}</span>
              <span className="user-role-label">
                {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.name}
              </span>
              <button
                type="button"
                className="bubble-logout-btn"
                onClick={handleLogout}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : null}

          {/* Single Unified Portal / Home Button */}
          <button
            type="button"
            className={`bubble-portal-toggle ${isPortal ? 'active' : ''}`}
            onClick={onTogglePortal}
            title={isPortal ? "Return to Homepage" : "Portal Login"}
          >
            {isPortal ? (
              <>
                <ArrowLeft size={13} />
                <span>Home</span>
              </>
            ) : (
              <>
                <Lock size={13} />
                <span>Portal</span>
              </>
            )}
          </button>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
