import React, { useState, useCallback, useRef, useEffect, useMemo, memo } from 'react';
import type { PlacedComponent, ErcFinding } from '../App';
import FloatingToolbar from './FloatingToolbar';
import { getPartMeta } from '@/lib/parts';

export interface WireConnection {
  id: string;
  fromId: string;
  fromPin: number;
  toId: string;
  toPin: number;
  netType: 'vcc' | 'gnd' | 'signal';
}

interface CanvasProps {
  components: PlacedComponent[];
  wires?: WireConnection[];
  selectedIds: string[];
  highlightedId: string | null;
  findings: ErcFinding[];
  selectedLibraryPart?: string | null;
  onSelectComponent: (comp: PlacedComponent, multi: boolean) => void;
  onClearSelection: () => void;
  onUpdateComponentPositions: (updates: Array<{ id: string; x: number; y: number }>) => void;
  onPlaceComponent?: (partId: string, x: number, y: number) => void;
  onAddWire?: (fromId: string, fromPin: number, toId: string, toPin: number) => void;
  onDeleteWire?: (wireId: string) => void;
  onDeleteSelected?: () => void;
  onClearSelectedLibraryPart?: () => void;
  // Toolbar and history action triggers
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
  onOpenErc?: () => void;
  activeTool?: 'select' | 'wire';
  onSelectTool?: (tool: 'select' | 'wire') => void;
}

const DEFAULT_WIRES: WireConnection[] = [
  { id: 'w1', fromId: 'c1', fromPin: 0, toId: 'c2', toPin: 0, netType: 'vcc' },
  { id: 'w2', fromId: 'c2', fromPin: 1, toId: 'c3', toPin: 0, netType: 'signal' },
  { id: 'w3', fromId: 'c3', fromPin: 1, toId: 'c4', toPin: 0, netType: 'gnd' },
  { id: 'w4', fromId: 'c1', fromPin: 1, toId: 'c4', toPin: 0, netType: 'gnd' },
];

export default function Canvas({
  components,
  wires = DEFAULT_WIRES,
  selectedIds,
  highlightedId,
  findings,
  selectedLibraryPart,
  onSelectComponent,
  onClearSelection,
  onUpdateComponentPositions,
  onPlaceComponent,
  onAddWire,
  onDeleteWire,
  onDeleteSelected,
  onClearSelectedLibraryPart,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  isSimulating = false,
  onToggleSimulation,
  onOpenErc,
  activeTool: controlledTool,
  onSelectTool,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 60, y: 40 });

  const handleZoomFit = useCallback(() => {
    if (components.length === 0) {
      setZoom(100);
      setPan({ x: 60, y: 40 });
      return;
    }
    const minX = Math.min(...components.map((c) => c.x - 40));
    const maxX = Math.max(...components.map((c) => c.x + 40));
    const minY = Math.min(...components.map((c) => c.y - 40));
    const maxY = Math.max(...components.map((c) => c.y + 40));

    const w = maxX - minX;
    const h = maxY - minY;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = (rect.width - 120) / Math.max(w, 200);
    const scaleY = (rect.height - 120) / Math.max(h, 200);
    const fitScale = Math.max(0.3, Math.min(2.5, Math.min(scaleX, scaleY)));
    setZoom(Math.round(fitScale * 100));
    setPan({
      x: Math.round((rect.width - (minX + maxX) * fitScale) / 2),
      y: Math.round((rect.height - (minY + maxY) * fitScale) / 2),
    });
  }, [components]);

  useEffect(() => {
    const onZoomFitEvent = () => handleZoomFit();
    const onZoom100Event = () => {
      setZoom(100);
      setPan({ x: 60, y: 40 });
    };
    window.addEventListener('cm-zoom-fit', onZoomFitEvent);
    window.addEventListener('cm-zoom-100', onZoom100Event);
    return () => {
      window.removeEventListener('cm-zoom-fit', onZoomFitEvent);
      window.removeEventListener('cm-zoom-100', onZoom100Event);
    };
  }, [handleZoomFit]);

  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [localTool, setLocalTool] = useState<'select' | 'wire'>('select');
  const activeTool = controlledTool !== undefined ? controlledTool : localTool;
  const handleSelectTool = useCallback(
    (tool: 'select' | 'wire') => {
      setLocalTool(tool);
      onSelectTool?.(tool);
    },
    [onSelectTool]
  );
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!selectedLibraryPart) {
      setGhostPos(null);
    }
  }, [selectedLibraryPart]);

  // Wire drawing rubberband state
  const [drawingWire, setDrawingWire] = useState<{
    fromId: string;
    fromPin: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Marquee state
  const [marquee, setMarquee] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Drag ref for direct DOM manipulation during gestures (single commit on release)
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    initialPositions: Map<string, { x: number; y: number; rot: number }>;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialPositions: new Map(),
  });

  const panRef = useRef({ x: 0, y: 0 });
  const panStartPos = useRef({ x: 0, y: 0 });
  const scale = zoom / 100;

  // Spacebar, Backspace, and Delete keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setIsSpacePressed(true);
      }
      if ((e.key === 'Backspace' || e.key === 'Delete') && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        if (selectedWireId) {
          onDeleteWire?.(selectedWireId);
          setSelectedWireId(null);
        } else if (onDeleteSelected) {
          onDeleteSelected();
        }
      }
      if (e.key === 'Escape') {
        setDrawingWire(null);
        onClearSelectedLibraryPart?.();
        setGhostPos(null);
        onClearSelection();
        setSelectedWireId(null);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed, selectedWireId, onDeleteWire, onDeleteSelected, onClearSelectedLibraryPart, onClearSelection]);

  // Two-Finger Trackpad Pan OR Cursor-Centered Wheel Zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;

      if (e.ctrlKey || e.metaKey) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - pan.x) / scale;
        const worldY = (mouseY - pan.y) / scale;

        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
        const newZoom = Math.max(20, Math.min(400, Math.round(zoom * zoomFactor)));
        const newScale = newZoom / 100;

        const newPanX = mouseX - worldX * newScale;
        const newPanY = mouseY - worldY * newScale;

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      } else {
        setPan((prev) => ({
          x: Math.round(prev.x - e.deltaX),
          y: Math.round(prev.y - e.deltaY),
        }));
      }
    },
    [pan, scale, zoom]
  );

  // Background Pointer Down: Pan, Marquee, or Cancel Drawing Wire
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // If actively drawing a wire, clicking empty canvas cancels wire creation
      if (drawingWire) {
        setDrawingWire(null);
        return;
      }

      // Middle-mouse drag OR Space+drag OR touch drag
      if (e.button === 1 || (e.button === 0 && isSpacePressed) || e.pointerType === 'touch') {
        setIsPanning(true);
        panRef.current = { x: e.clientX, y: e.clientY };
        panStartPos.current = { x: e.clientX, y: e.clientY };
        try {
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        return;
      }

      // Left click on empty canvas
      if (e.button === 0) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - pan.x) / scale;
        const canvasY = (e.clientY - rect.top - pan.y) / scale;

        if (e.shiftKey) {
          // Marquee selection
          setMarquee({
            startX: canvasX,
            startY: canvasY,
            currentX: canvasX,
            currentY: canvasY,
          });
        } else {
          setIsPanning(true);
          panRef.current = { x: e.clientX, y: e.clientY };
          panStartPos.current = { x: e.clientX, y: e.clientY };
        }

        try {
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    },
    [drawingWire, isSpacePressed, pan, scale]
  );

  // Component Pointer Down: Start immediate DOM drag
  const handleComponentPointerDown = useCallback(
    (e: React.PointerEvent, comp: PlacedComponent) => {
      e.stopPropagation();

      // If drawing a wire, don't initiate component drag
      if (drawingWire) return;

      if (isSpacePressed || e.button === 1) {
        setIsPanning(true);
        panRef.current = { x: e.clientX, y: e.clientY };
        panStartPos.current = { x: e.clientX, y: e.clientY };
        if (containerRef.current) {
          try {
            containerRef.current.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }
        return;
      }

      // Select component (if not already selected)
      if (!selectedIds.includes(comp.id)) {
        onSelectComponent(comp, e.shiftKey);
      }

      const idsToDrag = selectedIds.includes(comp.id) ? selectedIds : [comp.id];
      const initialMap = new Map<string, { x: number; y: number; rot: number }>();
      idsToDrag.forEach((id) => {
        const c = components.find((item) => item.id === id);
        if (c) initialMap.set(id, { x: c.x, y: c.y, rot: c.rotation });
      });

      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        initialPositions: initialMap,
      };

      try {
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    [components, drawingWire, isSpacePressed, onSelectComponent, selectedIds]
  );

  // Wire Pin Click: Start or finish wire connection
  const handlePinClick = useCallback(
    (e: React.PointerEvent, comp: PlacedComponent, pinIdx: number) => {
      e.stopPropagation();
      const pinOffsets = getPinPositions(comp.partId);
      const pinOffset = pinOffsets[pinIdx] ?? { x: 0, y: 0 };
      const pinCanvasX = comp.x + pinOffset.x;
      const pinCanvasY = comp.y + pinOffset.y;

      if (!drawingWire) {
        // Start wire drawing
        setDrawingWire({
          fromId: comp.id,
          fromPin: pinIdx,
          startX: pinCanvasX,
          startY: pinCanvasY,
          currentX: pinCanvasX,
          currentY: pinCanvasY,
        });
      } else {
        // Complete wire connection (cannot wire pin to itself)
        if (drawingWire.fromId !== comp.id || drawingWire.fromPin !== pinIdx) {
          onAddWire?.(drawingWire.fromId, drawingWire.fromPin, comp.id, pinIdx);
        }
        setDrawingWire(null);
      }
    },
    [drawingWire, onAddWire]
  );

  // Unified Pointer Move (60fps DOM drag, wire rubberband, marquee, and ghost preview)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // 1. Ghost Placement follow
      if (selectedLibraryPart && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - pan.x) / scale;
        const canvasY = (e.clientY - rect.top - pan.y) / scale;
        const snappedX = Math.round(canvasX / 10) * 10;
        const snappedY = Math.round(canvasY / 10) * 10;
        setGhostPos({ x: snappedX, y: snappedY });
      }

      // 2. Viewport Panning
      if (isPanning) {
        const dx = e.clientX - panRef.current.x;
        const dy = e.clientY - panRef.current.y;
        panRef.current = { x: e.clientX, y: e.clientY };
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        return;
      }

      // 3. Rubberband Wire drawing follow
      if (drawingWire) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - pan.x) / scale;
        const canvasY = (e.clientY - rect.top - pan.y) / scale;
        setDrawingWire((prev) => (prev ? { ...prev, currentX: Math.round(canvasX), currentY: Math.round(canvasY) } : null));
        return;
      }

      // 4. Marquee Select
      if (marquee) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - pan.x) / scale;
        const canvasY = (e.clientY - rect.top - pan.y) / scale;
        setMarquee((prev) => (prev ? { ...prev, currentX: canvasX, currentY: canvasY } : null));
        return;
      }

      // 5. Component Dragging (Direct DOM manipulation at 60fps)
      if (dragRef.current.isDragging) {
        const dx = (e.clientX - dragRef.current.startX) / scale;
        const dy = (e.clientY - dragRef.current.startY) / scale;

        dragRef.current.initialPositions.forEach((init, id) => {
          const domElem = document.getElementById(`comp-elem-${id}`);
          if (domElem) {
            const curX = Math.round(init.x + dx);
            const curY = Math.round(init.y + dy);
            domElem.setAttribute('transform', `translate(${curX}, ${curY}) rotate(${init.rot})`);
          }
        });
      }
    },
    [drawingWire, isPanning, marquee, pan, scale, selectedLibraryPart]
  );

  // Pointer Up: Release capture and commit final coordinates (single commit on release)
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isPanning) {
        setIsPanning(false);
        const dist = Math.hypot(e.clientX - panStartPos.current.x, e.clientY - panStartPos.current.y);

        // Click-to-place: if a library part was selected and user clicks empty canvas
        if (dist < 4 && selectedLibraryPart && onPlaceComponent && !isSpacePressed && e.button === 0) {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const canvasX = (e.clientX - rect.left - pan.x) / scale;
            const canvasY = (e.clientY - rect.top - pan.y) / scale;
            const snappedX = Math.round(canvasX / 10) * 10;
            const snappedY = Math.round(canvasY / 10) * 10;
            onPlaceComponent(selectedLibraryPart, snappedX, snappedY);
            onClearSelectedLibraryPart?.();
            setGhostPos(null);
          }
        } else if (dist < 4 && !isSpacePressed && e.button === 0) {
          onClearSelection();
          setSelectedWireId(null);
        }

        try {
          (e.currentTarget as Element).releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        return;
      }

      if (marquee) {
        const minX = Math.min(marquee.startX, marquee.currentX);
        const maxX = Math.max(marquee.startX, marquee.currentX);
        const minY = Math.min(marquee.startY, marquee.currentY);
        const maxY = Math.max(marquee.startY, marquee.currentY);

        if (maxX - minX > 6 || maxY - minY > 6) {
          const boxed = components.filter((c) => c.x >= minX && c.x <= maxX && c.y >= minY && c.y <= maxY);
          boxed.forEach((b) => onSelectComponent(b, true));
        }
        setMarquee(null);
        try {
          (e.currentTarget as Element).releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        return;
      }

      if (dragRef.current.isDragging) {
        const dx = (e.clientX - dragRef.current.startX) / scale;
        const dy = (e.clientY - dragRef.current.startY) / scale;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          const updates: Array<{ id: string; x: number; y: number }> = [];
          dragRef.current.initialPositions.forEach((init, id) => {
            updates.push({
              id,
              x: Math.round(init.x + dx),
              y: Math.round(init.y + dy),
            });
          });
          onUpdateComponentPositions(updates);
        }

        dragRef.current.isDragging = false;
        try {
          (e.currentTarget as Element).releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    },
    [
      components,
      isPanning,
      isSpacePressed,
      marquee,
      onClearSelectedLibraryPart,
      onClearSelection,
      onPlaceComponent,
      onSelectComponent,
      onUpdateComponentPositions,
      pan,
      scale,
      selectedLibraryPart,
    ]
  );

  // Drag and Drop from Component Library onto Canvas
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!containerRef.current || !onPlaceComponent) return;

      const partId = e.dataTransfer.getData('text/plain');
      if (!partId) return;

      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - pan.x) / scale;
      const canvasY = (e.clientY - rect.top - pan.y) / scale;

      // Snap drop coordinates to 10px pitch
      const snappedX = Math.round(canvasX / 10) * 10;
      const snappedY = Math.round(canvasY / 10) * 10;

      onPlaceComponent(partId, snappedX, snappedY);
    },
    [onPlaceComponent, pan, scale]
  );

  const handleSelectWire = useCallback((wireId: string) => {
    setSelectedWireId(wireId);
  }, []);

  // Two-tier grid dot parameters
  const minorPitch = 10 * scale;
  const majorPitch = 50 * scale;

  const minorOffsetX = (((pan.x - minorPitch / 2) % minorPitch) + minorPitch) % minorPitch;
  const minorOffsetY = (((pan.y - minorPitch / 2) % minorPitch) + minorPitch) % minorPitch;

  const majorOffsetX = (((pan.x - majorPitch / 2) % majorPitch) + majorPitch) % majorPitch;
  const majorOffsetY = (((pan.y - majorPitch / 2) % majorPitch) + majorPitch) % majorPitch;

  return (
    <div
      ref={containerRef}
      className={`canvas-container ${isPanning ? 'is-panning' : ''} ${isSpacePressed ? 'space-held' : ''}`}
      style={{
        cursor: isPanning
          ? 'grabbing'
          : isSpacePressed
          ? 'grab'
          : drawingWire
          ? 'crosshair'
          : selectedLibraryPart
          ? 'copy'
          : 'default',
      }}
      onWheel={handleWheel}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <svg ref={svgRef} className="canvas-svg">
        <defs>
          {/* Minor Dot Grid (10px pitch = 2.54mm at 100% zoom) */}
          <pattern
            id="minorDotGrid"
            x={minorOffsetX}
            y={minorOffsetY}
            width={minorPitch}
            height={minorPitch}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={minorPitch / 2}
              cy={minorPitch / 2}
              r={1}
              fill="rgba(255, 255, 255, 0.10)"
            />
          </pattern>

          {/* Major Dot Grid (every 5th minor dot = 50px pitch) */}
          <pattern
            id="majorDotGrid"
            x={majorOffsetX}
            y={majorOffsetY}
            width={majorPitch}
            height={majorPitch}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={majorPitch / 2}
              cy={majorPitch / 2}
              r={1.5}
              fill="rgba(255, 255, 255, 0.18)"
            />
          </pattern>
        </defs>

        {/* Void Background */}
        <rect width="100%" height="100%" fill="var(--void)" />

        {/* Dot Grids */}
        <rect width="100%" height="100%" fill="url(#minorDotGrid)" pointerEvents="none" />
        <rect width="100%" height="100%" fill="url(#majorDotGrid)" pointerEvents="none" />

        {/* Content Group (Pan & Zoom Transformed) */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
          <CircuitContent
            components={components}
            wires={wires}
            selectedIds={selectedIds}
            selectedWireId={selectedWireId}
            highlightedId={highlightedId}
            findings={findings}
            drawingOrigin={drawingWire ? { compId: drawingWire.fromId, pinIdx: drawingWire.fromPin } : null}
            isSpacePressed={isSpacePressed}
            onComponentPointerDown={handleComponentPointerDown}
            onPinClick={handlePinClick}
            onSelectWire={handleSelectWire}
          />

          {/* Active Wire Drawing Rubberband Line */}
          {drawingWire && (
            <g className="rubberband-wire" pointerEvents="none">
              <path
                d={`M ${drawingWire.startX},${drawingWire.startY} L ${drawingWire.currentX},${drawingWire.currentY}`}
                stroke="var(--blue)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
              <circle
                cx={drawingWire.currentX}
                cy={drawingWire.currentY}
                r="4.5"
                fill="var(--blue)"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 0 6px var(--blue))' }}
              />
            </g>
          )}

          {/* Marquee Selection Rectangle */}
          {marquee && (
            <rect
              x={Math.min(marquee.startX, marquee.currentX)}
              y={Math.min(marquee.startY, marquee.currentY)}
              width={Math.abs(marquee.currentX - marquee.startX)}
              height={Math.abs(marquee.currentY - marquee.startY)}
              fill="rgba(10, 132, 255, 0.10)"
              stroke="var(--blue)"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          )}

          {/* Ghost Component Placement Preview */}
          {selectedLibraryPart && ghostPos && (
            <g
              className="ghost-placement-component"
              transform={`translate(${ghostPos.x}, ${ghostPos.y})`}
              pointerEvents="none"
            >
              {/* Snap crosshair indicator */}
              <circle cx="0" cy="0" r="18" fill="rgba(10, 132, 255, 0.08)" stroke="var(--blue)" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="var(--blue)" strokeWidth="1" opacity="0.6" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="var(--blue)" strokeWidth="1" opacity="0.6" />

              {/* Ghost Symbol */}
              <g opacity="0.75">
                {renderSymbol(
                  {
                    id: 'ghost',
                    partId: selectedLibraryPart,
                    designator: getPartMeta(selectedLibraryPart).prefix,
                    name: getPartMeta(selectedLibraryPart).name,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    params: {},
                  },
                  false
                )}
              </g>

              {/* Ghost Indicator Label */}
              <text y="32" textAnchor="middle" fill="var(--blue-text)" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
                Click to place {getPartMeta(selectedLibraryPart).prefix}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Floating Canvas Toolbar Pill */}
      <FloatingToolbar
        zoom={Math.round(zoom)}
        onZoomIn={() => setZoom((prev) => Math.min(400, prev + 25))}
        onZoomOut={() => setZoom((prev) => Math.max(20, prev - 25))}
        onZoomReset={() => {
          setZoom(100);
          setPan({ x: 60, y: 40 });
        }}
        ercCount={findings.length}
        onOpenErc={onOpenErc}
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isSimulating={isSimulating}
        onToggleSimulation={onToggleSimulation}
      />
    </div>
  );
}

interface CircuitContentProps {
  components: PlacedComponent[];
  wires: WireConnection[];
  selectedIds: string[];
  selectedWireId: string | null;
  highlightedId: string | null;
  findings: ErcFinding[];
  drawingOrigin: { compId: string; pinIdx: number } | null;
  isSpacePressed: boolean;
  onComponentPointerDown: (e: React.PointerEvent, comp: PlacedComponent) => void;
  onPinClick: (e: React.PointerEvent, comp: PlacedComponent, pinIdx: number) => void;
  onSelectWire: (wireId: string) => void;
}

const CircuitContent = memo(function CircuitContent({
  components,
  wires,
  selectedIds,
  selectedWireId,
  highlightedId,
  findings,
  drawingOrigin,
  isSpacePressed,
  onComponentPointerDown,
  onPinClick,
  onSelectWire,
}: CircuitContentProps) {
  const findingAnchors = useMemo(() => new Set(findings.map((f) => f.anchorId)), [findings]);

  return (
    <>
      {/* Wires with rounded line-caps, junction dots, and blue selection glow */}
      {wires.map((wire) => {
        const fromComp = components.find((c) => c.id === wire.fromId);
        const toComp = components.find((c) => c.id === wire.toId);
        if (!fromComp || !toComp) return null;

        const fromPins = getPinPositions(fromComp.partId);
        const toPins = getPinPositions(toComp.partId);
        const p1 = fromPins[wire.fromPin] ?? { x: 0, y: 0 };
        const p2 = toPins[wire.toPin] ?? { x: 0, y: 0 };

        const x1 = fromComp.x + p1.x;
        const y1 = fromComp.y + p1.y;
        const x2 = toComp.x + p2.x;
        const y2 = toComp.y + p2.y;

        const midX = Math.round((x1 + x2) / 2);
        const dPath = `M ${x1},${y1} L ${midX},${y1} L ${midX},${y2} L ${x2},${y2}`;
        const isSelected = selectedWireId === wire.id;

        return (
          <g
            key={wire.id}
            className={`circuit-wire-group ${isSelected ? 'wire-selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectWire(wire.id);
            }}
          >
            {/* Generous Clickable Hit Target */}
            <path
              d={dPath}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
            />

            {/* Selection Blue Glow under-layer */}
            {isSelected && (
              <path
                d={dPath}
                fill="none"
                stroke="var(--blue)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
                style={{ filter: 'drop-shadow(0 0 6px var(--blue-glow))' }}
              />
            )}

            {/* Visible Wire with rounded line joins and caps */}
            <path
              d={dPath}
              className={`circuit-wire wire-${wire.netType} ${isSelected ? 'wire-active-stroke' : ''}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Corner bend dots */}
            <circle cx={midX} cy={y1} r="2.5" className={`wire-bend-dot net-${wire.netType}`} />
            <circle cx={midX} cy={y2} r="2.5" className={`wire-bend-dot net-${wire.netType}`} />

            {/* Waypoint handle when selected */}
            {isSelected && (
              <circle cx={midX} cy={Math.round((y1 + y2) / 2)} r="4" fill="var(--blue)" stroke="#FFFFFF" strokeWidth="1.5" />
            )}
          </g>
        );
      })}

      {/* Components */}
      {components.map((comp) => {
        const isSelected = selectedIds.includes(comp.id);
        const isHighlighted = comp.id === highlightedId;
        const hasFinding = findingAnchors.has(comp.id);
        const finding = findings.find((f) => f.anchorId === comp.id);

        return (
          <g
            key={comp.id}
            id={`comp-elem-${comp.id}`}
            transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}
            className={`circuit-component ${isSelected ? 'selected' : ''}`}
            onPointerDown={(e) => onComponentPointerDown(e, comp)}
            role="button"
            tabIndex={0}
            aria-label={`${comp.designator} ${comp.name}`}
          >
            {/* Generous Hit Area */}
            <rect
              x="-35"
              y="-25"
              width="70"
              height="50"
              fill="transparent"
              style={{ pointerEvents: 'all', cursor: isSpacePressed ? 'grab' : 'move' }}
            />

            {/* Selection Blue Halo */}
            {isSelected && (
              <g className="component-selection-aura">
                {renderSymbol(comp, true)}
              </g>
            )}

            {/* Fault Halo: Animated dashed outline per design system */}
            {hasFinding && (
              <g className="erc-fault-group">
                <rect
                  x="-36"
                  y="-26"
                  width="72"
                  height="52"
                  rx="8"
                  fill="none"
                  stroke={finding?.severity === 'warning' ? 'var(--warning)' : 'var(--error)'}
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  className="erc-dashed-halo"
                />
                <circle cx="28" cy="-20" r="7" fill="var(--error)" />
                <text x="28" y="-17.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)">
                  !
                </text>
              </g>
            )}

            {/* Mentor Highlight Halo */}
            {isHighlighted && !hasFinding && (
              <rect
                x="-36"
                y="-26"
                width="72"
                height="52"
                rx="8"
                fill="none"
                stroke="var(--mentor)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.9"
              />
            )}

            {/* Schematic Symbol */}
            <g className={`component-symbol-group ${isSelected ? 'symbol-selected' : ''}`}>
              {renderSymbol(comp, false)}
            </g>

            {/* Component Pins with 20px generous hit targets */}
            {renderPins(comp, onPinClick, drawingOrigin)}

            {/* Component Identifier */}
            <text y="28" textAnchor="middle" className="component-identifier-text">
              {comp.designator}
            </text>
          </g>
        );
      })}
    </>
  );
});

/** Render schematic symbol for a component */
function renderSymbol(comp: PlacedComponent, isAura: boolean = false) {
  const strokeColor = isAura ? 'var(--blue)' : 'var(--text-1)';
  const strokeW = isAura ? 2.5 : 1.5;
  const auraStyle = isAura
    ? {
        filter: 'drop-shadow(0 0 6px var(--blue)) drop-shadow(0 0 12px var(--blue-glow))',
        opacity: 0.95,
      }
    : undefined;

  switch (comp.partId) {
    case 'resistor.axial':
      return (
        <g className="component-body" style={auraStyle}>
          {/* Authentic sharp IEEE zigzag */}
          <path
            d="M -30,0 L -18,0 L -14,-7 L -7,7 L 0,-7 L 7,7 L 14,-7 L 18,0 L 30,0"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case 'led.5mm.red':
      return (
        <g className="component-body" style={auraStyle}>
          {/* Diode triangle + vertical cathode line + light emission arrows */}
          <polygon points="-8,-10 -8,10 10,0" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="10" y1="-10" x2="10" y2="10" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-20" y1="0" x2="-8" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="10" y1="0" x2="24" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
          {!isAura && (
            <>
              <line x1="4" y1="-12" x2="12" y2="-18" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round" />
              <polyline points="9,-18 12,-18 12,-15" stroke="var(--error)" strokeWidth="1.2" fill="none" />
              <line x1="8" y1="-10" x2="16" y2="-16" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round" />
              <polyline points="13,-16 16,-16 16,-13" stroke="var(--error)" strokeWidth="1.2" fill="none" />
            </>
          )}
        </g>
      );
    case 'battery.9v':
      return (
        <g className="component-body" style={auraStyle}>
          <line x1="0" y1="-20" x2="0" y2="-8" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-14" y1="-8" x2="14" y2="-8" stroke={strokeColor} strokeWidth={isAura ? 3.5 : 2.5} />
          <line x1="-7" y1="-2" x2="7" y2="-2" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-14" y1="4" x2="14" y2="4" stroke={strokeColor} strokeWidth={isAura ? 3.5 : 2.5} />
          <line x1="-7" y1="10" x2="7" y2="10" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="0" y1="10" x2="0" y2="20" stroke={strokeColor} strokeWidth={strokeW} />
          {!isAura && (
            <>
              <text x="18" y="-4" fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)">+</text>
              <text x="18" y="10" fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)">−</text>
            </>
          )}
        </g>
      );
    case 'ground':
      return (
        <g className="component-body" style={auraStyle}>
          <line x1="0" y1="-12" x2="0" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-14" y1="0" x2="14" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-9" y1="5" x2="9" y2="5" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-4" y1="10" x2="4" y2="10" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'arduino.uno':
      return (
        <g className="component-body" style={auraStyle}>
          <rect x="-32" y="-24" width="64" height="48" rx="4" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="-22" y="-16" width="14" height="12" fill="var(--raised)" stroke="var(--blue)" strokeWidth="1" />
          <text x="4" y="4" textAnchor="middle" fill="var(--blue)" fontSize="9" fontFamily="var(--font-mono)">UNO</text>
        </g>
      );
    case 'capacitor.ceramic':
      return (
        <g className="component-body" style={auraStyle}>
          <line x1="-20" y1="0" x2="-6" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-6" y1="-14" x2="-6" y2="14" stroke={strokeColor} strokeWidth={isAura ? 3 : 2} />
          <line x1="6" y1="-14" x2="6" y2="14" stroke={strokeColor} strokeWidth={isAura ? 3 : 2} />
          <line x1="6" y1="0" x2="20" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'battery.3v':
      return (
        <g className="component-body" style={auraStyle}>
          <line x1="0" y1="-16" x2="0" y2="-6" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-12" y1="-6" x2="12" y2="-6" stroke={strokeColor} strokeWidth={isAura ? 3.5 : 2.5} />
          <line x1="-6" y1="6" x2="6" y2="6" stroke={strokeColor} strokeWidth={isAura ? 4 : 3} />
          <line x1="0" y1="6" x2="0" y2="16" stroke={strokeColor} strokeWidth={strokeW} />
          {!isAura && (
            <>
              <text x="14" y="-2" fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)">+</text>
              <text x="14" y="10" fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)">−</text>
            </>
          )}
        </g>
      );
    case 'diode.1n4007':
      return (
        <g className="component-body" style={auraStyle}>
          <polygon points="-8,-10 -8,10 10,0" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="10" y1="-10" x2="10" y2="10" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-20" y1="0" x2="-8" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="10" y1="0" x2="20" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'pushbutton':
      return (
        <g className="component-body" style={auraStyle}>
          <circle cx="-10" cy="4" r="2.5" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="10" cy="4" r="2.5" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-20" y1="4" x2="-12.5" y2="4" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="12.5" y1="4" x2="20" y2="4" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-10" y1="-3" x2="10" y2="-3" stroke={strokeColor} strokeWidth={isAura ? 3 : 2} />
          <line x1="0" y1="-3" x2="0" y2="-12" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'potentiometer':
      return (
        <g className="component-body" style={auraStyle}>
          <path
            d="M -24,4 L -16,4 L -12,-2 L -6,10 L 0,-2 L 6,10 L 12,-2 L 16,4 L 24,4"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="0" y1="-14" x2="0" y2="-4" stroke={strokeColor} strokeWidth={strokeW} />
          <polyline points="-3,-7 0,-4 3,-7" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'switch.spst':
      return (
        <g className="component-body" style={auraStyle}>
          <circle cx="-10" cy="4" r="2.5" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="10" cy="4" r="2.5" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-20" y1="4" x2="-12.5" y2="4" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="12.5" y1="4" x2="20" y2="4" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-8" y1="2" x2="8" y2="-8" stroke={strokeColor} strokeWidth={isAura ? 3 : 2} strokeLinecap="round" />
        </g>
      );
    case 'transistor.npn':
      return (
        <g className="component-body" style={auraStyle}>
          <circle cx="0" cy="0" r="15" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeDasharray="3 2" opacity="0.6" />
          <line x1="-16" y1="0" x2="-6" y2="0" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-6" y1="-10" x2="-6" y2="10" stroke={strokeColor} strokeWidth={isAura ? 3 : 2.2} />
          <line x1="-6" y1="-5" x2="10" y2="-12" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-6" y1="5" x2="10" y2="12" stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="6,12 10,12 8,8" fill={strokeColor} />
        </g>
      );
    case 'motor.dc':
      return (
        <g className="component-body" style={auraStyle}>
          <circle cx="0" cy="0" r="14" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <text x="0" y="4" textAnchor="middle" fill={strokeColor} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">M</text>
          <line x1="0" y1="-20" x2="0" y2="-14" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="0" y1="14" x2="0" y2="20" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'servo':
      return (
        <g className="component-body" style={auraStyle}>
          <rect x="-18" y="-12" width="36" height="24" rx="3" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="0" cy="0" r="5" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="0" y1="-5" x2="5" y2="-8" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'sensor.ultrasonic':
      return (
        <g className="component-body" style={auraStyle}>
          <rect x="-24" y="-14" width="48" height="28" rx="3" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="-11" cy="0" r="7" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="11" cy="0" r="7" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );
    case 'breadboard.small':
      return (
        <g className="component-body" style={auraStyle}>
          <rect x="-35" y="-18" width="70" height="36" rx="4" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1="-28" y1="-8" x2="28" y2="-8" stroke={strokeColor} strokeDasharray="2 3" strokeWidth="1" opacity="0.6" />
          <line x1="-28" y1="0" x2="28" y2="0" stroke={strokeColor} strokeDasharray="2 3" strokeWidth="1" opacity="0.6" />
          <line x1="-28" y1="8" x2="28" y2="8" stroke={strokeColor} strokeDasharray="2 3" strokeWidth="1" opacity="0.6" />
        </g>
      );
    default:
      return (
        <g className="component-body" style={auraStyle}>
          <rect x="-22" y="-16" width="44" height="32" fill="none" stroke={strokeColor} strokeWidth={strokeW} rx="3" />
        </g>
      );
  }
}

/** Render component pins with generous 20px invisible hit targets */
function renderPins(
  comp: PlacedComponent,
  onPinClick: (e: React.PointerEvent, comp: PlacedComponent, pinIdx: number) => void,
  drawingOrigin: { compId: string; pinIdx: number } | null
) {
  const pinPositions = getPinPositions(comp.partId);
  return (
    <g>
      {pinPositions.map((pin, i) => {
        const isOrigin = drawingOrigin?.compId === comp.id && drawingOrigin?.pinIdx === i;
        return (
          <g
            key={i}
            className={`pin-target-group ${isOrigin ? 'pin-connecting' : ''}`}
            onPointerDown={(e) => onPinClick(e, comp, i)}
          >
            {/* Generous 20px invisible hit target */}
            <circle
              cx={pin.x}
              cy={pin.y}
              r="10"
              fill="transparent"
              style={{ cursor: 'crosshair', pointerEvents: 'all' }}
            />
            {/* Visible pin dot */}
            <circle
              cx={pin.x}
              cy={pin.y}
              className={`circuit-pin ${isOrigin ? 'pin-active' : ''}`}
            />
          </g>
        );
      })}
    </g>
  );
}

export function getPinPositions(partId: string): Array<{ x: number; y: number }> {
  switch (partId) {
    case 'resistor.axial':
      return [{ x: -30, y: 0 }, { x: 30, y: 0 }];
    case 'led.5mm.red':
      return [{ x: -20, y: 0 }, { x: 24, y: 0 }];
    case 'capacitor.ceramic':
      return [{ x: -20, y: 0 }, { x: 20, y: 0 }];
    case 'battery.9v':
      return [{ x: 0, y: -20 }, { x: 0, y: 20 }];
    case 'battery.3v':
      return [{ x: 0, y: -16 }, { x: 0, y: 16 }];
    case 'ground':
      return [{ x: 0, y: -12 }];
    case 'diode.1n4007':
      return [{ x: -20, y: 0 }, { x: 20, y: 0 }];
    case 'pushbutton':
      return [{ x: -20, y: 4 }, { x: 20, y: 4 }];
    case 'potentiometer':
      return [{ x: -20, y: 4 }, { x: 0, y: -14 }, { x: 20, y: 4 }];
    case 'switch.spst':
      return [{ x: -20, y: 4 }, { x: 20, y: 4 }];
    case 'transistor.npn':
      return [{ x: -16, y: 0 }, { x: 10, y: -12 }, { x: 10, y: 12 }];
    case 'motor.dc':
      return [{ x: 0, y: -20 }, { x: 0, y: 20 }];
    case 'servo':
      return [{ x: -18, y: 0 }, { x: 0, y: 12 }, { x: 18, y: 0 }];
    case 'sensor.ultrasonic':
      return [{ x: -18, y: 14 }, { x: -6, y: 14 }, { x: 6, y: 14 }, { x: 18, y: 14 }];
    case 'arduino.uno':
      return [{ x: -32, y: -12 }, { x: -32, y: 12 }, { x: 32, y: -12 }, { x: 32, y: 12 }];
    default:
      return [{ x: -20, y: 0 }, { x: 20, y: 0 }];
  }
}
