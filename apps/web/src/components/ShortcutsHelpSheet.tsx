import { useState, useMemo } from 'react';
import { SHORTCUTS, isMac, type ShortcutItem } from '@/lib/shortcuts';

interface ShortcutsHelpSheetProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Palette', 'Tools', 'Quick-Place', 'Editing', 'View', 'Actions'] as const;

export default function ShortcutsHelpSheet({ open, onClose }: ShortcutsHelpSheetProps) {
  const [search, setSearch] = useState('');

  const filteredShortcuts = useMemo(() => {
    if (!search.trim()) return SHORTCUTS;
    const q = search.toLowerCase().trim();
    return SHORTCUTS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.keys.mac.toLowerCase().includes(q) ||
        s.keys.win.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<string, ShortcutItem[]>();
    for (const cat of CATEGORIES) {
      const items = filteredShortcuts.filter((s) => s.category === cat);
      if (items.length > 0) {
        map.set(cat, items);
      }
    }
    return map;
  }, [filteredShortcuts]);

  if (!open) return null;

  return (
    <div
      className="shortcuts-help-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
    >
      <div
        className="shortcuts-help-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shortcuts-help-header">
          <div className="shortcuts-help-title-wrap">
            <h2 className="shortcuts-help-title">Keyboard Shortcuts</h2>
            <span className="shortcuts-help-platform-badge">
              {isMac ? 'macOS (⌘)' : 'Windows / Linux (Ctrl)'}
            </span>
          </div>

          <div className="shortcuts-help-header-actions">
            <input
              type="text"
              className="shortcuts-help-search"
              placeholder="Search shortcuts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="shortcuts-help-close-btn"
              onClick={onClose}
              aria-label="Close shortcuts help"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="shortcuts-help-body">
          {grouped.size === 0 ? (
            <div className="shortcuts-empty">No shortcuts matching &quot;{search}&quot;</div>
          ) : (
            Array.from(grouped.entries()).map(([cat, items]) => (
              <div key={cat} className="shortcuts-section">
                <h3 className="shortcuts-section-heading">{cat}</h3>
                <div className="shortcuts-grid">
                  {items.map((item) => (
                    <div key={item.id} className="shortcut-card">
                      <div className="shortcut-card-text">
                        <span className="shortcut-card-label">{item.label}</span>
                        <span className="shortcut-card-desc">{item.description}</span>
                      </div>
                      <kbd className="cm-shortcut-kbd">
                        {isMac ? item.keys.mac : item.keys.win}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="shortcuts-help-footer">
          <span className="shortcuts-help-hint">
            Press <kbd className="cm-shortcut-kbd">Esc</kbd> anytime to close
          </span>
        </div>
      </div>
    </div>
  );
}
