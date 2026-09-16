import { useState } from 'react';
import type { PlacedComponent } from '../App';

interface CodeEditorProps {
  components: PlacedComponent[];
  onAddMcu?: () => void;
}

const DEFAULT_SKETCH = `// CircuitMentor — Arduino Uno Firmware
const int PIN_LED = 13;
const int PIN_TRIGGER = 7;
const int PIN_ECHO = 8;

void setup() {
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_TRIGGER, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  Serial.begin(9600);
}

void loop() {
  // Trigger ultrasonic ping
  digitalWrite(PIN_TRIGGER, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIGGER, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIGGER, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH);
  long cm = duration / 29 / 2;

  // Threshold detection
  if (cm < 15 && cm > 0) {
    digitalWrite(PIN_LED, HIGH);
  } else {
    digitalWrite(PIN_LED, LOW);
  }
  delay(60);
}`;

export default function CodeEditor({ components, onAddMcu }: CodeEditorProps) {
  const [code, setCode] = useState(DEFAULT_SKETCH);
  const [compileStatus, setCompileStatus] = useState<'compiled' | 'compiling' | 'error'>('compiled');

  // Detect whether an MCU is present on canvas
  const mcuComponent = components.find(
    (c) => c.partId.startsWith('arduino') || c.partId.includes('mcu') || c.name.toLowerCase().includes('arduino')
  );

  const handleVerify = () => {
    setCompileStatus('compiling');
    setTimeout(() => {
      setCompileStatus('compiled');
    }, 900);
  };

  const handleUpload = () => {
    setCompileStatus('compiling');
    setTimeout(() => {
      setCompileStatus('compiled');
    }, 1200);
  };

  // If no MCU is present, show empty state per prompt
  if (!mcuComponent) {
    return (
      <div className="code-empty-state">
        <div className="code-empty-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        </div>
        <h3 className="code-empty-title">Add a microcontroller to write code for it</h3>
        <p className="code-empty-desc">
          Drag an Arduino Uno R3 from the Component Library onto the canvas to edit, verify, and simulate firmware logic.
        </p>
        {onAddMcu && (
          <button className="btn btn-primary" onClick={onAddMcu}>
            + Place Arduino Uno
          </button>
        )}
      </div>
    );
  }

  const lines = code.split('\n');

  return (
    <div className="code-tab-container">
      {/* Compile / Upload Status Strip at top of tab */}
      <div className="code-status-strip">
        <div className="status-chip-group">
          {compileStatus === 'compiled' && (
            <span className="compile-chip chip-success">
              <span className="compile-dot dot-success" />
              <span>Compiled · 0 warnings</span>
            </span>
          )}
          {compileStatus === 'compiling' && (
            <span className="compile-chip chip-running">
              <span className="compile-dot dot-running" />
              <span>Compiling…</span>
            </span>
          )}
          {compileStatus === 'error' && (
            <span className="compile-chip chip-error">
              <span className="compile-dot dot-error" />
              <span>Compile error at line 12</span>
            </span>
          )}
          <span className="mcu-target-tag">{mcuComponent.designator} (Uno)</span>
        </div>

        <div className="code-action-buttons">
          <button
            className="code-action-btn"
            onClick={handleVerify}
            title="Verify / Compile (⌘R)"
            aria-label="Verify sketch"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verify</span>
          </button>

          <button
            className="code-action-btn btn-upload"
            onClick={handleUpload}
            title="Upload to Virtual MCU (⌘U)"
            aria-label="Upload sketch"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* CodeMirror 6 Style Dark Monospace Editor */}
      <div className="code-editor-body">
        {/* Line Numbers Gutter */}
        <div className="code-gutter" aria-hidden="true">
          {lines.map((_, i) => (
            <div key={i} className="gutter-line-num">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea / Input Surface */}
        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Arduino C++ source code"
        />
      </div>
    </div>
  );
}
