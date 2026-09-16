import React from 'react';

interface LiveCircuitPreviewProps {
  className?: string;
  showStatusChip?: boolean;
}

export default function LiveCircuitPreview({
  className = '',
  showStatusChip = true,
}: LiveCircuitPreviewProps) {
  return (
    <div
      className={`live-circuit-preview ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '260px',
        background: 'var(--void)',
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Dot Grid (2.54mm equivalent pitch on --void) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern
            id="livePreviewDotGrid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1" fill="rgba(255, 255, 255, 0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#livePreviewDotGrid)" />
      </svg>

      {/* Real Schematic SVG Circuit Diagram */}
      <svg
        viewBox="0 0 560 220"
        fill="none"
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '320px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ================= WIRES ================= */}
        {/* VCC Wire: Battery(+) (100, 80) -> Resistor Pin 1 (220, 80) */}
        <path
          d="M 100 80 L 220 80"
          stroke="var(--wire-vcc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Signal Wire: Resistor Pin 2 (280, 80) -> LED Anode (390, 80) */}
        <path
          d="M 280 80 L 390 80"
          stroke="var(--wire-signal)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* GND Return Wire: LED Cathode (434, 80) -> (434, 160) -> GND (260, 160) */}
        <path
          d="M 434 80 L 460 80 L 460 160 L 260 160"
          stroke="var(--wire-gnd)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* GND Return Wire: Battery(-) (100, 120) -> (100, 160) -> GND (260, 160) */}
        <path
          d="M 100 120 L 100 160 L 260 160"
          stroke="var(--wire-gnd)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wire Corner Bend Dots */}
        <circle cx="100" cy="80" r="3" fill="var(--wire-vcc)" />
        <circle cx="220" cy="80" r="3" fill="var(--wire-vcc)" />
        <circle cx="280" cy="80" r="3" fill="var(--wire-signal)" />
        <circle cx="390" cy="80" r="3" fill="var(--wire-signal)" />
        <circle cx="434" cy="80" r="2.5" fill="var(--wire-gnd)" />
        <circle cx="460" cy="80" r="2.5" fill="var(--wire-gnd)" />
        <circle cx="460" cy="160" r="2.5" fill="var(--wire-gnd)" />
        <circle cx="100" cy="120" r="2.5" fill="var(--wire-gnd)" />
        <circle cx="100" cy="160" r="2.5" fill="var(--wire-gnd)" />
        <circle cx="260" cy="160" r="3" fill="var(--wire-gnd)" />

        {/* ================= COMPONENT 1: 9V BATTERY (V1) ================= */}
        <g transform="translate(100, 100)">
          {/* Battery symbol */}
          <line x1="0" y1="-20" x2="0" y2="-8" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="-14" y1="-8" x2="14" y2="-8" stroke="var(--text-1)" strokeWidth="2.5" />
          <line x1="-7" y1="-2" x2="7" y2="-2" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="-14" y1="4" x2="14" y2="4" stroke="var(--text-1)" strokeWidth="2.5" />
          <line x1="-7" y1="10" x2="7" y2="10" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="0" y1="10" x2="0" y2="20" stroke="var(--text-1)" strokeWidth="1.5" />
          <text x="18" y="-4" fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)">+</text>
          <text x="18" y="10" fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)">−</text>
          {/* Designator & Value */}
          <text x="0" y="36" textAnchor="middle" fill="var(--text-2)" fontSize="10" fontFamily="var(--font-mono)">V1 · 9V</text>
        </g>

        {/* ================= COMPONENT 2: RESISTOR (R1, 220 Ω) ================= */}
        <g transform="translate(250, 80)">
          {/* Authentic sharp IEEE zigzag */}
          <path
            d="M -30,0 L -18,0 L -14,-7 L -7,7 L 0,-7 L 7,7 L 14,-7 L 18,0 L 30,0"
            fill="none"
            stroke="var(--text-1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Designator & Value */}
          <text x="0" y="24" textAnchor="middle" fill="var(--text-2)" fontSize="10" fontFamily="var(--font-mono)">R1 · 220 Ω</text>
        </g>

        {/* ================= COMPONENT 3: RED LED (D1) ================= */}
        <g transform="translate(410, 80)">
          {/* Diode triangle + cathode bar + light emission arrows */}
          <polygon points="-8,-10 -8,10 10,0" fill="none" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="10" y1="-10" x2="10" y2="10" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="-20" y1="0" x2="-8" y2="0" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="10" y1="0" x2="24" y2="0" stroke="var(--text-1)" strokeWidth="1.5" />
          {/* Emission arrows */}
          <line x1="4" y1="-12" x2="12" y2="-18" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round" />
          <polyline points="9,-18 12,-18 12,-15" stroke="var(--error)" strokeWidth="1.2" fill="none" />
          <line x1="8" y1="-10" x2="16" y2="-16" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round" />
          <polyline points="13,-16 16,-16 16,-13" stroke="var(--error)" strokeWidth="1.2" fill="none" />
          {/* Designator & Value */}
          <text x="0" y="24" textAnchor="middle" fill="var(--text-2)" fontSize="10" fontFamily="var(--font-mono)">D1 · Red</text>
        </g>

        {/* ================= COMPONENT 4: EARTH GROUND (GND) ================= */}
        <g transform="translate(260, 160)">
          {/* Ground bars */}
          <line x1="0" y1="-12" x2="0" y2="0" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="-9" y1="5" x2="9" y2="5" stroke="var(--text-1)" strokeWidth="1.5" />
          <line x1="-4" y1="10" x2="4" y2="10" stroke="var(--text-1)" strokeWidth="1.5" />
          {/* Designator */}
          <text x="0" y="24" textAnchor="middle" fill="var(--text-2)" fontSize="10" fontFamily="var(--font-mono)">GND</text>
        </g>
      </svg>

      {/* Genuine "Simulation ready" Status Chip */}
      {showStatusChip && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: 'var(--raised)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-pill)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-2)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 6px var(--success)',
            }}
          />
          <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>Simulation ready</span>
        </div>
      )}
    </div>
  );
}
