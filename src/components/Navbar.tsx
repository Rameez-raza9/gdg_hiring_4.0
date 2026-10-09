"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Sticky backdrop-blur after 10px scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/80 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-xl"
          : "bg-white"
      }`}
    >
      <nav
        className="mx-auto flex h-[90px] max-w-[1040px] items-center justify-between px-6 lg:px-[100px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <a
          href="/"
          className="flex items-center gap-2"
          aria-label={`${SITE_NAME} home`}
        >
          <span
            className="font-mono text-xl font-semibold text-text-primary"
            aria-hidden="true"
          >
            &lt;&nbsp;/&gt;
          </span>
          <span className="text-[20px] font-semibold tracking-tight text-text-primary">
            {SITE_NAME}
          </span>
        </a>

        {/* ── Desktop links ── */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) =>
            link.hasDropdown ? (
              <div key={link.label} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-1 text-[14px] text-text-primary transition-colors hover:text-text-secondary"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && link.dropdownItems && (
                  <div className="absolute left-0 top-full mt-2 min-w-[160px] rounded-xl border border-border-default bg-white p-1.5 shadow-[var(--shadow-soft)]">
                    {link.dropdownItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-[14px] text-text-primary transition-colors hover:bg-bg-outer"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-[14px] text-text-primary transition-colors hover:text-text-secondary"
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        {/* ── Right side ── */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#join"
            className="rounded-lg border border-border-default bg-white px-4 py-2.5 text-[14px] font-medium text-text-primary shadow-[var(--shadow-soft)] transition-colors hover:bg-bg-outer"
          >
            Join the community
          </a>
          <div
            className="h-6 w-px bg-border-default"
            aria-hidden="true"
          />
          <button
            className="flex items-center gap-1 text-[14px] text-text-secondary"
            aria-label="Select language"
          >
            English
            <ChevronDown size={14} />
          </button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={24} className="text-text-primary" />
          ) : (
            <Menu size={24} className="text-text-primary" />
          )}
        </button>
      </nav>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="border-t border-border-default bg-white px-6 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-[14px] text-text-primary transition-colors hover:bg-bg-outer"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 border-t border-border-default pt-4">
              <a
                href="#join"
                className="inline-block rounded-lg border border-border-default bg-white px-4 py-2.5 text-[14px] font-medium text-text-primary shadow-[var(--shadow-soft)]"
              >
                Join the community
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
