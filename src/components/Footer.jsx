import React from 'react'
import { Linkedin, Instagram, ExternalLink, Sparkles, Heart, Shield } from 'lucide-react'
import { GDG_COMMUNITY_LINKS } from '../services/mailService'

export default function Footer({ onOpenPortal, onOpenAdmin, onStartApply }) {
  return (
    <footer className="refined-glass-footer brutal-footer">
      <div className="footer-glow-accent" aria-hidden="true" />
      <div className="footer-inner-container">
        {/* Top Section */}
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-column">
            <div className="footer-brand-badge">
              <img
                src="/assets/gdgoc-svec-logo.png"
                alt="GDGoC SVEC Logo"
                className="footer-logo-img"
              />
            </div>
            <p className="footer-tagline">
              Empowering students to build, innovate, and lead. Together with the Google Developers ecosystem.
            </p>
            <div className="footer-location-chip">
              <span>📍 Sri Vasavi Engineering College · Tadepalligudem</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Recruitment Tracks</h4>
            <ul className="footer-link-list">
              <li><span>Web & Mobile Development</span></li>
              <li><span>Machine Learning & AI</span></li>
              <li><span>Cloud & DevOps Architecture</span></li>
              <li><span>UI/UX Design & Creative Media</span></li>
              <li><span>PR, Outreach & Event Operations</span></li>
            </ul>
          </div>

          {/* Community & Portals */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Community & Access</h4>
            <ul className="footer-link-list">
              <li>
                <a href={GDG_COMMUNITY_LINKS.WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer">
                  <span>WhatsApp Community</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href={GDG_COMMUNITY_LINKS.GOOGLE_CLOUD_STUDY} target="_blank" rel="noopener noreferrer">
                  <span>Google Cloud Boost</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <button type="button" className="footer-link-button" onClick={onOpenPortal || onOpenAdmin}>
                  <span>Recruitment Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Connect With Us</h4>
            <div className="footer-social-chips">
              <a
                href="https://www.linkedin.com/company/gdgoc-svec/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/gdgoc.svec?stkn=ZXEwd2FxajB3c2p0"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
              >
                <Instagram size={15} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copy">
            <span>© 2026 Google Developer Groups on Campus · Sri Vasavi Engineering College. All rights reserved.</span>
          </div>
          <div className="footer-signature">
            <span>Built with <Heart size={12} className="heart-icon inline-icon" /> by GDGoC SVEC Tech Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
