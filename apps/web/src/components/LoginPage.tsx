import React, { useEffect } from 'react';
import LiveCircuitPreview from './LiveCircuitPreview';

interface LoginPageProps {
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateHome,
}: LoginPageProps) {
  return (
    <div className="login-shell" role="region" aria-label="Sign in to CircuitMentor">
      <div className="login-container">
        {/* Left Column: Form / Sign-in */}
        <div className="login-form-col">
          <div className="login-form-inner">
            {/* Brand Logo & Back to Home */}
            <div
              className="login-brand-header"
              onClick={onNavigateHome}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateHome()}
              title="Return to CircuitMentor Home"
            >
              <div className="login-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="login-brand-title">CircuitMentor</span>
            </div>

            {/* Heading & Sub-copy */}
            <div className="login-copy-group">
              <h1 className="login-heading">Sign in to CircuitMentor</h1>
              <p className="login-subcopy">
                Your projects sync automatically — pick up where you left off on any device you&apos;re signed into.
              </p>
            </div>

            {/* Single Official Google Identity Button */}
            <div className="login-actions">
              <button
                type="button"
                className="google-signin-btn"
                onClick={onLoginSuccess}
                aria-label="Continue with Google"
              >
                {/* Official Google 4-Color 'G' Logo */}
                <svg className="google-icon" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span className="google-btn-text">Continue with Google</span>
              </button>
            </div>

            {/* Subordinate Home Link */}
            <div className="login-footer-nav">
              <button
                type="button"
                className="login-back-btn"
                onClick={onNavigateHome}
              >
                ← Back to overview
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Circuit SVG Graphic on Void Canvas */}
        <div className="login-visual-col" aria-hidden="true">
          <div className="login-visual-wrapper">
            <LiveCircuitPreview showStatusChip={false} />
            <div className="login-visual-caption">
              <span>Interactive Schematic Engine · Live Node Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
