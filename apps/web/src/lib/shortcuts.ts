export const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export interface ShortcutItem {
  id: string;
  category: 'Palette' | 'Tools' | 'Quick-Place' | 'Editing' | 'View' | 'Actions';
  label: string;
  description: string;
  keys: {
    mac: string;
    win: string;
  };
}

export const SHORTCUTS: ShortcutItem[] = [
  // Palette
  {
    id: 'palette.open',
    category: 'Palette',
    label: 'Open Command Palette',
    description: 'Find components, run actions, search projects',
    keys: { mac: '⌘K', win: 'Ctrl+K' },
  },
  {
    id: 'palette.close',
    category: 'Palette',
    label: 'Close / Cancel',
    description: 'Close palette, cancel placement mode, or clear selection',
    keys: { mac: 'Esc', win: 'Esc' },
  },

  // Tools
  {
    id: 'tool.select',
    category: 'Tools',
    label: 'Select Tool',
    description: 'Pointer for selecting, moving, and editing circuit parts',
    keys: { mac: 'V', win: 'V' },
  },
  {
    id: 'tool.wire',
    category: 'Tools',
    label: 'Wire Tool',
    description: 'Crosshair tool for drawing electrical wire connections',
    keys: { mac: 'W', win: 'W' },
  },

  // Quick-Place
  {
    id: 'place.resistor',
    category: 'Quick-Place',
    label: 'Place Resistor',
    description: 'Ghost preview follows cursor; click canvas to place',
    keys: { mac: 'R', win: 'R' },
  },
  {
    id: 'place.led',
    category: 'Quick-Place',
    label: 'Place LED',
    description: 'Ghost preview follows cursor; click canvas to place',
    keys: { mac: 'L', win: 'L' },
  },
  {
    id: 'place.capacitor',
    category: 'Quick-Place',
    label: 'Place Capacitor',
    description: 'Ghost preview follows cursor; click canvas to place',
    keys: { mac: 'C', win: 'C' },
  },
  {
    id: 'place.battery',
    category: 'Quick-Place',
    label: 'Place 9V Battery',
    description: 'Ghost preview follows cursor; click canvas to place',
    keys: { mac: 'B', win: 'B' },
  },
  {
    id: 'place.arduino',
    category: 'Quick-Place',
    label: 'Place Arduino Uno R3',
    description: 'Ghost preview follows cursor; click canvas to place',
    keys: { mac: 'U', win: 'U' },
  },
  {
    id: 'place.ground',
    category: 'Quick-Place',
    label: 'Place Earth Ground',
    description: 'Ghost preview follows cursor; click canvas to place',
    keys: { mac: 'G', win: 'G' },
  },

  // Editing
  {
    id: 'edit.undo',
    category: 'Editing',
    label: 'Undo',
    description: 'Revert last circuit edit or position change',
    keys: { mac: '⌘Z', win: 'Ctrl+Z' },
  },
  {
    id: 'edit.redo',
    category: 'Editing',
    label: 'Redo',
    description: 'Reapply undone circuit action',
    keys: { mac: '⌘⇧Z', win: 'Ctrl+Y' },
  },
  {
    id: 'edit.copy',
    category: 'Editing',
    label: 'Copy Selection',
    description: 'Copy selected components to clipboard',
    keys: { mac: '⌘C', win: 'Ctrl+C' },
  },
  {
    id: 'edit.paste',
    category: 'Editing',
    label: 'Paste',
    description: 'Paste copied components with offset',
    keys: { mac: '⌘V', win: 'Ctrl+V' },
  },
  {
    id: 'edit.duplicate',
    category: 'Editing',
    label: 'Duplicate',
    description: 'Duplicate selected components immediately',
    keys: { mac: '⌘D', win: 'Ctrl+D' },
  },
  {
    id: 'edit.delete',
    category: 'Editing',
    label: 'Delete Selection',
    description: 'Remove selected components and connected wires',
    keys: { mac: '⌫ / Del', win: 'Del / Backspace' },
  },
  {
    id: 'edit.selectAll',
    category: 'Editing',
    label: 'Select All',
    description: 'Select all components on current canvas',
    keys: { mac: '⌘A', win: 'Ctrl+A' },
  },
  {
    id: 'edit.nudge',
    category: 'Editing',
    label: 'Nudge Selection (10px)',
    description: 'Move selected components by 1 grid pitch',
    keys: { mac: 'Arrows', win: 'Arrows' },
  },
  {
    id: 'edit.nudgeLarge',
    category: 'Editing',
    label: 'Nudge Selection (100px)',
    description: 'Move selected components by 10× grid pitch',
    keys: { mac: '⇧+Arrows', win: 'Shift+Arrows' },
  },
  {
    id: 'edit.rotate',
    category: 'Editing',
    label: 'Rotate 90°',
    description: 'Rotate selected components 90 degrees',
    keys: { mac: '[ / ] or R', win: '[ / ] or R' },
  },

  // View
  {
    id: 'view.zoom100',
    category: 'View',
    label: 'Zoom to 100%',
    description: 'Reset canvas zoom to default 100%',
    keys: { mac: '⌘0', win: 'Ctrl+0' },
  },
  {
    id: 'view.zoomFit',
    category: 'View',
    label: 'Zoom to Fit',
    description: 'Fit all circuit components into view',
    keys: { mac: '⌘1', win: 'Ctrl+1' },
  },
  {
    id: 'view.zoomIn',
    category: 'View',
    label: 'Zoom In',
    description: 'Increase canvas magnification',
    keys: { mac: '⌘+', win: 'Ctrl++' },
  },
  {
    id: 'view.zoomOut',
    category: 'View',
    label: 'Zoom Out',
    description: 'Decrease canvas magnification',
    keys: { mac: '⌘-', win: 'Ctrl+-' },
  },
  {
    id: 'view.pan',
    category: 'View',
    label: 'Pan Canvas',
    description: 'Hold space and drag to pan viewport',
    keys: { mac: 'Space (hold)', win: 'Space (hold)' },
  },

  // Actions
  {
    id: 'action.runSimulation',
    category: 'Actions',
    label: 'Run / Halt Simulation',
    description: 'Start or pause local SPICE / MNA electrical solver',
    keys: { mac: '⌘R', win: 'Ctrl+R' },
  },
  {
    id: 'action.checkRules',
    category: 'Actions',
    label: 'Check Electrical Rules (ERC)',
    description: 'Run 10 continuous hardware rules and open Issues tab',
    keys: { mac: '⌘E', win: 'Ctrl+E' },
  },
  {
    id: 'action.save',
    category: 'Actions',
    label: 'Save Project',
    description: 'Persist current schematic and netlist state',
    keys: { mac: '⌘S', win: 'Ctrl+S' },
  },
  {
    id: 'action.toggleMentor',
    category: 'Actions',
    label: 'Toggle AI Mentor',
    description: 'Open or close the AI Socratic Mentor panel',
    keys: { mac: '⌘/', win: 'Ctrl+/' },
  },
  {
    id: 'action.toggleLibrary',
    category: 'Actions',
    label: 'Toggle Library',
    description: 'Show or hide the components catalog sidebar',
    keys: { mac: '⌘\\', win: 'Ctrl+\\' },
  },
  {
    id: 'action.shortcutsHelp',
    category: 'Actions',
    label: 'Shortcuts Help',
    description: 'Open keyboard shortcuts sheet',
    keys: { mac: '?', win: '?' },
  },
];

export function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  if (target.closest('input, textarea, select, [contenteditable="true"], [role="combobox"]')) return true;
  return false;
}

export function getShortcutKeyDisplay(item: ShortcutItem, platformIsMac: boolean = isMac): string {
  return platformIsMac ? item.keys.mac : item.keys.win;
}
