import { BsCircleFill, BsCpu, BsMicFill, BsHddFill, BsClock } from 'react-icons/bs';
import './StatusBar.css';

/**
 * StatusBar — Thin bottom bar showing global system state
 * Model, session time, token count, voice state, memory usage
 */
export default function StatusBar({ isRecording, isProcessing, sessionDuration = '00:02:10' }) {
  const voiceState =
    isRecording  ? 'recording'  :
    isProcessing ? 'processing' :
    'idle';

  return (
    <footer className="status-bar">
      {/* Left group */}
      <div className="status-bar__group">
        {/* Connection status */}
        <div className={`status-item status-item--${voiceState === 'idle' ? 'ok' : voiceState}`}>
          <BsCircleFill size={6} />
          <span>
            {voiceState === 'recording'  ? 'REC' :
             voiceState === 'processing' ? 'PROC' :
             'LIVE'}
          </span>
        </div>

        {/* Model */}
        <div className="status-item status-item--neutral">
          <BsCpu size={10} />
          <span>Claude 3.5 Sonnet</span>
        </div>

        {/* Voice state */}
        <div className={`status-item ${isRecording ? 'status-item--recording' : 'status-item--neutral'}`}>
          <BsMicFill size={10} />
          <span>
            {isRecording ? 'Recording active' : 'Voice ready'}
          </span>
        </div>
      </div>

      {/* Center — conversation label */}
      <div className="status-bar__center">
        <span className="status-bar__session-label">Programming by Conversation</span>
        <span className="status-bar__sep">·</span>
        <span className="status-bar__mode">Voice-Interactive Mode</span>
      </div>

      {/* Right group */}
      <div className="status-bar__group status-bar__group--right">
        <div className="status-item status-item--neutral">
          <BsClock size={10} />
          <span>{sessionDuration}</span>
        </div>
        <div className="status-item status-item--neutral">
          <BsHddFill size={10} />
          <span>240 tokens</span>
        </div>
        <div className="status-item status-item--neutral">
          <span>Context: 12%</span>
        </div>
      </div>
    </footer>
  );
}
