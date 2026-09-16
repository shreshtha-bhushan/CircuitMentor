import React, { useState, useCallback } from 'react';
import LiveCircuitPreview from './LiveCircuitPreview';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';

interface LandingPageProps {
  onOpenApp: () => void;
  onOpenEditor: () => void;
  onOpenLogin?: () => void;
  isAuthenticated?: boolean;
}

// Static workspace shell component — pure HTML/CSS, no live editor code
function WorkspaceShellDemo() {
  return (
    <div className="landing-mock-app-shell">
      {/* Far-left icon rail */}
      <div className="landing-mock-rail">
        {/* Logo mark */}
        <div className="mock-rail-logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="mock-rail-divider" />
        {/* Library icon */}
        <div className="mock-rail-btn mock-rail-btn-active" title="Library">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="7" height="18" rx="1" />
            <rect x="10" y="3" width="12" height="11" rx="1" />
            <rect x="10" y="17" width="12" height="4" rx="1" />
          </svg>
        </div>
        {/* Grid icon */}
        <div className="mock-rail-btn" title="Grid">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        {/* Wire icon */}
        <div className="mock-rail-btn" title="Wire">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12 h5 v-5 h8 v5 h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="mock-rail-spacer" />
        {/* Settings icon */}
        <div className="mock-rail-btn" title="Settings">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
      </div>

      {/* Library panel */}
      <div className="landing-mock-panel">
        {/* Header */}
        <div className="mock-lib-header">
          <div className="mock-lib-title-row">
            <span className="mock-lib-title">Components</span>
            <span className="mock-lib-count">23</span>
          </div>
          {/* Search field */}
          <div className="mock-lib-search">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="mock-lib-search-placeholder">Search components…</span>
          </div>
          {/* Category pills */}
          <div className="mock-lib-pills">
            <span className="mock-pill mock-pill-active">All</span>
            <span className="mock-pill">Basic</span>
            <span className="mock-pill">Power</span>
            <span className="mock-pill">Semi</span>
            <span className="mock-pill">MCU</span>
          </div>
        </div>
        {/* Component grid */}
        <div className="mock-lib-grid">
          {[
            { label: 'Resistor', sub: 'Basic · 2p', icon: <ResistorIcon /> },
            { label: 'LED', sub: 'Basic · 2p', icon: <LedIcon /> },
            { label: 'Pushbutton', sub: 'Basic · 4p', icon: <ButtonIcon /> },
            { label: 'Potentiometer', sub: 'Basic · 3p', icon: <PotIcon /> },
            { label: 'Capacitor', sub: 'Basic · 2p', icon: <CapacitorIcon /> },
            { label: 'Slide switch', sub: 'Basic · 3p', icon: <SwitchIcon /> },
          ].map(({ label, sub, icon }) => (
            <div key={label} className="mock-comp-tile">
              <div className="mock-comp-glyph">{icon}</div>
              <span className="mock-comp-name">{label}</span>
              <span className="mock-comp-sub">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main canvas */}
      <div className="landing-mock-canvas">
        {/* Floating toolbar pill */}
        <div className="mock-toolbar-pill">
          <div className="mock-tool mock-tool-active" title="Select">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-7 1-3 7z" /></svg>
          </div>
          <div className="mock-tool" title="Wire">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h5v-5h8v5h5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="mock-toolbar-sep" />
          <div className="mock-tool" title="Undo">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14L4 9l5-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 9h11a4 4 0 0 1 0 8h-1" /></svg>
          </div>
          <div className="mock-tool" title="Redo">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 9H9a4 4 0 0 0 0 8h1" /></svg>
          </div>
          <div className="mock-toolbar-sep" />
          <span className="mock-zoom">100%</span>
          <div className="mock-toolbar-sep" />
          <div className="mock-run-btn">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            <span>Run</span>
          </div>
          <div className="mock-issues-chip">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span>1</span>
          </div>
        </div>
        <LiveCircuitPreview showStatusChip={true} />
      </div>

      {/* Inspector / Properties dock */}
      <div className="landing-mock-panel mock-inspector-panel">
        {/* Tab bar */}
        <div className="mock-dock-tabs">
          <span className="mock-dock-tab mock-dock-tab-active">Properties</span>
          <span className="mock-dock-tab">Code</span>
          <span className="mock-dock-tab">Mentor</span>
          <span className="mock-dock-tab">Issues</span>
          <div className="mock-dock-slider" />
        </div>
        {/* Component header */}
        <div className="mock-inspector-header">
          <div className="mock-inspector-component">
            <span className="mock-comp-designator">R1</span>
            <span className="mock-comp-label">Resistor · Placed</span>
          </div>
        </div>
        {/* Inspector cards */}
        <div className="mock-inspector-body">
          {/* Geometry group */}
          <div className="mock-inspector-group">
            <span className="mock-group-label">Position</span>
            <div className="mock-xy-row">
              <div className="mock-field-pair">
                <span className="mock-field-axis">X</span>
                <span className="mock-field-val">300px</span>
              </div>
              <div className="mock-field-pair">
                <span className="mock-field-axis">Y</span>
                <span className="mock-field-val">120px</span>
              </div>
            </div>
          </div>
          {/* Electrical group */}
          <div className="mock-inspector-group">
            <span className="mock-group-label">Electrical</span>
            <div className="mock-inspector-row">
              <span className="mock-row-label">Resistance</span>
              <span className="mock-row-val">220 Ω</span>
            </div>
            <div className="mock-inspector-row">
              <span className="mock-row-label">Tolerance</span>
              <span className="mock-row-val">5%</span>
            </div>
            <div className="mock-inspector-row">
              <span className="mock-row-label">Power</span>
              <span className="mock-row-val">¼ W</span>
            </div>
          </div>
          {/* Terminals group */}
          <div className="mock-inspector-group">
            <span className="mock-group-label">Terminals &amp; nets</span>
            <div className="mock-inspector-row">
              <span className="mock-row-label">Pin 1</span>
              <span className="mock-row-net mock-net-vcc">VCC</span>
            </div>
            <div className="mock-inspector-row">
              <span className="mock-row-label">Pin 2</span>
              <span className="mock-row-net mock-net-signal">D1:P1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tiny monochrome SVG glyphs for library component tiles
function ResistorIcon() {
  return (
    <svg width="28" height="16" viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 8h6l2-6 4 12 4-12 4 12 4-12 2 6h6" />
    </svg>
  );
}
function LedIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 5 20 17 12 5 4" />
      <line x1="17" y1="4" x2="17" y2="20" />
      <line x1="19" y1="6" x2="23" y2="2" /><polyline points="21 2 23 2 23 4" />
      <line x1="19" y1="10" x2="23" y2="6" /><polyline points="21 6 23 6 23 8" />
    </svg>
  );
}
function ButtonIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="2" y1="8" x2="2" y2="16" /><line x1="22" y1="8" x2="22" y2="16" />
      <line x1="2" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="22" y2="12" />
    </svg>
  );
}
function PotIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="20" height="12" rx="2" />
      <line x1="0" y1="10" x2="4" y2="10" /><line x1="24" y1="10" x2="28" y2="10" />
      <line x1="14" y1="4" x2="14" y2="0" />
      <circle cx="14" cy="10" r="2" />
    </svg>
  );
}
function CapacitorIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
    </svg>
  );
}
function SwitchIcon() {
  return (
    <svg width="32" height="16" viewBox="0 0 36 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="0" y1="8" x2="8" y2="8" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <line x1="10" y1="8" x2="18" y2="4" />
      <circle cx="26" cy="4" r="2" /><circle cx="26" cy="12" r="2" />
      <line x1="28" y1="4" x2="36" y2="4" /><line x1="28" y1="12" x2="36" y2="12" />
    </svg>
  );
}

export default function LandingPage({
  onOpenApp,
  onOpenEditor,
  onOpenLogin,
  isAuthenticated = false,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const elem = document.getElementById(targetId);
    if (elem) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      elem.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
  }, []);

  const handlePrimaryAction = useCallback(() => {
    if (isAuthenticated) {
      onOpenApp();
    } else if (onOpenLogin) {
      onOpenLogin();
    } else {
      onOpenEditor();
    }
  }, [isAuthenticated, onOpenApp, onOpenLogin, onOpenEditor]);

  return (
    <div className="landing-container" role="region" aria-label="CircuitMentor Home">
      {/* 1. Floating pill navbar */}
      <div className="landing-navbar-wrapper">
        <header className="landing-navbar">
          <div className="landing-navbar-inner">
            {/* Brand */}
            <div
              className="landing-brand"
              onClick={isAuthenticated ? onOpenApp : onOpenEditor}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (isAuthenticated ? onOpenApp() : onOpenEditor())}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="landing-brand-logo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C12 7.2 16.8 12 24 12C16.8 12 12 16.8 12 24C12 16.8 7.2 12 0 12C7.2 12 12 7.2 12 0Z" />
                </svg>
              </div>
              <span className="landing-brand-name">CircuitMentor</span>
            </div>

            {/* Desktop nav links */}
            <nav className="landing-nav-links" aria-label="Main navigation">
              <a href="#features" className="landing-nav-link" onClick={(e) => handleScrollTo(e, 'features')}>Features</a>
              <a href="#simulation" className="landing-nav-link" onClick={(e) => handleScrollTo(e, 'simulation')}>Simulation</a>
              <a href="#mentor" className="landing-nav-link" onClick={(e) => handleScrollTo(e, 'mentor')}>AI mentor</a>
            </nav>

            {/* Nav actions */}
            <div className="landing-nav-actions">
              {!isAuthenticated && onOpenLogin && (
                <button type="button" className="landing-nav-text-link" onClick={onOpenLogin}>Log in</button>
              )}
              <button
                type="button"
                className="landing-nav-cta-white"
                onClick={handlePrimaryAction}
              >
                <span>Get started</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="landing-mobile-menu-trigger">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button type="button" className="landing-hamburger-btn" aria-label="Open navigation menu">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="landing-mobile-sheet">
                  <div className="landing-sheet-inner">
                    <div className="landing-sheet-header">
                      <div className="landing-brand">
                        <div className="landing-brand-logo">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C12 7.2 16.8 12 24 12C16.8 12 12 16.8 12 24C12 16.8 7.2 12 0 12C7.2 12 12 7.2 12 0Z" />
                          </svg>
                        </div>
                        <span className="landing-brand-name">CircuitMentor</span>
                      </div>
                    </div>
                    <nav className="landing-sheet-links">
                      <a href="#demo" className="landing-sheet-link" onClick={(e) => handleScrollTo(e, 'demo')}>Workspace</a>
                      <a href="#features" className="landing-sheet-link" onClick={(e) => handleScrollTo(e, 'features')}>Features</a>
                      <a href="#simulation" className="landing-sheet-link" onClick={(e) => handleScrollTo(e, 'simulation')}>Simulation</a>
                      <a href="#mentor" className="landing-sheet-link" onClick={(e) => handleScrollTo(e, 'mentor')}>AI mentor</a>
                    </nav>
                    <div className="landing-sheet-actions">
                      {!isAuthenticated && onOpenLogin && (
                        <button type="button" className="btn btn-secondary" style={{ width: '100%' }}
                          onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}>
                          Log in
                        </button>
                      )}
                      <button type="button" className="landing-nav-cta-white" style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => { setMobileMenuOpen(false); handlePrimaryAction(); }}>
                        <span>Get started</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      </div>

      {/* 2. Hero section — matching PromptPro reference layout & glowing celestial arc */}
      <section id="hero" className="landing-hero">
        {/* Background subtle grid */}
        <div className="landing-hero-grid" aria-hidden="true" />

        {/* 3 Luminous Horizon Layers */}
        <div className="landing-horizon-bloom" aria-hidden="true" />
        <div className="landing-horizon-gradient" aria-hidden="true" />
        <div className="landing-horizon-arc" aria-hidden="true" />

        {/* Pill Tag / Badge */}
        <a href="#features" className="landing-hero-pill-badge" onClick={(e) => handleScrollTo(e, 'features')}>
          <span className="pill-sparkle">✦</span>
          <span>WORKS WITH REAL ELECTRICAL HARDWARE &amp; SPICE SOLVERS</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>

        {/* Main Headline */}
        <h1 className="landing-headline">
          <span className="landing-headline-line">
            <span className="landing-headline-main">A&nbsp;</span>
            <span className="landing-headline-accent">Mentor</span>
            <span className="landing-headline-main">&nbsp;for</span>
          </span>
          <br className="headline-break" />
          <span className="landing-headline-line">
            <span className="landing-headline-main">every circuit you build.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="landing-subtitle">
          Place components, wire them up, and run real simulations — with guidance that explains what&apos;s happening as you go.
        </p>

        {/* Single CTA — [Get started] */}
        <div className="landing-cta-group">
          <button
            type="button"
            className="landing-hero-cta-white"
            onClick={handlePrimaryAction}
          >
            <span>Get started</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </section>

      {/* Workspace Demo Section */}
      <section id="demo" className="landing-demo-section">
        <div className="landing-demo-header">
          <div className="landing-feature-meta-tag">
            <span className="tag-icon">✦</span>
            <span>The workspace</span>
          </div>
          <h2 className="landing-demo-title">Your whole bench, in a browser tab.</h2>
          <p className="landing-demo-subtitle">
            Build on a breadboard or a schematic canvas. Drop in components, wire them by hand, and watch what the circuit actually does — no install, no license, nothing to set up.
          </p>
        </div>

        {/* Demo window — static faithful workspace shell */}
        <div className="landing-preview-container">
          <div className="landing-preview-underglow" aria-hidden="true" />
          <div className="landing-preview-frame">
            <WorkspaceShellDemo />
          </div>
          <div className="landing-preview-fade" aria-hidden="true" />
        </div>
      </section>

      {/* 3. Features — Bento Grid matching reference */}
      <section id="features" className="landing-features-section">
        <div className="landing-features-container">
          <div className="landing-features-grid">
            {/* Card 01: Socratic AI Mentor (Tall, spans left column) */}
            <div id="mentor" className="landing-feature-card landing-feature-card-mentor">
              <div className="feature-header-wrap">
                <div className="landing-feature-meta-tag">
                  <span className="tag-icon">✦</span>
                  <span>The mentor</span>
                </div>
                <h3 className="landing-feature-name">Guide, don&apos;t spoil.</h3>
                <p className="landing-feature-detail">
                  Ask why something isn&apos;t working and the mentor starts by pointing at where to look. Ask again and it explains the concept. It only walks you through the full fix once you&apos;ve actually tried — and it never edits your circuit for you.
                </p>
              </div>

              {/* Nested Prompt/Mentor Terminal Box matching reference */}
              <div className="refine-box">
                <div className="refine-box-header">
                  <span className="refine-box-path">circuitmentor.app / mentor-session</span>
                  <span className="refine-box-badge">+42 mA Overdrive Alert</span>
                </div>
                <div className="refine-box-body">
                  <span className="refine-box-role">[ERC-001 · Red LED Branch]</span>
                  R1 · LED branch — There&apos;s nothing limiting current between D1 and the 9 V supply. At this voltage the LED would draw far more than its 20 mA rating.
                </div>
                <div className="refine-box-footer">
                  <div className="refine-tiers">
                    <span><span className="refine-tier-dot">●</span> Point me at it</span>
                    <span><span className="refine-tier-dot">●</span> Explain why</span>
                    <span><span className="refine-tier-dot">●</span> Show the fix</span>
                  </div>
                  <button type="button" className="refine-action-btn">
                    <span>✦</span>
                    <span>Suggested fix — you place it</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 02: Real-time MNA Solver (Top Right) */}
            <div id="simulation" className="landing-feature-card landing-feature-card-sim">
              <div className="feature-header-wrap">
                <div className="landing-feature-meta-tag tag-emerald">
                  <span className="tag-icon">⬡</span>
                  <span>The simulation</span>
                </div>
                <h3 className="landing-feature-name">It runs in your browser.</h3>
                <p className="landing-feature-detail">
                  Voltages and currents are calculated as you build, not illustrated. Swap a 220 Ω resistor for a 1 kΩ and the LED actually dims. Nothing leaves your machine and nothing waits on a server.
                </p>
              </div>

              {/* Sleek Green Pill Bar matching reference */}
              <div className="hybrid-pill-box">
                <svg className="hybrid-check-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Local MNA Engine + Optional Socratic AI Mentor</span>
              </div>
            </div>

            {/* Card 03: Automated ERC Hardware Validation (Bottom Right) */}
            <div className="landing-feature-card landing-feature-card-erc">
              <div className="feature-header-wrap">
                <div className="landing-feature-meta-tag">
                  <span className="tag-icon">⚙</span>
                  <span>Error checking</span>
                </div>
                <h3 className="landing-feature-name">Mistakes get explained, not just flagged.</h3>
                <p className="landing-feature-detail">
                  The workspace checks your circuit against real electrical rules as you build — missing current limiting, shorted rails, floating inputs, reversed polarity — and tells you what&apos;s wrong and why it matters.
                </p>
              </div>

              {/* Row of Compatibility Chips matching actual rule set */}
              <div className="compatibility-chips-row">
                <div className="compat-chip">
                  <span className="compat-chip-icon">⚡</span>
                  <span>Current limiting</span>
                </div>
                <div className="compat-chip">
                  <span className="compat-chip-icon">⚠</span>
                  <span>Shorted rails</span>
                </div>
                <div className="compat-chip">
                  <span className="compat-chip-icon">⏚</span>
                  <span>Floating inputs</span>
                </div>
                <div className="compat-chip">
                  <span className="compat-chip-icon">⇄</span>
                  <span>Reversed polarity</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Bottom Capabilities Bar — Real project truths */}
          <div className="landing-subfeatures-bar">
            <div className="subfeature-item">
              <span className="subfeature-title">Runs locally</span>
              <span className="subfeature-desc">Simulation and error checks work offline</span>
            </div>
            <div className="subfeature-item">
              <span className="subfeature-title">10 electrical rules</span>
              <span className="subfeature-desc">Checked continuously as you build</span>
            </div>
            <div className="subfeature-item">
              <span className="subfeature-title">Four hint levels</span>
              <span className="subfeature-desc">From a nudge to a full walkthrough</span>
            </div>
            <div className="subfeature-item">
              <span className="subfeature-title">Your circuit, your edits</span>
              <span className="subfeature-desc">The mentor never changes your work</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer with submerged CIRCUITMENTOR brand typography */}
      <footer className="landing-footer">
        {/* Glow Horizon Footer Accent: Blue horizon radiating from bottom edge */}
        <div className="footer-glow-horizon" aria-hidden="true">
          <div className="glow-horizon-arc-primary" />
          <div className="glow-horizon-arc-secondary" />
          <div className="glow-horizon-arc-center" />
        </div>

        <div className="landing-footer-inner">
          <div className="landing-footer-copy">
            <span className="landing-footer-brand">CircuitMentor</span>
            <span className="landing-footer-sep">·</span>
            <span className="landing-footer-tagline">A workspace for learning how circuits actually work.</span>
          </div>
        </div>

        {/* Large submerged CIRCUITMENTOR display text — Translucent Glass with Increased Size & Bottom Padding */}
        <div className="landing-submerged-brand-wrap" aria-hidden="true">
          <svg
            className="landing-submerged-brand-svg"
            viewBox="0 0 1600 210"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
              {/* Bottom-to-Up Translucent Glass Fill */}
              <linearGradient id="refTranslucentGlassGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.48" />
                <stop offset="16%" stopColor="#0284c7" stopOpacity="0.35" />
                <stop offset="45%" stopColor="#1e293b" stopOpacity="0.26" />
                <stop offset="75%" stopColor="#334155" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.20" />
              </linearGradient>

              {/* Bottom-to-Up Specular Glass Stroke */}
              <linearGradient id="translucentGlassStroke" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
                <stop offset="25%" stopColor="#0a84ff" stopOpacity="0.30" />
                <stop offset="65%" stopColor="#64748b" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
              </linearGradient>

            {/* Clean, Large Translucent Glass Wordmark */}
            <text
              x="50%"
              y="158"
              textAnchor="middle"
              className="landing-submerged-brand-text"
              fill="url(#refTranslucentGlassGrad)"
              stroke="url(#translucentGlassStroke)"
              strokeWidth="1.0"
            >
              CIRCUITMENTOR
            </text>
          </svg>
        </div>
      </footer>
    </div>
  );
}
