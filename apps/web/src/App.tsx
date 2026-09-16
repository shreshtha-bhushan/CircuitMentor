import { useState, useCallback, useMemo, useEffect } from 'react';
import Rail from './components/Rail';
import Library from './components/Library';
import Canvas, { type WireConnection } from './components/Canvas';
import Inspector from './components/Inspector';
import CodeEditor from './components/CodeEditor';
import MentorDock from './components/MentorDock';
import ErcFindings from './components/ErcFindings';
import CommandPalette from './components/CommandPalette';
import SmallScreenNotice from './components/SmallScreenNotice';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ShortcutsHelpSheet from './components/ShortcutsHelpSheet';
import { isInputElement } from './lib/shortcuts';
import { getPartMeta } from './lib/parts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

export interface PlacedComponent {
  id: string;
  partId: string;
  designator: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  params: Record<string, string>;
}

export interface ErcFinding {
  id: string;
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  detail: string;
  anchorId: string;
}

export interface ProjectData {
  id: string;
  name: string;
  updatedAt: string;
  components: PlacedComponent[];
  wires: WireConnection[];
  findings: ErcFinding[];
}

// 54-Component Dense Circuit for Performance Testing
const DENSE_COMPONENTS: PlacedComponent[] = Array.from({ length: 54 }, (_, i) => {
  const row = Math.floor(i / 9);
  const col = i % 9;
  const kinds = ['resistor.axial', 'led.5mm.red', 'capacitor.ceramic', 'diode.1n4007', 'potentiometer', 'resistor.axial'];
  const kind = kinds[i % kinds.length]!;
  const designators = ['R', 'D', 'C', 'D', 'RV', 'R'];
  const des = `${designators[i % designators.length]}${i + 1}`;
  return {
    id: `cd_${i + 1}`,
    partId: kind,
    designator: des,
    name: kind === 'resistor.axial' ? 'Resistor' : kind === 'led.5mm.red' ? 'LED' : kind === 'capacitor.ceramic' ? 'Capacitor' : kind === 'diode.1n4007' ? 'Diode' : 'Potentiometer',
    x: 100 + col * 90,
    y: 80 + row * 75,
    rotation: 0,
    params: kind === 'resistor.axial' ? { resistance: '10 kΩ' } : kind === 'capacitor.ceramic' ? { capacitance: '100 nF' } : {},
  };
});

// Dynamic Electrical Rules Check (ERC) Evaluator
function evaluateErc(components: PlacedComponent[], wires: WireConnection[]): ErcFinding[] {
  const findings: ErcFinding[] = [];
  const leds = components.filter((c) => c.partId === 'led.5mm.red');

  for (const led of leds) {
    const connectedWires = wires.filter((w) => w.fromId === led.id || w.toId === led.id);
    if (connectedWires.length === 0) continue;

    // Check if directly wired to 9V battery anode without a resistor
    const directBatteryWire = connectedWires.find((w) => {
      const otherId = w.fromId === led.id ? w.toId : w.fromId;
      const otherPin = w.fromId === led.id ? w.toPin : w.fromPin;
      const otherComp = components.find((c) => c.id === otherId);
      return otherComp?.partId === 'battery.9v' && otherPin === 0;
    });

    // Check if connected to any current-limiting resistor
    const hasResistor = connectedWires.some((w) => {
      const otherId = w.fromId === led.id ? w.toId : w.fromId;
      const otherComp = components.find((c) => c.id === otherId);
      return otherComp?.partId === 'resistor.axial' || otherComp?.partId === 'potentiometer';
    });

    if (directBatteryWire && !hasResistor) {
      findings.push({
        id: `f_led_${led.id}`,
        ruleId: 'LED_NO_CURRENT_LIMIT',
        severity: 'error',
        title: `${led.designator} has no current-limiting resistor`,
        detail: 'At 9 V the forward current is about 71 mA. This part is rated for 20 mA maximum. Place a resistor in series to protect the LED.',
        anchorId: led.id,
      });
    }
  }

  return findings;
}

// Initial Starter Projects for Dashboard
const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: 'proj-1',
    name: 'LED Current Limiter Lab',
    updatedAt: 'Edited 12m ago',
    components: [
      { id: 'c1', partId: 'battery.9v', designator: 'V1', name: '9V Battery', x: 120, y: 200, rotation: 0, params: { voltage: '9 V' } },
      { id: 'c2', partId: 'resistor.axial', designator: 'R1', name: 'Resistor', x: 300, y: 120, rotation: 0, params: { resistance: '220 Ω', tolerance: '5 %', power: '0.25 W' } },
      { id: 'c3', partId: 'led.5mm.red', designator: 'D1', name: 'LED (Red 5mm)', x: 480, y: 120, rotation: 0, params: { color: 'Red', forward_voltage: '2.0 V', max_current: '20 mA' } },
      { id: 'c4', partId: 'ground', designator: 'GND', name: 'Earth Ground', x: 300, y: 320, rotation: 0, params: {} },
    ],
    // Initially V1 is directly connected to D1 without R1, causing the active overcurrent finding
    wires: [
      { id: 'w1', fromId: 'c1', fromPin: 0, toId: 'c3', toPin: 0, netType: 'vcc' },
      { id: 'w2', fromId: 'c3', fromPin: 1, toId: 'c4', toPin: 0, netType: 'gnd' },
      { id: 'w3', fromId: 'c1', fromPin: 1, toId: 'c4', toPin: 0, netType: 'gnd' },
    ],
    findings: [
      {
        id: 'f1',
        ruleId: 'LED_NO_CURRENT_LIMIT',
        severity: 'error',
        title: 'D1 has no current-limiting resistor',
        detail: 'At 9 V the forward current is about 71 mA. This part is rated for 20 mA maximum.',
        anchorId: 'c3',
      },
    ],
  },
  {
    id: 'proj-dense',
    name: 'Dense Matrix System (54 Components Stress Test)',
    updatedAt: 'Edited 2m ago',
    components: DENSE_COMPONENTS,
    wires: [],
    findings: [],
  },
  {
    id: 'proj-2',
    name: 'Automatic Dustbin (Arduino + Servo)',
    updatedAt: 'Edited 2h ago',
    components: [
      { id: 'c20', partId: 'arduino.uno', designator: 'U1', name: 'Arduino Uno R3', x: 260, y: 160, rotation: 0, params: { mcu: 'ATmega328P', clock: '16 MHz' } },
      { id: 'c21', partId: 'sensor.ultrasonic', designator: 'S1', name: 'HC-SR04 Ultrasonic', x: 100, y: 100, rotation: 0, params: { range: '2cm - 400cm' } },
      { id: 'c22', partId: 'servo', designator: 'M1', name: 'Micro Servo 9g', x: 440, y: 180, rotation: 0, params: { torque: '1.8 kg·cm' } },
      { id: 'c23', partId: 'ground', designator: 'GND', name: 'Earth Ground', x: 260, y: 300, rotation: 0, params: {} },
    ],
    wires: [
      { id: 'w20', fromId: 'c20', fromPin: 0, toId: 'c21', toPin: 0, netType: 'vcc' },
      { id: 'w21', fromId: 'c20', fromPin: 1, toId: 'c23', toPin: 0, netType: 'gnd' },
    ],
    findings: [],
  },
  {
    id: 'proj-3',
    name: 'Dual Rail Power Supply Network',
    updatedAt: 'Edited yesterday',
    components: [
      { id: 'c30', partId: 'battery.9v', designator: 'V1', name: '9V Battery', x: 120, y: 180, rotation: 0, params: { voltage: '9 V' } },
      { id: 'c31', partId: 'potentiometer', designator: 'RV1', name: 'Potentiometer', x: 280, y: 140, rotation: 0, params: { resistance: '10 kΩ' } },
      { id: 'c32', partId: 'capacitor.ceramic', designator: 'C1', name: 'Capacitor', x: 440, y: 180, rotation: 0, params: { capacitance: '100 nF' } },
      { id: 'c33', partId: 'ground', designator: 'GND', name: 'Earth Ground', x: 280, y: 280, rotation: 0, params: {} },
    ],
    wires: [
      { id: 'w30', fromId: 'c30', fromPin: 0, toId: 'c31', toPin: 0, netType: 'vcc' },
      { id: 'w31', fromId: 'c31', fromPin: 1, toId: 'c32', toPin: 0, netType: 'signal' },
      { id: 'w32', fromId: 'c32', fromPin: 1, toId: 'c33', toPin: 0, netType: 'gnd' },
    ],
    findings: [
      {
        id: 'f2',
        ruleId: 'MISSING_DECOUPLING',
        severity: 'info',
        title: 'No decoupling capacitor on supply rail',
        detail: 'A 100 nF ceramic capacitor near the IC helps filter transient supply noise.',
        anchorId: 'c30',
      },
    ],
  },
];

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'login' | 'dashboard' | 'editor'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cm_auth') === 'true';
  });
  const [projects, setProjects] = useState<ProjectData[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');

  // Editor shell states
  const [activeRailItem, setActiveRailItem] = useState('components');
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const [dockTab, setDockTab] = useState<'inspector' | 'code' | 'mentor' | 'erc'>('inspector');

  // Selection & tool states
  const [selectedIds, setSelectedIds] = useState<string[]>(['c2']);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedLibraryPart, setSelectedLibraryPart] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'wire'>('select');
  const [isSimulating, setIsSimulating] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Undo / Redo Stacks
  const [undoStack, setUndoStack] = useState<Array<{ components: PlacedComponent[]; wires: WireConnection[] }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ components: PlacedComponent[]; wires: WireConnection[] }>>([]);

  // Active Project
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0]!;
  }, [projects, activeProjectId]);

  const selectedComponent = useMemo(() => {
    return currentProject.components.find((c) => c.id === selectedIds[0]) || null;
  }, [currentProject.components, selectedIds]);

  // Push Snapshot to Undo Stack before mutations
  const pushHistory = useCallback(() => {
    setUndoStack((prev) => [
      ...prev.slice(-30),
      {
        components: currentProject.components,
        wires: currentProject.wires,
      },
    ]);
    setRedoStack([]);
  }, [currentProject.components, currentProject.wires]);

  // Undo Action
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1]!;
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [
      ...prev,
      {
        components: currentProject.components,
        wires: currentProject.wires,
      },
    ]);
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== activeProjectId) return p;
        return {
          ...p,
          components: previous.components,
          wires: previous.wires,
          findings: evaluateErc(previous.components, previous.wires),
        };
      })
    );
  }, [undoStack, currentProject.components, currentProject.wires, activeProjectId]);

  // Redo Action
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1]!;
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [
      ...prev,
      {
        components: currentProject.components,
        wires: currentProject.wires,
      },
    ]);
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== activeProjectId) return p;
        return {
          ...p,
          components: next.components,
          wires: next.wires,
          findings: evaluateErc(next.components, next.wires),
        };
      })
    );
  }, [redoStack, currentProject.components, currentProject.wires, activeProjectId]);

  // Auth Handlers
  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    sessionStorage.setItem('cm_auth', 'true');
    setScreen('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cm_auth');
    setScreen('landing');
  }, []);

  // Open Project handler
  const handleOpenProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    setScreen('editor');
    setUndoStack([]);
    setRedoStack([]);
    const target = projects.find((p) => p.id === projectId);
    if (target && target.components.length > 0) {
      setSelectedIds([target.components[0]!.id]);
    } else {
      setSelectedIds([]);
    }
  }, [projects]);

  // Create Project handler
  const handleCreateProject = useCallback((name: string, template: string = 'blank') => {
    let starterComps: PlacedComponent[] = [];
    let starterWires: WireConnection[] = [];

    if (template === 'led') {
      starterComps = [
        { id: `c_${Date.now()}_1`, partId: 'battery.9v', designator: 'V1', name: '9V Battery', x: 120, y: 200, rotation: 0, params: { voltage: '9 V' } },
        { id: `c_${Date.now()}_2`, partId: 'resistor.axial', designator: 'R1', name: 'Resistor', x: 280, y: 140, rotation: 0, params: { resistance: '220 Ω' } },
        { id: `c_${Date.now()}_3`, partId: 'led.5mm.red', designator: 'D1', name: 'LED (Red)', x: 440, y: 140, rotation: 0, params: { color: 'Red' } },
        { id: `c_${Date.now()}_4`, partId: 'ground', designator: 'GND', name: 'Earth Ground', x: 280, y: 300, rotation: 0, params: {} },
      ];
      starterWires = [
        { id: `w_${Date.now()}_1`, fromId: starterComps[0]!.id, fromPin: 0, toId: starterComps[1]!.id, toPin: 0, netType: 'vcc' },
        { id: `w_${Date.now()}_2`, fromId: starterComps[1]!.id, fromPin: 1, toId: starterComps[2]!.id, toPin: 0, netType: 'signal' },
        { id: `w_${Date.now()}_3`, fromId: starterComps[2]!.id, fromPin: 1, toId: starterComps[3]!.id, toPin: 0, netType: 'gnd' },
      ];
    } else if (template === 'arduino') {
      starterComps = [
        { id: `c_${Date.now()}_1`, partId: 'arduino.uno', designator: 'U1', name: 'Arduino Uno R3', x: 240, y: 160, rotation: 0, params: { mcu: 'ATmega328P' } },
        { id: `c_${Date.now()}_2`, partId: 'sensor.ultrasonic', designator: 'S1', name: 'HC-SR04 Ultrasonic', x: 100, y: 100, rotation: 0, params: {} },
        { id: `c_${Date.now()}_3`, partId: 'ground', designator: 'GND', name: 'Earth Ground', x: 240, y: 300, rotation: 0, params: {} },
      ];
    }

    const newProj: ProjectData = {
      id: `proj_${Date.now()}`,
      name,
      updatedAt: 'Just now',
      components: starterComps,
      wires: starterWires,
      findings: evaluateErc(starterComps, starterWires),
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setUndoStack([]);
    setRedoStack([]);
    setScreen('editor');
    if (starterComps.length > 0) {
      setSelectedIds([starterComps[0]!.id]);
    } else {
      setSelectedIds([]);
    }
  }, []);

  // Update component positions after canvas drag
  const handleUpdateComponentPositions = useCallback(
    (updates: Array<{ id: string; x: number; y: number }>) => {
      pushHistory();
      const updateMap = new Map(updates.map((u) => [u.id, u]));
      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id !== activeProjectId) return p;
          return {
            ...p,
            components: p.components.map((c) => {
              const match = updateMap.get(c.id);
              return match ? { ...c, x: match.x, y: match.y } : c;
            }),
          };
        })
      );
    },
    [activeProjectId, pushHistory]
  );

  // Add Component to Canvas (via drag-and-drop or click-to-place)
  const handlePlaceComponent = useCallback(
    (partId: string, x: number, y: number) => {
      pushHistory();
      const meta = getPartMeta(partId);
      const prefix = meta?.prefix || 'U';
      const name = meta?.name || 'Component';
      const params = meta ? { ...meta.defaultParams } : {};

      const count = currentProject.components.filter((c) => c.partId === partId).length + 1;
      const des = prefix === 'GND' ? (count > 1 ? `GND${count}` : 'GND') : `${prefix}${count}`;

      const newComp: PlacedComponent = {
        id: `c_${Date.now()}`,
        partId,
        designator: des,
        name,
        x,
        y,
        rotation: 0,
        params,
      };

      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id !== activeProjectId) return p;
          const updatedComps = [...p.components, newComp];
          return {
            ...p,
            components: updatedComps,
            findings: evaluateErc(updatedComps, p.wires),
          };
        })
      );

      setSelectedIds([newComp.id]);
      setDockTab('inspector');
    },
    [pushHistory, currentProject.components, activeProjectId]
  );

  // Add Wire Connection
  const handleAddWire = useCallback(
    (fromId: string, fromPin: number, toId: string, toPin: number) => {
      pushHistory();
      const fromComp = currentProject.components.find((c) => c.id === fromId);
      const toComp = currentProject.components.find((c) => c.id === toId);

      // Determine wire semantic netType
      let netType: 'vcc' | 'gnd' | 'signal' = 'signal';
      if (
        (fromComp?.partId === 'battery.9v' && fromPin === 0) ||
        (toComp?.partId === 'battery.9v' && toPin === 0)
      ) {
        netType = 'vcc';
      } else if (
        fromComp?.partId === 'ground' ||
        toComp?.partId === 'ground' ||
        (fromComp?.partId === 'battery.9v' && fromPin === 1) ||
        (toComp?.partId === 'battery.9v' && toPin === 1)
      ) {
        netType = 'gnd';
      }

      const newWire: WireConnection = {
        id: `w_${Date.now()}`,
        fromId,
        fromPin,
        toId,
        toPin,
        netType,
      };

      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id !== activeProjectId) return p;
          const updatedWires = [...p.wires, newWire];
          return {
            ...p,
            wires: updatedWires,
            findings: evaluateErc(p.components, updatedWires),
          };
        })
      );
    },
    [pushHistory, currentProject.components, activeProjectId]
  );

  // Delete Wire Connection
  const handleDeleteWire = useCallback(
    (wireId: string) => {
      pushHistory();
      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id !== activeProjectId) return p;
          const updatedWires = p.wires.filter((w) => w.id !== wireId);
          return {
            ...p,
            wires: updatedWires,
            findings: evaluateErc(p.components, updatedWires),
          };
        })
      );
    },
    [pushHistory, activeProjectId]
  );

  // Component Selection (support single or shift-multi-select)
  const handleSelectComponent = useCallback((comp: PlacedComponent, isMulti: boolean) => {
    if (isMulti) {
      setSelectedIds((prev) =>
        prev.includes(comp.id) ? prev.filter((id) => id !== comp.id) : [...prev, comp.id]
      );
    } else {
      setSelectedIds([comp.id]);
    }
    setDockTab('inspector');
    setDockOpen(true);
  }, []);

  // Clear Selection
  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Delete Selected Components
  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    pushHistory();
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== activeProjectId) return p;
        const remainingComps = p.components.filter((c) => !selectedIds.includes(c.id));
        const remainingWires = p.wires.filter(
          (w) => !selectedIds.includes(w.fromId) && !selectedIds.includes(w.toId)
        );
        return {
          ...p,
          components: remainingComps,
          wires: remainingWires,
          findings: evaluateErc(remainingComps, remainingWires),
        };
      })
    );
    setSelectedIds([]);
  }, [pushHistory, selectedIds, activeProjectId]);

  // Rotate Selected Components
  const handleRotateSelected = useCallback(
    (deltaAngle: number = 90) => {
      if (selectedIds.length === 0) return;
      pushHistory();
      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id !== activeProjectId) return p;
          return {
            ...p,
            components: p.components.map((c) =>
              selectedIds.includes(c.id)
                ? { ...c, rotation: ((c.rotation || 0) + deltaAngle + 360) % 360 }
                : c
            ),
          };
        })
      );
    },
    [selectedIds, pushHistory, activeProjectId]
  );

  // Nudge Selected Components (with Arrow Keys)
  const handleNudgeSelected = useCallback(
    (dx: number, dy: number) => {
      if (selectedIds.length === 0) return;
      pushHistory();
      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id !== activeProjectId) return p;
          return {
            ...p,
            components: p.components.map((c) =>
              selectedIds.includes(c.id)
                ? { ...c, x: Math.max(20, c.x + dx), y: Math.max(20, c.y + dy) }
                : c
            ),
          };
        })
      );
    },
    [selectedIds, pushHistory, activeProjectId]
  );

  // Duplicate Selected Components (⌘D)
  const handleDuplicate = useCallback(() => {
    if (selectedIds.length === 0) return;
    pushHistory();
    const toDuplicate = currentProject.components.filter((c) => selectedIds.includes(c.id));
    const newComps: PlacedComponent[] = [];

    for (const comp of toDuplicate) {
      const meta = getPartMeta(comp.partId);
      const prefix = meta?.prefix || 'U';
      const count = currentProject.components.length + newComps.length + 1;
      const newId = `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      newComps.push({
        ...comp,
        id: newId,
        designator: `${prefix}${count}`,
        x: comp.x + 40,
        y: comp.y + 40,
      });
    }

    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== activeProjectId) return p;
        const updated = [...p.components, ...newComps];
        return {
          ...p,
          components: updated,
          findings: evaluateErc(updated, p.wires),
        };
      })
    );
    setSelectedIds(newComps.map((c) => c.id));
  }, [selectedIds, pushHistory, currentProject.components, activeProjectId]);

  // Select All Components (⌘A)
  const handleSelectAll = useCallback(() => {
    setSelectedIds(currentProject.components.map((c) => c.id));
  }, [currentProject.components]);

  // Toggle Simulation (⌘R)
  const handleToggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  // Save Project (⌘S)
  const handleSaveProject = useCallback(() => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, updatedAt: 'Saved just now' } : p))
    );
    setSaveToast(`Saved "${currentProject.name}"`);
    setTimeout(() => setSaveToast(null), 2500);
  }, [activeProjectId, currentProject.name]);

  // Run ERC / Open Issues Tab (⌘E)
  const handleRunErc = useCallback(() => {
    setDockTab('erc');
    setDockOpen(true);
  }, []);

  // Quick action: Add Arduino Uno from Code tab empty state
  const handleAddArduino = useCallback(() => {
    handlePlaceComponent('arduino.uno', 280, 180);
    setDockTab('code');
  }, [handlePlaceComponent]);

  // ERC Click & Hover
  const handleErcClick = useCallback((finding: ErcFinding) => {
    setHighlightedId(finding.anchorId);
    setDockTab('mentor');
    setDockOpen(true);
    setTimeout(() => setHighlightedId(null), 3500);
  }, []);

  const handleErcHover = useCallback((finding: ErcFinding | null) => {
    setHighlightedId(finding?.anchorId ?? null);
  }, []);

  // Centralized Keyboard Shortcut Handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      const inInput = isInputElement(e.target);

      // Global ⌘K / Ctrl+K (opens Command Palette everywhere)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Global ⌘S / Ctrl+S (save project everywhere)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveProject();
        return;
      }

      // Global Escape handling
      if (e.key === 'Escape') {
        if (shortcutsHelpOpen) {
          setShortcutsHelpOpen(false);
          return;
        }
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
          return;
        }
        if (selectedLibraryPart) {
          setSelectedLibraryPart(null);
          return;
        }
        if (selectedIds.length > 0) {
          setSelectedIds([]);
          return;
        }
        return;
      }

      // Input Focus Guard: Do NOT intercept typing in input fields!
      if (inInput) {
        return;
      }

      // Shortcuts Help Sheet (?)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsHelpOpen(true);
        return;
      }

      // The remaining shortcuts only apply when in the Editor screen
      if (screen !== 'editor') {
        return;
      }

      // Undo: ⌘Z (no Shift) / Ctrl+Z
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: ⌘⇧Z or Ctrl+Y
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') ||
        (!navigator.userAgent.includes('Mac') && e.ctrlKey && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Duplicate: ⌘D / Ctrl+D (prevents bookmarking)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicate();
        return;
      }

      // Select All: ⌘A / Ctrl+A
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleSelectAll();
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteSelected();
        return;
      }

      // Rotate: [ (CCW -90) and ] (CW +90)
      if (e.key === '[') {
        e.preventDefault();
        handleRotateSelected(-90);
        return;
      }
      if (e.key === ']') {
        e.preventDefault();
        handleRotateSelected(90);
        return;
      }

      // Run / Toggle Simulation: ⌘R / Ctrl+R (prevents browser reload)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleToggleSimulation();
        return;
      }

      // Run ERC: ⌘E / Ctrl+E
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleRunErc();
        return;
      }

      // Toggle Right Dock: ⌘/ / Ctrl+/
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setDockOpen((prev) => !prev);
        return;
      }

      // Toggle Left Library: ⌘\ / Ctrl+\
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setLibraryOpen((prev) => !prev);
        return;
      }

      // Arrow Key Nudging
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleNudgeSelected(0, e.shiftKey ? -50 : -20);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNudgeSelected(0, e.shiftKey ? 50 : 20);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNudgeSelected(e.shiftKey ? -50 : -20, 0);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNudgeSelected(e.shiftKey ? 50 : 20, 0);
        return;
      }

      // Single-Key Tool Switches and Part Quick-Placement (no modifiers)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'v') {
          setActiveTool('select');
          return;
        }
        if (key === 'w') {
          setActiveTool('wire');
          return;
        }
        if (key === 'r') {
          setSelectedLibraryPart((prev) => (prev === 'resistor.axial' ? null : 'resistor.axial'));
          return;
        }
        if (key === 'l') {
          setSelectedLibraryPart((prev) => (prev === 'led.5mm.red' ? null : 'led.5mm.red'));
          return;
        }
        if (key === 'c') {
          setSelectedLibraryPart((prev) => (prev === 'capacitor.ceramic' ? null : 'capacitor.ceramic'));
          return;
        }
        if (key === 'b') {
          setSelectedLibraryPart((prev) => (prev === 'battery.9v' ? null : 'battery.9v'));
          return;
        }
        if (key === 'u') {
          setSelectedLibraryPart((prev) => (prev === 'arduino.uno' ? null : 'arduino.uno'));
          return;
        }
        if (key === 'g') {
          setSelectedLibraryPart((prev) => (prev === 'ground' ? null : 'ground'));
          return;
        }
      }
    },
    [
      shortcutsHelpOpen,
      commandPaletteOpen,
      selectedLibraryPart,
      selectedIds.length,
      screen,
      handleSaveProject,
      handleUndo,
      handleRedo,
      handleDuplicate,
      handleSelectAll,
      handleDeleteSelected,
      handleRotateSelected,
      handleToggleSimulation,
      handleRunErc,
      handleNudgeSelected,
    ]
  );

  // Global window shortcut listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onKeyDown={handleKeyDown} tabIndex={-1} className="app-root">
      {/* 1. Landing Page Screen */}
      {screen === 'landing' ? (
        <LandingPage
          onOpenApp={() => setScreen('dashboard')}
          onOpenEditor={() => setScreen('editor')}
          onOpenLogin={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('cm_auth');
            setScreen('login');
          }}
          isAuthenticated={isAuthenticated}
        />
      ) : screen === 'login' ? (
        /* 2. Login Page Screen (shadcn login-03 pattern) */
        <LoginPage
          isAuthenticated={isAuthenticated}
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={() => setScreen('landing')}
        />
      ) : screen === 'dashboard' ? (
        /* 3. Projects Dashboard Screen */
        <Dashboard
          projects={projects}
          onOpenProject={handleOpenProject}
          onCreateProject={handleCreateProject}
          onNavigateHome={() => setScreen('landing')}
        />
      ) : (
        /* 4. Main Editor Shell */
        <div className="editor-shell">
          {/* Rail: Far-left Icon Bar (56px) */}
          <Rail
            active={activeRailItem}
            onSelect={(item) => {
              if (item === 'landing') {
                setScreen('landing');
                return;
              }
              if (item === 'project') {
                setScreen('dashboard');
                return;
              }
              setActiveRailItem(item);
              if (item === 'components') {
                setLibraryOpen((prev) => !prev);
              }
            }}
          />

          {/* Canvas: Full-bleed background (--void #000000) underlaying detached sidebars */}
          <Canvas
            components={currentProject.components}
            wires={currentProject.wires}
            selectedIds={selectedIds}
            highlightedId={highlightedId}
            findings={currentProject.findings}
            selectedLibraryPart={selectedLibraryPart}
            onSelectComponent={handleSelectComponent}
            onClearSelection={handleClearSelection}
            onUpdateComponentPositions={handleUpdateComponentPositions}
            onPlaceComponent={handlePlaceComponent}
            onAddWire={handleAddWire}
            onDeleteWire={handleDeleteWire}
            onDeleteSelected={handleDeleteSelected}
            onClearSelectedLibraryPart={() => setSelectedLibraryPart(null)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            isSimulating={isSimulating}
            onToggleSimulation={handleToggleSimulation}
            onOpenErc={handleRunErc}
            activeTool={activeTool}
            onSelectTool={setActiveTool}
          />

          {/* Component Library: Detached Glass Sidebar Card (280px) */}
          <Library
            className={`library-panel ${libraryOpen ? 'library-open' : 'library-closed'}`}
            selectedPart={selectedLibraryPart}
            onSelectPart={setSelectedLibraryPart}
          />

          {/* Right Dock: Detached Glass Sidebar Card (360px) */}
          <aside className={`dock ${dockOpen ? 'dock-open' : 'dock-closed'}`} aria-label="Inspector, Code and AI Mentor">
            {/* 4-Tab Bar: [ Properties | Code | AI Mentor | Issues (N) ] */}
            <Tabs
              value={dockTab}
              onValueChange={(val) => setDockTab(val as 'inspector' | 'code' | 'mentor' | 'erc')}
              className="flex flex-col h-full w-full"
            >
              <div className="dock-tabs-container">
                <TabsList className="dock-tabs">
                  <TabsTrigger
                    value="inspector"
                    id="tab-properties"
                    aria-controls="panel-properties"
                    className={`dock-tab ${dockTab === 'inspector' ? 'active' : ''}`}
                  >
                    Properties
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    id="tab-code"
                    aria-controls="panel-code"
                    className={`dock-tab ${dockTab === 'code' ? 'active' : ''}`}
                  >
                    Code
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentor"
                    id="tab-mentor"
                    aria-controls="panel-mentor"
                    className={`dock-tab ${dockTab === 'mentor' ? 'active' : ''}`}
                  >
                    AI Mentor
                  </TabsTrigger>
                  <TabsTrigger
                    value="erc"
                    id="tab-erc"
                    aria-controls="panel-erc"
                    className={`dock-tab ${dockTab === 'erc' ? 'active' : ''}`}
                  >
                    <span>Issues</span>
                    {currentProject.findings.length > 0 && (
                      <span className="dock-issues-badge" aria-label={`${currentProject.findings.length} issues`}>
                        {currentProject.findings.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Sliding 2px blue indicator bar across 4 tabs */}
                <div className={`dock-tab-slider tab-count-4 slider-${dockTab}`} />
              </div>

              {/* Dock Content Body */}
              <div
                className="dock-content"
                role="tabpanel"
                id={`panel-${dockTab}`}
                aria-labelledby={`tab-${dockTab}`}
              >
                <TabsContent value="inspector" className="m-0 h-full p-0 outline-none">
                  <Inspector
                    component={selectedComponent}
                    wires={currentProject.wires}
                    allComponents={currentProject.components}
                  />
                </TabsContent>
                <TabsContent value="code" className="m-0 h-full p-0 outline-none">
                  <CodeEditor
                    components={currentProject.components}
                    onAddMcu={handleAddArduino}
                  />
                </TabsContent>
                <TabsContent value="erc" className="m-0 h-full p-0 outline-none">
                  <ErcFindings
                    findings={currentProject.findings}
                    onFindingClick={handleErcClick}
                    onFindingHover={handleErcHover}
                  />
                </TabsContent>
                <TabsContent value="mentor" className="m-0 h-full p-0 outline-none">
                  <MentorDock selectedComponent={selectedComponent} />
                </TabsContent>
              </div>
            </Tabs>
          </aside>

          {/* Tablet/Mobile dock & library toggle triggers */}
          <div className="mobile-toggles">
            <button
              className={`mobile-toggle-btn ${libraryOpen ? 'active' : ''}`}
              onClick={() => setLibraryOpen((prev) => !prev)}
              aria-label="Toggle component library"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              className={`mobile-toggle-btn ${dockOpen ? 'active' : ''}`}
              onClick={() => setDockOpen((prev) => !prev)}
              aria-label="Toggle inspector dock"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Unsupported Screen Floor (< 768px) Notice */}
      <SmallScreenNotice />

      {/* Spotlight Command Palette (⌘K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        context={screen === 'dashboard' ? 'dashboard' : 'editor'}
        onSelectPart={(partId) => {
          setSelectedLibraryPart(partId);
          setScreen('editor');
        }}
        onRunSimulation={handleToggleSimulation}
        onRunErc={handleRunErc}
        onSaveProject={handleSaveProject}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomFit={() => {
          const fitBtn = document.querySelector('[aria-label="Zoom to fit"]') as HTMLButtonElement | null;
          fitBtn?.click();
        }}
        onZoom100={() => {
          const resetBtn = document.querySelector('[aria-label="Reset zoom (100%)"]') as HTMLButtonElement | null;
          resetBtn?.click();
        }}
        onToggleLibrary={() => setLibraryOpen((prev) => !prev)}
        onToggleInspector={() => setDockOpen((prev) => !prev)}
        onOpenMentor={() => {
          setDockTab('mentor');
          setDockOpen(true);
        }}
        onOpenShortcutsHelp={() => setShortcutsHelpOpen(true)}
        onNewProject={() => {
          handleCreateProject('Untitled Project');
        }}
        projects={projects}
        onOpenProject={(id) => handleOpenProject(id)}
        onCreateProject={() => handleCreateProject('New Project')}
        onNavigateHome={() => setScreen('landing')}
      />

      {/* Shortcuts Help Sheet (?) */}
      <ShortcutsHelpSheet
        open={shortcutsHelpOpen}
        onClose={() => setShortcutsHelpOpen(false)}
      />

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="cm-save-toast" role="status" aria-live="polite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}
