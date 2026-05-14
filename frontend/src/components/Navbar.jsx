import { useState } from 'react';
import {
  BsTerminal,
  BsCircleFill,
  BsGit,
  BsCpu,
  BsWifi,
  BsThreeDotsVertical,
  BsKeyboard,
} from 'react-icons/bs';
import './Navbar.css';

/**
 * Navbar — Top application bar
 * Shows: branding, model selector, workspace status, global actions
 */
const MODELS = [
  { id: 'claude-3-5', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'gpt-4o',     label: 'GPT-4o',            provider: 'OpenAI'    },
  { id: 'gemini-pro', label: 'Gemini 1.5 Pro',     provider: 'Google'   },
];

export default function Navbar({ isRecording, isProcessing }) {
  const [activeModel, setActiveModel] = useState(MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);

  return (
    <header className="navbar">
      {/* ── Brand ── */}
      <div className="navbar__brand">
        <BsTerminal className="navbar__logo-icon" />
        <span className="navbar__logo-text">VoxCoder</span>
        <span className="navbar__badge">POC v0.1</span>
      </div>

      {/* ── Workspace info ── */}
      <div className="navbar__workspace">
        <BsGit className="navbar__ws-icon" />
        <span className="navbar__ws-path">workspace / voice-poc</span>
        <span className="navbar__ws-branch">main</span>
      </div>

      {/* ── Model selector ── */}
      <div className="navbar__model-wrap">
        <button
          className="navbar__model-btn"
          onClick={() => setShowModelMenu(v => !v)}
          title="Switch AI model"
        >
          <BsCpu size={13} />
          <span className="navbar__model-label">{activeModel.label}</span>
          <span className="navbar__model-provider">{activeModel.provider}</span>
        </button>

        {showModelMenu && (
          <div className="navbar__model-menu">
            {MODELS.map(m => (
              <button
                key={m.id}
                className={`navbar__model-option ${m.id === activeModel.id ? 'active' : ''}`}
                onClick={() => { setActiveModel(m); setShowModelMenu(false); }}
              >
                <BsCpu size={11} />
                <span>{m.label}</span>
                <span className="navbar__model-option-provider">{m.provider}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Status indicators ── */}
      <div className="navbar__indicators">
        {isRecording && (
          <div className="navbar__status navbar__status--recording">
            <BsCircleFill size={7} />
            <span>Recording</span>
          </div>
        )}
        {isProcessing && (
          <div className="navbar__status navbar__status--processing">
            <span className="navbar__spinner" />
            <span>Processing</span>
          </div>
        )}
        {!isRecording && !isProcessing && (
          <div className="navbar__status navbar__status--ready">
            <BsWifi size={12} />
            <span>Ready</span>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="navbar__actions">
        <button className="navbar__icon-btn" title="Keyboard shortcuts">
          <BsKeyboard size={15} />
        </button>
        <button className="navbar__icon-btn" title="More options">
          <BsThreeDotsVertical size={15} />
        </button>
      </div>
    </header>
  );
}
