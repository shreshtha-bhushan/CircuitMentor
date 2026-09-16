import React from 'react';

export interface PartDef {
  id: string;
  name: string;
  category: 'Basic' | 'Power' | 'Semi' | 'MCU' | 'Sensor' | 'Output' | 'Board';
  pins: number;
  shortcut?: string;
  icon: (color: string) => React.ReactNode;
}

export const PARTS: PartDef[] = [
  {
    id: 'resistor.axial',
    name: 'Resistor',
    category: 'Basic',
    pins: 2,
    shortcut: 'R',
    icon: (c) => (
      /* Authentic IEEE sharp zigzag schematic symbol */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h3.5l1.8-6 3.4 12 3.4-12 3.4 12 1.8-6H22" />
      </svg>
    ),
  },
  {
    id: 'led.5mm.red',
    name: 'LED (Red 5mm)',
    category: 'Basic',
    pins: 2,
    shortcut: 'L',
    icon: (c) => (
      /* Diode triangle + cathode bar + light emission arrows */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="6,6 6,18 16,12" />
        <line x1="16" y1="5" x2="16" y2="19" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="16" y1="12" x2="22" y2="12" />
        <line x1="13" y1="5" x2="18" y2="1" strokeWidth="1.3" />
        <polyline points="15,1 18,1 18,4" strokeWidth="1.3" />
        <line x1="16" y1="8" x2="21" y2="4" strokeWidth="1.3" />
        <polyline points="18,4 21,4 21,7" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    id: 'pushbutton',
    name: 'Pushbutton',
    category: 'Basic',
    pins: 2,
    icon: (c) => (
      /* Open contact pushbutton schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="5" cy="15" r="2" />
        <circle cx="19" cy="15" r="2" />
        <line x1="2" y1="15" x2="3" y2="15" />
        <line x1="21" y1="15" x2="22" y2="15" />
        <line x1="5" y1="10" x2="19" y2="10" strokeWidth="2" />
        <line x1="12" y1="10" x2="12" y2="4" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'potentiometer',
    name: 'Potentiometer',
    category: 'Basic',
    pins: 3,
    icon: (c) => (
      /* Resistor zigzag with wiper arrow */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 15h3l1.8-5 3.4 10 3.4-10 3.4 10 1.8-5H22" />
        <path d="M12 2v6" />
        <polyline points="9.5,5.5 12,8 14.5,5.5" />
      </svg>
    ),
  },
  {
    id: 'capacitor.ceramic',
    name: 'Capacitor',
    category: 'Basic',
    pins: 2,
    shortcut: 'C',
    icon: (c) => (
      /* Parallel plates schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
        <line x1="2" y1="12" x2="9" y2="12" />
        <line x1="9" y1="4" x2="9" y2="20" strokeWidth="2" />
        <line x1="15" y1="4" x2="15" y2="20" strokeWidth="2" />
        <line x1="15" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: 'switch.spst',
    name: 'Slide Switch',
    category: 'Basic',
    pins: 3,
    icon: (c) => (
      /* SPST toggle switch schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="4" cy="14" r="2" />
        <circle cx="20" cy="14" r="2" />
        <line x1="6" y1="13" x2="18" y2="7" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: 'battery.9v',
    name: '9V Battery',
    category: 'Power',
    pins: 2,
    shortcut: 'B',
    icon: (c) => (
      /* Multi-cell battery schematic with alternating long & short plates */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="5" y1="6" x2="19" y2="6" strokeWidth="2" />
        <line x1="8" y1="10" x2="16" y2="10" strokeWidth="3" />
        <line x1="5" y1="14" x2="19" y2="14" strokeWidth="2" />
        <line x1="8" y1="18" x2="16" y2="18" strokeWidth="3" />
        <line x1="12" y1="18" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    id: 'battery.3v',
    name: 'Coin Cell 3V',
    category: 'Power',
    pins: 2,
    icon: (c) => (
      /* Single cell battery schematic with + / - indicators */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="8" />
        <line x1="4" y1="8" x2="20" y2="8" strokeWidth="2" />
        <line x1="8" y1="14" x2="16" y2="14" strokeWidth="3.5" />
        <line x1="12" y1="14" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'ground',
    name: 'Earth Ground',
    category: 'Power',
    pins: 1,
    shortcut: 'G',
    icon: (c) => (
      /* Earth ground 3 decreasing parallel horizontal lines */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="10" />
        <line x1="4" y1="10" x2="20" y2="10" />
        <line x1="7" y1="14" x2="17" y2="14" />
        <line x1="10" y1="18" x2="14" y2="18" />
      </svg>
    ),
  },
  {
    id: 'diode.1n4007',
    name: 'Diode (1N4007)',
    category: 'Semi',
    pins: 2,
    icon: (c) => (
      /* Standard rectifier diode schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="6,6 6,18 16,12" />
        <line x1="16" y1="5" x2="16" y2="19" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="16" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: 'transistor.npn',
    name: 'NPN Transistor',
    category: 'Semi',
    pins: 3,
    icon: (c) => (
      /* NPN bipolar junction transistor with emitter arrow */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
        <line x1="2" y1="12" x2="9" y2="12" />
        <line x1="9" y1="6" x2="9" y2="18" strokeWidth="2.2" />
        <line x1="9" y1="9" x2="17" y2="4" />
        <line x1="9" y1="15" x2="17" y2="20" />
        <polygon points="15,19 17,20 16,17" fill={c} />
      </svg>
    ),
  },
  {
    id: 'arduino.uno',
    name: 'Arduino Uno R3',
    category: 'MCU',
    pins: 28,
    shortcut: 'U',
    icon: (c) => (
      /* Microcontroller package schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="8" y="8" width="8" height="8" rx="1" strokeWidth="1.2" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="15" x2="4" y2="15" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="15" x2="23" y2="15" />
      </svg>
    ),
  },
  {
    id: 'breadboard.small',
    name: 'Breadboard Half',
    category: 'Board',
    pins: 400,
    icon: (c) => (
      /* Breadboard strip layout */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="6" y1="9" x2="18" y2="9" strokeDasharray="1.5 2.5" />
        <line x1="6" y1="15" x2="18" y2="15" strokeDasharray="1.5 2.5" />
      </svg>
    ),
  },
  {
    id: 'motor.dc',
    name: 'DC Motor',
    category: 'Output',
    pins: 2,
    icon: (c) => (
      /* Electric motor schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <path d="M9 16V8l3 4 3-4v8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="1" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="23" />
      </svg>
    ),
  },
  {
    id: 'servo',
    name: 'Micro Servo 9g',
    category: 'Output',
    pins: 3,
    icon: (c) => (
      /* Actuator servo schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 9a3 3 0 0 1 3 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'sensor.ultrasonic',
    name: 'HC-SR04 Ultrasonic',
    category: 'Sensor',
    pins: 4,
    icon: (c) => (
      /* Ultrasonic sensor schematic */
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <circle cx="7" cy="12" r="3" />
        <circle cx="17" cy="12" r="3" />
      </svg>
    ),
  },
];

export const QUICK_PLACE_PARTS: Record<string, string> = {
  r: 'resistor.axial',
  l: 'led.5mm.red',
  c: 'capacitor.ceramic',
  b: 'battery.9v',
  u: 'arduino.uno',
  g: 'ground',
};

export function getPartById(id: string): PartDef | undefined {
  return PARTS.find((p) => p.id === id);
}

export function getPartMeta(partId: string): { prefix: string; name: string; params: Record<string, string> } {
  switch (partId) {
    case 'resistor.axial':
      return { prefix: 'R', name: 'Resistor', params: { resistance: '1 kΩ', tolerance: '5 %' } };
    case 'led.5mm.red':
      return { prefix: 'D', name: 'LED (Red 5mm)', params: { color: 'Red', forward_voltage: '2.0 V', max_current: '20 mA' } };
    case 'capacitor.ceramic':
      return { prefix: 'C', name: 'Capacitor', params: { capacitance: '100 nF' } };
    case 'potentiometer':
      return { prefix: 'RV', name: 'Potentiometer', params: { resistance: '10 kΩ' } };
    case 'pushbutton':
      return { prefix: 'SW', name: 'Pushbutton', params: {} };
    case 'switch.spst':
      return { prefix: 'SW', name: 'Slide Switch', params: {} };
    case 'battery.9v':
      return { prefix: 'V', name: '9V Battery', params: { voltage: '9 V' } };
    case 'battery.3v':
      return { prefix: 'V', name: 'Coin Cell 3V', params: { voltage: '3 V' } };
    case 'ground':
      return { prefix: 'GND', name: 'Earth Ground', params: {} };
    case 'diode.1n4007':
      return { prefix: 'D', name: 'Diode (1N4007)', params: { type: 'Rectifier' } };
    case 'transistor.npn':
      return { prefix: 'Q', name: 'NPN Transistor', params: { model: '2N2222' } };
    case 'arduino.uno':
      return { prefix: 'U', name: 'Arduino Uno R3', params: { mcu: 'ATmega328P', clock: '16 MHz' } };
    case 'breadboard.small':
      return { prefix: 'BB', name: 'Breadboard Half', params: {} };
    case 'motor.dc':
      return { prefix: 'M', name: 'DC Motor', params: { voltage: '5 V' } };
    case 'servo':
      return { prefix: 'M', name: 'Micro Servo 9g', params: { control: 'PWM' } };
    case 'sensor.ultrasonic':
      return { prefix: 'S', name: 'HC-SR04 Ultrasonic', params: { trigger: 'D9', echo: 'D10' } };
    default:
      return { prefix: 'X', name: 'Component', params: {} };
  }
}
