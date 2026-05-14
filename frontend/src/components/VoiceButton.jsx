import { useState, useRef, useEffect } from 'react';
import { BsMicFill, BsMicMuteFill, BsStopFill } from 'react-icons/bs';
import './VoiceButton.css';

/**
 * VoiceButton — Animated microphone / recording toggle
 * Shows a waveform animation while recording
 * Calls onRecordingStart / onRecordingStop callbacks
 */
export default function VoiceButton({ onRecordingStart, onRecordingStop, disabled }) {
  const [state, setState] = useState('idle'); // 'idle' | 'recording' | 'processing'
  const timerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleClick = () => {
    if (disabled) return;

    if (state === 'idle') {
      setState('recording');
      onRecordingStart?.();
    } else if (state === 'recording') {
      setState('processing');
      onRecordingStop?.();
      // Simulate processing time before returning to idle
      timerRef.current = setTimeout(() => setState('idle'), 1800);
    }
  };

  const isRecording  = state === 'recording';
  const isProcessing = state === 'processing';

  return (
    <div className={`voice-btn-wrap ${isRecording ? 'voice-btn-wrap--recording' : ''}`}>
      {/* Waveform bars (visible while recording) */}
      {isRecording && (
        <div className="voice-waveform" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="voice-waveform__bar"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Main button */}
      <button
        className={`voice-btn voice-btn--${state}`}
        onClick={handleClick}
        disabled={disabled || isProcessing}
        title={
          isRecording  ? 'Stop recording'  :
          isProcessing ? 'Processing…'     :
          'Start voice input'
        }
        aria-label={
          isRecording  ? 'Stop recording'  :
          isProcessing ? 'Processing audio' :
          'Start voice input'
        }
      >
        {/* Pulse rings (while recording) */}
        {isRecording && (
          <>
            <span className="voice-pulse voice-pulse--1" />
            <span className="voice-pulse voice-pulse--2" />
          </>
        )}

        {/* Icon */}
        <span className="voice-btn__icon">
          {isRecording
            ? <BsStopFill size={18} />
            : isProcessing
            ? <span className="voice-btn__spinner" />
            : <BsMicFill size={18} />
          }
        </span>
      </button>

      {/* Label beneath */}
      <span className="voice-btn__label">
        {isRecording  ? 'Recording…' :
         isProcessing ? 'Processing' :
         'Voice'}
      </span>
    </div>
  );
}
