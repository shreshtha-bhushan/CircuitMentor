import { useState } from 'react';
import type { PlacedComponent } from '../App';

interface MentorDockProps {
  selectedComponent: PlacedComponent | null;
}

interface Message {
  id: string;
  role: 'student' | 'assistant';
  text: string;
  hintLevel?: number;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'student',
    text: 'Why is D1 dim?',
  },
  {
    id: 'm2',
    role: 'assistant',
    text: 'Look at what sits between D1 and the 5 V rail. Is there anything controlling how much current flows through the LED?',
    hintLevel: 1,
  },
  {
    id: 'm3',
    role: 'student',
    text: 'Why does that matter?',
  },
  {
    id: 'm4',
    role: 'assistant',
    text: 'Nothing is limiting current on that path. An LED is a diode — once it turns on past its forward voltage, its resistance drops very low. Without a series resistor, the current is set only by the supply and the LED\'s internal resistance, which is almost zero.',
    hintLevel: 2,
  },
];

export default function MentorDock({ selectedComponent }: MentorDockProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [isStreaming] = useState(true);

  const contextParts = selectedComponent
    ? [selectedComponent.designator, `${selectedComponent.name}`, `Net N$7`]
    : ['R1 · 220Ω', 'D1 · Red', 'Net N$7'];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `m_${Date.now()}`,
      role: 'student',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate responsive tutor guidance
    setTimeout(() => {
      const tutorReply: Message = {
        id: `t_${Date.now()}`,
        role: 'assistant',
        text: `Consider the voltage drop across the component. According to Ohm's Law (V = IR), if resistance approaches zero, current surges rapidly. Adding a 220 Ω resistor will establish an ideal ~13.6 mA operating point.`,
        hintLevel: 3,
      };
      setMessages((prev) => [...prev, tutorReply]);
    }, 800);
  };

  return (
    <div className="mentor">
      {/* Mentor Header */}
      <div className="mentor-header">
        <div className="mentor-dot" />
        <span className="mentor-title">AI Mentor</span>
        <span className="mentor-role-badge">Online · Socratic Mode</span>
      </div>

      {/* Figma Pattern #4: Flat sections separated by generous whitespace without card borders */}
      <div className="mentor-scroll-area">
        {/* Section A: Conversation Thread */}
        <div className="mentor-flat-section">
          <div className="mentor-section-heading">Diagnostic Thread</div>
          <div className="mentor-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="mentor-msg-wrapper">
                <div className={`mentor-msg ${msg.role}`}>
                  {msg.text}
                  {msg.role === 'assistant' && isStreaming && msg.id === messages[messages.length - 1]?.id && (
                    <span className="mentor-caret" />
                  )}
                </div>

                {/* Hint level badge */}
                {msg.hintLevel !== undefined && (
                  <div className="hint-level-meta">
                    Hint level {msg.hintLevel} of 5 · Socratic
                  </div>
                )}
              </div>
            ))}

            {/* Escalation Button */}
            <button className="mentor-escalation" type="button">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <span>Explain forward voltage drop in depth</span>
            </button>

            {/* Citation Link */}
            <button className="mentor-citation" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>LED forward voltage characteristics · Art of Electronics p.44</span>
            </button>
          </div>
        </div>

        {/* Section B: Circuit Context Chips */}
        <div className="mentor-flat-section">
          <div className="mentor-section-heading">Derived Context Layer</div>
          <div className="mentor-context-chips">
            {contextParts.map((chip) => (
              <span key={chip} className="context-chip">
                <span className="context-chip-dot" />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section C: Conversation Input Area */}
      <div className="mentor-input-area">
        <form className="mentor-input-wrapper" onSubmit={handleSendMessage}>
          <input
            className="mentor-input"
            placeholder="Ask mentor why a pin or net is behaving this way..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Ask the mentor"
          />
          <button type="submit" className="mentor-send" aria-label="Send message">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
