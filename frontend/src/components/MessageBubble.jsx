import { useState } from 'react';
import {
  BsRobot,
  BsPerson,
  BsClipboard,
  BsClipboardCheck,
  BsMicFill,
  BsCheckCircle,
} from 'react-icons/bs';
import './MessageBubble.css';

/**
 * MessageBubble — Renders a single conversation message
 * Supports: user/ai roles, voice/text origin, code snippets, state labels
 */
export default function MessageBubble({ message }) {
  const {
    role,       // 'user' | 'ai'
    content,    // string
    timestamp,
    origin,     // 'voice' | 'text'
    state,      // 'thinking' | 'streaming' | 'complete'
    codeSnippet,
    language,
  } = message;

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAI   = role === 'ai';
  const isUser = role === 'user';

  return (
    <div className={`bubble ${isAI ? 'bubble--ai' : 'bubble--user'}`}>
      {/* Avatar */}
      <div className={`bubble__avatar ${isAI ? 'bubble__avatar--ai' : 'bubble__avatar--user'}`}>
        {isAI
          ? <BsRobot size={14} />
          : <BsPerson size={14} />
        }
      </div>

      {/* Content */}
      <div className="bubble__content">
        {/* Header row */}
        <div className="bubble__header">
          <span className="bubble__role">{isAI ? 'VoxCoder AI' : 'You'}</span>

          {origin === 'voice' && (
            <span className="bubble__origin-tag">
              <BsMicFill size={9} /> voice
            </span>
          )}

          {state && state !== 'complete' && (
            <span className={`bubble__state bubble__state--${state}`}>
              {state === 'thinking'  && '⟳ thinking…'}
              {state === 'streaming' && '▌ streaming…'}
            </span>
          )}

          {state === 'complete' && isAI && (
            <span className="bubble__state bubble__state--complete">
              <BsCheckCircle size={10} /> complete
            </span>
          )}

          <span className="bubble__time">{timestamp}</span>
        </div>

        {/* Message text */}
        <div className={`bubble__text ${isAI ? 'bubble__text--ai' : ''}`}>
          {content}
        </div>

        {/* Inline code snippet (short) */}
        {codeSnippet && (
          <div className="bubble__code">
            <div className="bubble__code-header">
              <span className="bubble__code-lang">{language || 'code'}</span>
              <button
                className="bubble__code-copy"
                onClick={() => handleCopy(codeSnippet)}
                title="Copy code"
              >
                {copied
                  ? <><BsClipboardCheck size={11} /> Copied</>
                  : <><BsClipboard size={11} />     Copy</>
                }
              </button>
            </div>
            <pre className="bubble__code-body">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/** Typing / thinking indicator shown while AI is responding */
export function TypingIndicator() {
  return (
    <div className="bubble bubble--ai">
      <div className="bubble__avatar bubble__avatar--ai">
        <BsRobot size={14} />
      </div>
      <div className="bubble__content">
        <div className="bubble__header">
          <span className="bubble__role">VoxCoder AI</span>
          <span className="bubble__state bubble__state--thinking">⟳ thinking…</span>
        </div>
        <div className="bubble__typing">
          <span className="bubble__dot" />
          <span className="bubble__dot" />
          <span className="bubble__dot" />
        </div>
      </div>
    </div>
  );
}
