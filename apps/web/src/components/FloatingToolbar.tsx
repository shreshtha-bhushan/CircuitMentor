import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isMac } from '@/lib/shortcuts';

interface FloatingToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset?: () => void;
  ercCount: number;
  onOpenErc?: () => void;
  activeTool?: 'select' | 'wire';
  onSelectTool?: (tool: 'select' | 'wire') => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
}

export default function FloatingToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  ercCount,
  onOpenErc,
  activeTool = 'select',
  onSelectTool,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  isSimulating = false,
  onToggleSimulation,
}: FloatingToolbarProps) {
  return (
    <TooltipProvider delayDuration={140} skipDelayDuration={0}>
      <div className="canvas-toolbar-pill glass" role="toolbar" aria-label="Canvas controls">
        {/* Cluster 1: [ Wire | Select ] */}
        <div className="toolbar-cluster" role="group" aria-label="Editing tools">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={`toolbar-btn ${activeTool === 'wire' ? 'active' : ''}`}
                onClick={() => onSelectTool?.('wire')}
                aria-label="Wire tool"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20L12 12L20 4" />
                  <circle cx="4" cy="20" r="2.5" />
                  <circle cx="20" cy="4" r="2.5" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              Wire Tool (W)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={`toolbar-btn ${activeTool === 'select' ? 'active' : ''}`}
                onClick={() => onSelectTool?.('select')}
                aria-label="Select tool"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3l7 18 3-7 7-3L3 3z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              Select Tool (V)
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="toolbar-divider" />

        {/* Cluster 2: [ Undo | Redo ] */}
        <div className="toolbar-cluster" role="group" aria-label="History">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={`toolbar-btn ${!canUndo ? 'opacity-40 cursor-not-allowed' : ''}`}
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 14L4 9l5-5" />
                  <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {isMac ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={`toolbar-btn ${!canRedo ? 'opacity-40 cursor-not-allowed' : ''}`}
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14l5-5-5-5" />
                  <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {isMac ? 'Redo (⌘⇧Z)' : 'Redo (Ctrl+Y)'}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="toolbar-divider" />

        {/* Cluster 3: [ – 100% + ] */}
        <div className="toolbar-cluster zoom-cluster" role="group" aria-label="Zoom controls">
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="toolbar-btn" onClick={onZoomOut} aria-label="Zoom out">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {isMac ? 'Zoom Out (⌘-)' : 'Zoom Out (Ctrl+-)'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="toolbar-zoom-readout"
                onClick={onZoomReset}
                aria-label="Reset zoom to 100%"
              >
                {zoom}%
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {isMac ? 'Reset Zoom (⌘0)' : 'Reset Zoom (Ctrl+0)'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="toolbar-btn" onClick={onZoomIn} aria-label="Zoom in">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {isMac ? 'Zoom In (⌘+)' : 'Zoom In (Ctrl++)'}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="toolbar-divider" />

        {/* Cluster 4: [ ▶ Run Simulation ] + Separate Issues Pill */}
        <div className="toolbar-cluster sim-cluster" role="group" aria-label="Simulation and Findings">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={`toolbar-run-btn ${isSimulating ? 'running' : ''}`}
                onClick={onToggleSimulation}
                aria-label={isSimulating ? 'Halt simulation' : 'Run simulation'}
              >
                {isSimulating ? (
                  <>
                    <span className="run-dot-pulsing" />
                    <span>Simulating</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {isSimulating
                ? (isMac ? 'Halt SPICE Simulation (⌘R)' : 'Halt SPICE Simulation (Ctrl+R)')
                : (isMac ? 'Run SPICE Simulation (⌘R)' : 'Run SPICE Simulation (Ctrl+R)')}
            </TooltipContent>
          </Tooltip>

          {/* Separated ERC Issues Pill with Breathing Room */}
          {ercCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="toolbar-erc-badge-pill"
                  onClick={onOpenErc}
                  aria-label={`${ercCount} electrical issues found. Click to open issues.`}
                >
                  <span className="erc-badge-dot" />
                  <span>{ercCount}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                {ercCount} electrical rule violations — click to view
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
