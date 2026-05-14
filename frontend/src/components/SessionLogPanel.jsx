import { useState } from 'react';
import {
  BsJournalCode,
  BsTrash,
  BsDownload,
  BsFunnelFill,
  BsActivity,
} from 'react-icons/bs';
import './SessionLogPanel.css';

/** Full session log with filter capability */
const ALL_LOGS = [
  { id: 1,  time: '10:41:00', type: 'system',  msg: 'Session initialized',              detail: 'Model: Claude 3.5 Sonnet' },
  { id: 2,  time: '10:41:01', type: 'system',  msg: 'Workspace loaded',                  detail: 'workspace/voice-poc' },
  { id: 3,  time: '10:42:11', type: 'voice',   msg: 'Voice input captured',              detail: 'Duration: 2.3s | Transcript confidence: 94%' },
  { id: 4,  time: '10:42:12', type: 'info',    msg: 'Transcription complete',            detail: '"Create a Flask REST API with a /health endpoint…"' },
  { id: 5,  time: '10:42:13', type: 'ai',      msg: 'Model inference started',           detail: 'Tokens in: 78' },
  { id: 6,  time: '10:42:17', type: 'code',    msg: 'Code block generated',             detail: 'app.py — 48 lines (python)' },
  { id: 7,  time: '10:42:18', type: 'ai',      msg: 'Response streamed',                detail: 'Tokens out: 142 | Latency: 380ms' },
  { id: 8,  time: '10:43:01', type: 'voice',   msg: 'Voice input captured',             detail: 'Duration: 1.8s | Transcript confidence: 91%' },
  { id: 9,  time: '10:43:02', type: 'info',    msg: 'Transcription complete',           detail: '"Add a /generate endpoint that accepts a prompt…"' },
  { id: 10, time: '10:43:03', type: 'ai',      msg: 'Model inference started',          detail: 'Tokens in: 214' },
  { id: 11, time: '10:43:07', type: 'code',    msg: 'Code updated',                     detail: 'app.py — 12 lines changed' },
  { id: 12, time: '10:43:08', type: 'ai',      msg: 'Response complete',                detail: 'Tokens out: 98 | Latency: 290ms' },
  { id: 13, time: '10:43:09', type: 'warning', msg: 'Latency spike detected',            detail: '430ms (threshold: 400ms)' },
  { id: 14, time: '10:43:10', type: 'system',  msg: 'Conversation state: IDLE',          detail: 'Awaiting next input' },
];

const LOG_TYPES = ['all', 'system', 'voice', 'ai', 'code', 'warning', 'info'];

export default function SessionLogPanel() {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === 'all'
    ? ALL_LOGS
    : ALL_LOGS.filter(l => l.type === filter);

  return (
    <div className="log-panel">
      {/* Header */}
      <div className="log-panel__header">
        <div className="log-panel__title-row">
          <BsJournalCode size={13} style={{ color: 'var(--accent-primary)' }} />
          <span className="log-panel__title">Session Log</span>
          <span className="log-panel__count">{ALL_LOGS.length}</span>
        </div>
        <div className="log-panel__actions">
          <button className="log-panel__btn" title="Export log">
            <BsDownload size={11} />
          </button>
          <button className="log-panel__btn" title="Clear log">
            <BsTrash size={11} />
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="log-panel__filters">
        <BsFunnelFill size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        {LOG_TYPES.map(t => (
          <button
            key={t}
            className={`log-filter-btn ${filter === t ? 'active' : ''} log-filter-btn--${t}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="log-panel__stats">
        <div className="log-stat">
          <BsActivity size={10} />
          <span className="log-stat__value">2</span>
          <span className="log-stat__label">voice inputs</span>
        </div>
        <div className="log-stat">
          <span className="log-stat__value">2</span>
          <span className="log-stat__label">AI calls</span>
        </div>
        <div className="log-stat">
          <span className="log-stat__value">335ms</span>
          <span className="log-stat__label">avg latency</span>
        </div>
      </div>

      {/* Log list */}
      <div className="log-panel__body">
        {filtered.map(entry => (
          <div
            key={entry.id}
            className={`log-entry-full log-entry-full--${entry.type} ${expanded === entry.id ? 'expanded' : ''}`}
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <div className="log-entry-full__row">
              <span className="log-entry-full__time">{entry.time}</span>
              <span className={`log-entry-full__badge log-entry-full__badge--${entry.type}`}>
                {entry.type}
              </span>
              <span className="log-entry-full__msg">{entry.msg}</span>
            </div>
            {expanded === entry.id && entry.detail && (
              <div className="log-entry-full__detail">{entry.detail}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
