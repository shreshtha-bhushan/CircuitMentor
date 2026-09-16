import { useState, useMemo } from 'react';
import type { PlacedComponent, ErcFinding } from '../App';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import type { WireConnection } from './Canvas';

export interface ProjectData {
  id: string;
  name: string;
  updatedAt: string;
  components: PlacedComponent[];
  wires?: WireConnection[];
  findings: ErcFinding[];
}

interface DashboardProps {
  projects: ProjectData[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: (name: string, template?: string) => void;
  onNavigateHome?: () => void;
}

export default function Dashboard({
  projects,
  onOpenProject,
  onCreateProject,
  onNavigateHome,
}: DashboardProps) {
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    return projects.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newProjectName.trim() || 'Untitled Circuit';
    onCreateProject(name, selectedTemplate);
    setIsCreating(false);
    setNewProjectName('');
  };

  return (
    <div className="dashboard-shell" role="region" aria-label="Projects dashboard">
      {/* Top Header Bar */}
      <header className="dashboard-header">
        <div
          className="dashboard-brand cursor-pointer hover:opacity-90 transition-opacity"
          onClick={onNavigateHome}
          title="Return to CircuitMentor Home"
        >
          <div className="dashboard-logo">
            <svg viewBox="0 0 32 32" fill="currentColor" width="24" height="24">
              <path d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 3l8 4.6v9.8L16 24l-8-4.6V9.6L16 5z" />
              <circle cx="16" cy="16" r="4" />
            </svg>
          </div>
          <div className="dashboard-brand-text">
            <h1 className="dashboard-title">CircuitMentor</h1>
            <span className="dashboard-subtitle">Workspace & Electronics Lab</span>
          </div>
        </div>

        {/* Center Search */}
        <div className="dashboard-search-wrapper">
          <svg className="dashboard-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="dashboard-search-input"
            placeholder="Search projects (⌘K)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search circuits and projects"
          />
        </div>

        {/* New Project Action Button */}
        <div className="dashboard-actions">
          <button
            className="btn btn-primary new-project-btn"
            onClick={() => setIsCreating(true)}
            aria-label="Create new circuit project"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New project</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <div className="dashboard-section-meta">
            <h2 className="dashboard-section-heading">Recent Projects</h2>
            <span className="dashboard-project-count">{filteredProjects.length} circuits</span>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          /* Empty State (DESIGN.md §8.8) */
          <div className="dashboard-empty-state">
            <div className="empty-state-illustration">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--text-3)" strokeWidth="1.5">
                <rect x="8" y="12" width="48" height="40" rx="6" />
                <line x1="20" y1="32" x2="44" y2="32" strokeDasharray="3 3" />
                <circle cx="32" cy="32" r="6" stroke="var(--blue)" />
                <line x1="32" y1="20" x2="32" y2="26" />
                <line x1="32" y1="38" x2="32" y2="44" />
              </svg>
            </div>
            <h3 className="empty-state-title">No circuits found</h3>
            <p className="empty-state-desc">
              {search
                ? `No projects matching "${search}". Clear the search or create a new project.`
                : 'Start your first circuit. Build schematics, test with live MNA simulation, and get real-time guidance from your AI mentor.'}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (search) setSearch('');
                else setIsCreating(true);
              }}
            >
              {search ? 'Clear search' : 'Start your first circuit'}
            </button>
          </div>
        ) : (
          /* Responsive Projects Grid (Each with live SVG miniature schematic preview) */
          <div className="dashboard-grid" role="list">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                role="listitem"
                className="project-card"
                onClick={() => onOpenProject(project.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenProject(project.id);
                  }
                }}
                aria-label={`Open project ${project.name}`}
              >
                {/* Circuit Thumbnail Preview (~70% height on --void background) */}
                <div className="project-card-preview">
                  <svg className="preview-canvas-svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet">
                    {/* Dark void background */}
                    <rect width="100%" height="100%" fill="var(--void)" />
                    {/* Subtle dot grid */}
                    <pattern id={`previewGrid-${project.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="0.75" fill="rgba(255,255,255,0.08)" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#previewGrid-${project.id})`} />

                    {/* Circuit Schematic Rendering */}
                    <g transform="scale(0.65) translate(40, 20)">
                      {renderProjectMiniWires(project)}
                      {project.components.map((c) => (
                        <g key={c.id} transform={`translate(${c.x}, ${c.y}) rotate(${c.rotation})`}>
                          {renderMiniSymbol(c.partId)}
                          <text y="24" textAnchor="middle" fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)">
                            {c.designator}
                          </text>
                        </g>
                      ))}
                    </g>
                  </svg>
                </div>

                {/* Project Metadata Footer */}
                <div className="project-card-footer">
                  <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    <div className="project-meta-row">
                      <span className="project-time">{project.updatedAt}</span>
                      <span className="project-bullet">·</span>
                      <span className="project-parts-count">{project.components.length} parts</span>
                    </div>
                  </div>

                  {/* Issues Chip */}
                  <div className="project-status">
                    {project.findings.length > 0 ? (
                      <span className="project-badge badge-error">
                        <span className="badge-dot dot-error" />
                        {project.findings.length} {project.findings.length === 1 ? 'issue' : 'issues'}
                      </span>
                    ) : (
                      <span className="project-badge badge-ok">
                        <span className="badge-dot dot-ok" />
                        Clean
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Project Dialog using shadcn Dialog primitive */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>New Circuit Project</DialogTitle>
            <DialogDescription>
              Configure the project title and select a starter circuit topology.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-1">
            <div className="form-group">
              <label htmlFor="proj-name-input" className="form-label">Project Name</label>
              <input
                id="proj-name-input"
                type="text"
                className="form-input"
                placeholder="e.g. 555 Timer Astable Multivibrator"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <span className="form-label">Starter Template</span>
              <div className="template-cards-grid">
                <button
                  type="button"
                  className={`template-card ${selectedTemplate === 'blank' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('blank')}
                >
                  <span className="template-name">Blank Canvas</span>
                  <span className="template-desc">Empty schematic sheet ready for breadboard or discrete design.</span>
                </button>

                <button
                  type="button"
                  className={`template-card ${selectedTemplate === 'led' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('led')}
                >
                  <span className="template-name">LED Limiter Lab</span>
                  <span className="template-desc">9V battery, 220Ω resistor, and LED ready for MNA testing.</span>
                </button>

                <button
                  type="button"
                  className={`template-card ${selectedTemplate === 'arduino' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('arduino')}
                >
                  <span className="template-name">Arduino + Sensor</span>
                  <span className="template-desc">Arduino Uno R3 with HC-SR04 ultrasonic and micro servo.</span>
                </button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Create Circuit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Miniature schematic symbol renderers for card thumbnails */
function renderMiniSymbol(partId: string) {
  switch (partId) {
    case 'resistor.axial':
      return (
        <path
          d="M -24,0 L -14,0 L -10,-6 L -5,6 L 0,-6 L 5,6 L 10,-6 L 14,0 L 24,0"
          fill="none"
          stroke="var(--text-1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      );
    case 'led.5mm.red':
      return (
        <g stroke="var(--text-1)" strokeWidth="1.5" fill="none">
          <polygon points="-6,-8 -6,8 8,0" />
          <line x1="8" y1="-8" x2="8" y2="8" />
          <line x1="-16" y1="0" x2="-6" y2="0" />
          <line x1="8" y1="0" x2="18" y2="0" />
          <line x1="2" y1="-10" x2="9" y2="-15" stroke="var(--error)" strokeWidth="1.2" />
        </g>
      );
    case 'battery.9v':
      return (
        <g stroke="var(--text-1)" strokeWidth="1.5" fill="none">
          <line x1="0" y1="-16" x2="0" y2="-6" />
          <line x1="-10" y1="-6" x2="10" y2="-6" strokeWidth="2.5" />
          <line x1="-5" y1="-1" x2="5" y2="-1" />
          <line x1="-10" y1="4" x2="10" y2="4" strokeWidth="2.5" />
          <line x1="-5" y1="9" x2="5" y2="9" />
          <line x1="0" y1="9" x2="0" y2="16" />
        </g>
      );
    case 'ground':
      return (
        <g stroke="var(--text-1)" strokeWidth="1.5" fill="none">
          <line x1="0" y1="-10" x2="0" y2="0" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-6" y1="4" x2="6" y2="4" />
          <line x1="-2" y1="8" x2="2" y2="8" />
        </g>
      );
    case 'arduino.uno':
      return (
        <g stroke="var(--text-1)" strokeWidth="1.5" fill="none">
          <rect x="-24" y="-18" width="48" height="36" rx="3" />
          <rect x="-16" y="-12" width="10" height="8" fill="var(--raised)" stroke="var(--blue)" />
          <text x="0" y="6" textAnchor="middle" fill="var(--blue)" fontSize="7" fontFamily="var(--font-mono)">UNO</text>
        </g>
      );
    default:
      return (
        <rect x="-18" y="-14" width="36" height="28" rx="2" fill="none" stroke="var(--text-1)" strokeWidth="1.5" />
      );
  }
}

/** Render miniature wires for project cards */
function renderProjectMiniWires(project: ProjectData) {
  if (project.components.length < 2) return null;
  return (
    <g fill="none" strokeWidth="2" strokeLinecap="round">
      {/* VCC wire */}
      <path d="M 120,180 L 120,120 L 270,120" stroke="var(--wire-vcc)" />
      {/* Signal wire */}
      <path d="M 330,120 L 460,120" stroke="var(--wire-signal)" />
      {/* Ground wire */}
      <path d="M 504,120 L 550,120 L 550,320 L 300,320" stroke="var(--wire-gnd)" />
      <path d="M 120,220 L 120,320 L 300,320" stroke="var(--wire-gnd)" />
    </g>
  );
}
