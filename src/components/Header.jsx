import React from 'react'

export default function Header() {
  return <header className="site-header">
    <div className="header-inner">
      <a className="brand" href="#home" aria-label="Google Developer Groups On Campus, Sri Vasavi Engineering College home">
        <img className="official-gdg-logo" src="/assets/gdgoc-svec-logo.png" alt="Google Developer Groups On Campus | Sri Vasavi Engineering College" />
      </a>
      <span className="header-label">GDG Hiring</span>
    </div>
  </header>
}
