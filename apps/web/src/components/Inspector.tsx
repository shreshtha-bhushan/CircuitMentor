import { useState, useMemo } from 'react';
import type { PlacedComponent } from '../App';
import type { WireConnection } from './Canvas';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface InspectorProps {
  component: PlacedComponent | null;
  wires?: WireConnection[];
  allComponents?: PlacedComponent[];
  onUpdateComponent?: (id: string, updates: Partial<PlacedComponent>) => void;
}

interface PinInfo {
  number: string;
  name: string;
  role: string;
  netType: 'vcc' | 'gnd' | 'signal';
}

function getComponentPins(partId: string): PinInfo[] {
  switch (partId) {
    case 'resistor.axial':
      return [
        { number: '1', name: 'Terminal 1', role: 'Terminal 1', netType: 'signal' },
        { number: '2', name: 'Terminal 2', role: 'Terminal 2', netType: 'signal' },
      ];
    case 'led.5mm.red':
      return [
        { number: '1', name: 'Anode (+)', role: 'Anode (+)', netType: 'signal' },
        { number: '2', name: 'Cathode (−)', role: 'Cathode (−)', netType: 'gnd' },
      ];
    case 'battery.9v':
      return [
        { number: '1', name: 'Positive (+)', role: 'Positive · 9V', netType: 'vcc' },
        { number: '2', name: 'Negative (−)', role: 'Negative · 0V', netType: 'gnd' },
      ];
    case 'ground':
      return [
        { number: '1', name: 'Earth Terminal', role: 'Ground · 0V', netType: 'gnd' },
      ];
    case 'arduino.uno':
      return [
        { number: '5V', name: '5V Supply', role: 'Power · 5V', netType: 'vcc' },
        { number: 'GND', name: 'GND Rail', role: 'Ground · 0V', netType: 'gnd' },
        { number: 'D13', name: 'Digital 13', role: 'Signal · SCK', netType: 'signal' },
        { number: 'A0', name: 'Analog In 0', role: 'Analog · Sense', netType: 'signal' },
      ];
    default:
      return [
        { number: '1', name: 'Pin 1', role: 'Pin 1', netType: 'signal' },
        { number: '2', name: 'Pin 2', role: 'Pin 2', netType: 'signal' },
      ];
  }
}

function parseValueAndUnit(raw: string): { val: string; unit: string } {
  const match = raw.match(/^([0-9.]+)\s*(.*)$/);
  if (match) {
    return { val: match[1] ?? raw, unit: match[2] ?? '' };
  }
  return { val: raw, unit: '' };
}

function getUnitAlternatives(unit: string): string[] {
  if (['Ω', 'kΩ', 'MΩ', 'ohm', 'kohm'].includes(unit)) return ['Ω', 'kΩ', 'MΩ'];
  if (['V', 'mV', 'kV'].includes(unit)) return ['mV', 'V', 'kV'];
  if (['mA', 'A', 'µA', 'uA'].includes(unit)) return ['µA', 'mA', 'A'];
  if (['pF', 'nF', 'µF', 'uF', 'mF'].includes(unit)) return ['pF', 'nF', 'µF'];
  if (['Hz', 'kHz', 'MHz'].includes(unit)) return ['Hz', 'kHz', 'MHz'];
  if (['W', 'mW'].includes(unit)) return ['mW', 'W'];
  if (['%', 'percent'].includes(unit)) return ['1%', '5%', '10%', '20%'];
  return [unit];
}

export default function Inspector({ component, wires = [], allComponents = [] }: InspectorProps) {
  const [snapUnit, setSnapUnit] = useState('2.54 mm');
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});

  const pins = useMemo(() => {
    if (!component) return [];
    const basePins = getComponentPins(component.partId);

    return basePins.map((pin, pinIdx) => {
      const connectedWire = wires.find(
        (w) =>
          (w.fromId === component.id && w.fromPin === pinIdx) ||
          (w.toId === component.id && w.toPin === pinIdx)
      );

      if (!connectedWire) {
        return {
          ...pin,
          role: 'Unconnected · Open',
        };
      }

      const otherId = connectedWire.fromId === component.id ? connectedWire.toId : connectedWire.fromId;
      const otherPinIdx = connectedWire.fromId === component.id ? connectedWire.toPin : connectedWire.fromPin;
      const otherComp = allComponents.find((c) => c.id === otherId);
      const otherName = otherComp ? `${otherComp.designator}:P${otherPinIdx + 1}` : 'Net';

      return {
        ...pin,
        netType: connectedWire.netType,
        role: `Connected · ${otherName}`,
      };
    });
  }, [component, wires, allComponents]);

  if (!component) {
    return (
      <div className="inspector-empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="inspector-empty-text">
          Select a component on the canvas to inspect its properties and electrical parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="inspector">
      {/* Component Title Header: Designator in 12px mono --text-3, Name in 14px 600 --text-1 */}
      <div className="inspector-header">
        <div className="inspector-header-left">
          <span className="inspector-designator">{component.designator}</span>
          <h2 className="inspector-name">{component.name}</h2>
        </div>
        {/* Neutral status badge in --raised + --text-2 */}
        <span className="inspector-status-badge">Placed</span>
      </div>

      {/* Geometry & position */}
      <div className="inspector-card">
        <div className="inspector-card-header">Geometry & position</div>
        <div className="inspector-card-body">
          {/* Figma Pattern #1: Collapsed X / Y pair on ONE row */}
          <div className="dimension-pair-row">
            <div className="dimension-compact-box">
              <span className="dimension-prefix">X</span>
              <input
                className="dimension-input"
                defaultValue={component.x}
                aria-label="X position in pixels"
              />
              <span className="dimension-unit">px</span>
            </div>

            <div className="dimension-compact-box">
              <span className="dimension-prefix">Y</span>
              <input
                className="dimension-input"
                defaultValue={component.y}
                aria-label="Y position in pixels"
              />
              <span className="dimension-unit">px</span>
            </div>
          </div>

          {/* Collapsed Rotation / Grid snap row */}
          <div className="dimension-pair-row">
            <div className="dimension-compact-box">
              <span className="dimension-prefix">R</span>
              <input
                className="dimension-input"
                defaultValue={component.rotation}
                aria-label="Rotation degrees"
              />
              <span className="dimension-unit">deg</span>
            </div>

            <div className="dimension-compact-box">
              <span className="dimension-prefix">Snap</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="dimension-static-val cursor-pointer bg-transparent border-0 hover:text-[var(--text-1)] flex items-center gap-1 transition-colors"
                    aria-label="Change grid snap"
                  >
                    <span>{snapUnit}</span>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuLabel>Grid Snap</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSnapUnit('2.54 mm')}>2.54 mm (0.1")</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSnapUnit('1.27 mm')}>1.27 mm (0.05")</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSnapUnit('5.08 mm')}>5.08 mm (0.2")</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Electrical parameters */}
      {Object.keys(component.params).length > 0 && (
        <div className="inspector-card">
          <div className="inspector-card-header">Electrical parameters</div>
          <div className="inspector-card-body">
            {Object.entries(component.params).map(([key, rawValue]) => {
              const { val, unit } = parseValueAndUnit(rawValue);
              const label = key.replace(/_/g, ' ');
              const alternatives = getUnitAlternatives(unit);
              const activeUnit = selectedUnits[key] || unit;

              return (
                <div className="inspector-field-row" key={key}>
                  <label htmlFor={`param-${key}`} className="inspector-field-label">{label}</label>
                  <div className="inspector-field-box">
                    <input
                      id={`param-${key}`}
                      className="inspector-field-input"
                      defaultValue={val}
                    />
                    {unit && (
                      alternatives.length > 1 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="inspector-field-unit cursor-pointer bg-transparent border-0 hover:text-[var(--text-1)] flex items-center gap-0.5 transition-colors"
                              aria-label={`Change unit for ${label}`}
                            >
                              <span>{activeUnit}</span>
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-24">
                            <DropdownMenuLabel>Unit</DropdownMenuLabel>
                            {alternatives.map((u) => (
                              <DropdownMenuItem
                                key={u}
                                onClick={() => setSelectedUnits((prev) => ({ ...prev, [key]: u }))}
                                className={activeUnit === u ? 'text-[var(--cm-blue)] font-semibold' : ''}
                              >
                                {u}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="inspector-field-unit">{unit}</span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Terminals & nets with Fill × Hug style Constraint Chips */}
      <div className="inspector-card">
        <div className="inspector-card-header">Terminals & nets ({pins.length})</div>
        <div className="inspector-pin-table">
          {pins.map((pin) => (
            <div className="inspector-pin-row" key={pin.number}>
              <div className="pin-identity">
                <span className="inspector-pin-num">{pin.number}</span>
                <span className="inspector-pin-name">{pin.name}</span>
              </div>
              <div className="pin-role-chip" title={`Connected net: ${pin.role}`}>
                <span className={`role-chip-dot dot-${pin.netType}`} />
                <span className="role-chip-text">{pin.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package specification */}
      <div className="inspector-card">
        <div className="inspector-card-header">Package specification</div>
        <div className="inspector-card-body">
          <div className="inspector-meta-row">
            <span className="inspector-meta-label">Catalog ID</span>
            <span className="inspector-meta-mono">{component.partId}</span>
          </div>
          <div className="inspector-meta-row">
            <span className="inspector-meta-label">Instance ID</span>
            <span className="inspector-meta-mono">{component.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
