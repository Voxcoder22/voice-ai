import { useState, useRef } from 'react';
import { BsSend, BsLightningChargeFill, BsX } from 'react-icons/bs';
import VoiceButton from './VoiceButton';
import './PromptInput.css';

/**
 * PromptInput — Bottom input bar
 * Text textarea + voice button + send control
 * Handles: multi-line input, submit on Enter, voice events
 */
export default function PromptInput({
  onSend,
  onRecordingStart,
  onRecordingStop,
  isProcessing,
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const canSend = value.trim().length > 0 && !isProcessing;

  const handleSubmit = () => {
    if (!canSend) return;
    onSend?.(value.trim());
    setValue('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setValue('');
    textareaRef.current?.focus();
  };

  return (
    <div className="prompt-bar">
      {/* Quick action chips */}
      <div className="prompt-chips">
        {['Write a Flask API', 'Fix this bug', 'Explain the code', 'Add unit tests'].map(chip => (
          <button
            key={chip}
            className="prompt-chip"
            onClick={() => setValue(chip)}
            title={chip}
          >
            <BsLightningChargeFill size={9} />
            {chip}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="prompt-input-row">
        {/* Voice button */}
        <VoiceButton
          onRecordingStart={onRecordingStart}
          onRecordingStop={onRecordingStop}
          disabled={isProcessing}
        />

        {/* Textarea wrapper */}
        <div className={`prompt-textarea-wrap ${value.length > 0 ? 'has-value' : ''}`}>
          <textarea
            ref={textareaRef}
            className="prompt-textarea"
            rows={1}
            placeholder="Type a prompt or speak… (Enter to send, Shift+Enter for newline)"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          {value.length > 0 && (
            <button
              className="prompt-clear"
              onClick={handleClear}
              title="Clear"
              tabIndex={-1}
            >
              <BsX size={14} />
            </button>
          )}
        </div>

        {/* Send button */}
        <button
          className={`prompt-send ${canSend ? 'prompt-send--active' : ''}`}
          onClick={handleSubmit}
          disabled={!canSend}
          title="Send prompt (Enter)"
        >
          {isProcessing
            ? <span className="prompt-send__spinner" />
            : <BsSend size={16} />
          }
        </button>
      </div>

      {/* Footer hint */}
      <div className="prompt-hint">
        <span>↵ Send</span>
        <span>⇧↵ New line</span>
        <span>🎙 Voice input supported</span>
      </div>
    </div>
  );
}
