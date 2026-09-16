import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RailProps {
  active: string;
  onSelect: (item: string) => void;
}

export default function Rail({ active, onSelect }: RailProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <nav className="rail" aria-label="Main navigation">
        {/* Logo - click returns to Landing Page */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rail-logo cursor-pointer bg-transparent border-0 p-0 text-inherit hover:opacity-80 transition-opacity"
              onClick={() => onSelect('landing')}
              aria-label="Home / Landing"
            >
              <svg viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 3l8 4.6v9.8L16 24l-8-4.6V9.6L16 5z" />
                <circle cx="16" cy="16" r="4" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            CircuitMentor Home
          </TooltipContent>
        </Tooltip>

        {/* Project */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`rail-btn ${active === 'project' ? 'active' : ''}`}
              onClick={() => onSelect('project')}
              aria-label="Projects"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Projects Dashboard
          </TooltipContent>
        </Tooltip>

        {/* Components */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`rail-btn ${active === 'components' ? 'active' : ''}`}
              onClick={() => onSelect('components')}
              aria-label="Components"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Component Library (C)
          </TooltipContent>
        </Tooltip>

        {/* Wiring mode */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`rail-btn ${active === 'wire' ? 'active' : ''}`}
              onClick={() => onSelect('wire')}
              aria-label="Wire mode"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20L12 12L20 4" />
                <circle cx="4" cy="20" r="2" />
                <circle cx="20" cy="4" r="2" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Wiring Mode (W)
          </TooltipContent>
        </Tooltip>

        <div className="rail-spacer" />

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`rail-btn ${active === 'settings' ? 'active' : ''}`}
              onClick={() => onSelect('settings')}
              aria-label="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Settings & Preferences
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
