import type { ErcFinding } from '../App';

interface ErcFindingsProps {
  findings: ErcFinding[];
  onFindingClick: (finding: ErcFinding) => void;
  onFindingHover: (finding: ErcFinding | null) => void;
}

export default function ErcFindings({ findings, onFindingClick, onFindingHover }: ErcFindingsProps) {
  if (findings.length === 0) {
    return (
      <div className="erc-findings" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 'var(--cm-space-3)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cm-ok)" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p style={{ font: 'var(--cm-text-body)', color: 'var(--cm-text-secondary)', textAlign: 'center' }}>
          <strong style={{ color: 'var(--cm-text)' }}>No issues found.</strong>
          <br />Your circuit passes all checks.
        </p>
      </div>
    );
  }

  return (
    <div className="erc-findings">
      <div className="erc-header">
        Electrical rule check · {findings.length} {findings.length === 1 ? 'issue' : 'issues'}
      </div>

      <div className="erc-list">
        {findings.map(finding => (
          <button
            key={finding.id}
            className="erc-finding"
            onClick={() => onFindingClick(finding)}
            onMouseEnter={() => onFindingHover(finding)}
            onMouseLeave={() => onFindingHover(null)}
            aria-label={`${finding.severity}: ${finding.title}`}
          >
            {/* Severity glyph — distinct shapes per severity */}
            <div className={`erc-glyph ${finding.severity}`}>
              {finding.severity === 'error' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="7"/>
                </svg>
              )}
              {finding.severity === 'warning' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <polygon points="8,1 15,14 1,14"/>
                </svg>
              )}
              {finding.severity === 'info' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6"/>
                  <line x1="8" y1="7" x2="8" y2="11"/>
                  <circle cx="8" cy="5" r=".5" fill="currentColor"/>
                </svg>
              )}
            </div>

            <div className="erc-content">
              <div className="erc-title">{finding.title}</div>
              <div className="erc-detail">{finding.detail}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
