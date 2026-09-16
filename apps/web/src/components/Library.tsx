import { useState, useMemo, useEffect } from 'react';
import { PARTS, type PartDef } from '@/lib/parts';

interface LibraryProps {
  className?: string;
  selectedPart: string | null;
  onSelectPart: (partId: string | null) => void;
}


const CATEGORIES = ['All', 'Basic', 'Power', 'Semi', 'MCU', 'Sensor', 'Output', 'Board'] as const;

export default function Library({ className = '', selectedPart, onSelectPart }: LibraryProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>(() => {
    return (localStorage.getItem('cm_library_view') as 'list' | 'gallery') || 'list';
  });

  useEffect(() => {
    localStorage.setItem('cm_library_view', viewMode);
  }, [viewMode]);

  const filtered = useMemo(() => {
    return PARTS.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === 'All' || p.category === category;
      return matchesSearch && matchesCat;
    });
  }, [search, category]);

  return (
    <aside className={`library-panel ${className}`} aria-label="Component library">
      {/* Header with Search, View Toggle, and Figma Category Tags */}
      <div className="library-header">
        <div className="library-title-row">
          <div className="title-and-count">
            <span className="library-title">Library</span>
            <span className="library-count">{filtered.length} parts</span>
          </div>

          {/* View Toggle: Grid vs List */}
          <div className="library-view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view (denser)"
              aria-label="List view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
                <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
                <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
              </svg>
            </button>

            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'gallery' ? 'active' : ''}`}
              onClick={() => setViewMode('gallery')}
              title="Gallery grid view"
              aria-label="Gallery view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="library-search-wrapper">
          <svg className="library-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="library-search"
            placeholder="Search components (⌘K)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search components"
          />
        </div>

        {/* Category Tags */}
        <div className="library-pills-row" role="tablist" aria-label="Category tags">
          {CATEGORIES.map((c) => {
            const isActive = category === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={isActive}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Component Tiles: List or Gallery Mode */}
      <div className={`library-grid-container view-${viewMode}`} role="listbox">
        {filtered.map((part) => {
          const isSelected = selectedPart === part.id;
          return (
            <button
              key={part.id}
              role="option"
              aria-selected={isSelected}
              className={`library-tile tile-${viewMode} ${isSelected ? 'selected' : ''}`}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', part.id);
                e.dataTransfer.setData('application/json', JSON.stringify({ partId: part.id, name: part.name }));
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => onSelectPart(isSelected ? null : part.id)}
              aria-label={`Select ${part.name} to place or drag to canvas`}
              title="Drag onto canvas or click here then click canvas to place"
            >
              <div className="library-tile-glyph">
                {part.icon(isSelected ? 'var(--blue)' : 'var(--text-2)')}
              </div>
              <div className="library-tile-info">
                <span className="library-tile-name">{part.name}</span>
                <span className="library-tile-meta">
                  {part.category} · {part.pins}p
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
