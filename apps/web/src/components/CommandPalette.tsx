import React, { useState } from 'react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command';
import { PARTS, type PartDef } from '@/lib/parts';
import { isMac } from '@/lib/shortcuts';
import type { ProjectData } from './Dashboard';

export interface CommandPaletteProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  context?: 'editor' | 'dashboard' | 'landing';
  // Editor actions
  onSelectPart?: (partId: string) => void;
  onRunSimulation?: () => void;
  onRunErc?: () => void;
  onSaveProject?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomFit?: () => void;
  onZoom100?: () => void;
  onToggleLibrary?: () => void;
  onToggleInspector?: () => void;
  onOpenMentor?: () => void;
  onOpenShortcutsHelp?: () => void;
  onNewProject?: () => void;
  // Dashboard actions & data
  projects?: ProjectData[];
  onOpenProject?: (projectId: string) => void;
  onCreateProject?: () => void;
  onNavigateHome?: () => void;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <>{text}</>;
  }
  const q = query.trim().toLowerCase();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(q);

  if (index === -1) {
    return <>{text}</>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + q.length);
  const after = text.slice(index + q.length);

  return (
    <>
      {before}
      <span className="cm-match-highlight">{match}</span>
      {after}
    </>
  );
}

export default function CommandPalette({
  open = true,
  onClose,
  onOpenChange,
  context = 'editor',
  onSelectPart,
  onRunSimulation,
  onRunErc,
  onSaveProject,
  onUndo,
  onRedo,
  onZoomFit,
  onZoom100,
  onToggleLibrary,
  onToggleInspector,
  onOpenMentor,
  onOpenShortcutsHelp,
  onNewProject,
  projects = [],
  onOpenProject,
  onCreateProject,
  onNavigateHome,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  const handleClose = () => {
    onOpenChange?.(false);
    onClose?.();
  };

  const handleExecute = (action: () => void) => {
    action();
    handleClose();
  };

  // Canvas Actions definitions
  const canvasActions = [
    {
      id: 'action-run-sim',
      label: 'Run Simulation',
      shortcut: isMac ? '⌘R' : 'Ctrl+R',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
      perform: () => onRunSimulation?.(),
    },
    {
      id: 'action-run-erc',
      label: 'Check Electrical Rules (ERC)',
      shortcut: isMac ? '⌘E' : 'Ctrl+E',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
      perform: () => onRunErc?.(),
    },
    {
      id: 'action-save',
      label: 'Save Project',
      shortcut: isMac ? '⌘S' : 'Ctrl+S',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      ),
      perform: () => onSaveProject?.(),
    },
    {
      id: 'action-undo',
      label: 'Undo',
      shortcut: isMac ? '⌘Z' : 'Ctrl+Z',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 14L4 9l5-5" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      ),
      perform: () => onUndo?.(),
    },
    {
      id: 'action-redo',
      label: 'Redo',
      shortcut: isMac ? '⌘⇧Z' : 'Ctrl+Y',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14l5-5-5-5" />
          <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
        </svg>
      ),
      perform: () => onRedo?.(),
    },
    {
      id: 'action-zoom-fit',
      label: 'Zoom to Fit',
      shortcut: isMac ? '⌘1' : 'Ctrl+1',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      ),
      perform: () => onZoomFit?.(),
    },
    {
      id: 'action-zoom-100',
      label: 'Reset Zoom (100%)',
      shortcut: isMac ? '⌘0' : 'Ctrl+0',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      perform: () => onZoom100?.(),
    },
    {
      id: 'action-toggle-library',
      label: 'Toggle Library',
      shortcut: isMac ? '⌘\\' : 'Ctrl+\\',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="18" rx="1" />
          <rect x="14" y="3" width="7" height="18" rx="1" />
        </svg>
      ),
      perform: () => onToggleLibrary?.(),
    },
    {
      id: 'action-toggle-inspector',
      label: 'Toggle Inspector Dock',
      shortcut: isMac ? '⌘/' : 'Ctrl+/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      ),
      perform: () => onToggleInspector?.(),
    },
    {
      id: 'action-open-mentor',
      label: 'Open AI Mentor',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      perform: () => onOpenMentor?.(),
    },
    {
      id: 'action-shortcuts-help',
      label: 'Keyboard Shortcuts Help',
      shortcut: '?',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      perform: () => onOpenShortcutsHelp?.(),
    },
    {
      id: 'action-new-project',
      label: 'New Project',
      shortcut: isMac ? '⌘N' : 'Ctrl+N',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      perform: () => onNewProject?.(),
    },
  ];

  // Dashboard Actions definitions
  const dashboardActions = [
    {
      id: 'dash-action-new',
      label: 'Create New Project',
      shortcut: isMac ? '⌘N' : 'Ctrl+N',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      perform: () => onCreateProject?.(),
    },
    {
      id: 'dash-action-home',
      label: 'Return to Home Page',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      perform: () => onNavigateHome?.(),
    },
    {
      id: 'dash-action-shortcuts',
      label: 'Keyboard Shortcuts Help',
      shortcut: '?',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      perform: () => onOpenShortcutsHelp?.(),
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={
          context === 'dashboard'
            ? 'Search circuits or actions (⌘K)...'
            : 'Search components, tools, or actions (⌘K)...'
        }
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          No matches for &quot;{search}&quot;
        </CommandEmpty>

        {context === 'dashboard' ? (
          <>
            {/* Dashboard: Projects List */}
            {projects.length > 0 && (
              <CommandGroup heading="Projects">
                {projects.map((proj) => (
                  <CommandItem
                    key={proj.id}
                    value={`${proj.name} project ${proj.updatedAt}`}
                    onSelect={() => handleExecute(() => onOpenProject?.(proj.id))}
                  >
                    <div className="cm-command-item-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <span className="cm-command-item-label">
                      <HighlightMatch text={proj.name} query={search} />
                    </span>
                    <span className="cm-command-meta-note">{proj.components.length} parts · {proj.updatedAt}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Dashboard: Actions */}
            <CommandGroup heading="Actions">
              {dashboardActions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={`${action.label} dashboard action`}
                  onSelect={() => handleExecute(action.perform)}
                >
                  <div className="cm-command-item-icon">{action.icon}</div>
                  <span className="cm-command-item-label">
                    <HighlightMatch text={action.label} query={search} />
                  </span>
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : (
          <>
            {/* Canvas/Editor: Full 16-component Catalog */}
            <CommandGroup heading="Components">
              {PARTS.map((part: PartDef) => (
                <CommandItem
                  key={part.id}
                  value={`${part.name} ${part.category} component part ${part.shortcut || ''}`}
                  onSelect={() => handleExecute(() => onSelectPart?.(part.id))}
                >
                  <div className="cm-command-item-icon">
                    {part.icon('currentColor')}
                  </div>
                  <span className="cm-command-item-label">
                    <HighlightMatch text={part.name} query={search} />
                  </span>
                  {part.shortcut && (
                    <CommandShortcut>{part.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Canvas/Editor: Actions */}
            <CommandGroup heading="Actions">
              {canvasActions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={`${action.label} canvas editor action`}
                  onSelect={() => handleExecute(action.perform)}
                >
                  <div className="cm-command-item-icon">{action.icon}</div>
                  <span className="cm-command-item-label">
                    <HighlightMatch text={action.label} query={search} />
                  </span>
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
