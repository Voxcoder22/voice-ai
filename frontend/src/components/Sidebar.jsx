import { useState } from 'react';
import {
  BsClockHistory,
  BsJournalCode,
  BsGearFill,
  BsPlus,
  BsSearch,
  BsChatLeftDots,
  BsTrash,
  BsChevronRight,
  BsMicFill,
  BsKeyboard,
  BsActivity,
} from 'react-icons/bs';
import './Sidebar.css';

/** Mock session history data */

/** Nav tabs in sidebar */
const TABS = [
  { id: 'sessions', icon: BsClockHistory, label: 'Sessions' },
  { id: 'logs',     icon: BsJournalCode,  label: 'Logs'     },
  { id: 'settings', icon: BsGearFill,     label: 'Settings' },
];

export default function Sidebar({
    sessions,
    onNewSession,
    onDeleteSession,
    onSelectSession,
    activeSessionId,
  }) {
  const [activeTab, setActiveTab] = useState('sessions');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSession, setHoveredSession] = useState(null);

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="sidebar">
      {/* ── Tab nav ── */}
      <nav className="sidebar__tabs">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`sidebar__tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
            title={label}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Sessions tab ── */}
      {activeTab === 'sessions' && (
        <div className="sidebar__content">
          {/* New session button */}
          <button className="sidebar__new-btn" onClick={onNewSession}>
            <BsPlus size={16} />
            New Session
          </button>

          {/* Search */}
          <div className="sidebar__search">
            <BsSearch size={11} className="sidebar__search-icon" />
            <input
              type="text"
              placeholder="Search sessions…"
              className="sidebar__search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Section header */}
          <div className="sidebar__section-header">
            <span>Recent</span>
            <span className="sidebar__count">{filtered.length}</span>
          </div>

          {/* Session list */}
          <ul className="sidebar__list">
            {filtered.map(session => (
              <li
                key={session.id}
                className={`sidebar__item ${session.id === activeSessionId ? 'active' : ''}`}
                onClick={() => onSelectSession?.(session.id)}
                onMouseEnter={() => setHoveredSession(session.id)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                <div className="sidebar__item-icon">
                  <BsChatLeftDots size={13} />
                  {session.mode === 'voice' && (
                    <span className="sidebar__voice-dot" title="Voice session">
                      <BsMicFill size={7} />
                    </span>
                  )}
                </div>

                <div className="sidebar__item-body">
                  <span className="sidebar__item-title">{session.title}</span>
                  <div className="sidebar__item-meta">
                    <span className="sidebar__item-time">{session.timestamp}</span>
                    <span className="sidebar__item-msgs">{session.messages} msgs</span>
                  </div>
                </div>

                {session.id === activeSessionId && (
                  <BsChevronRight size={10} className="sidebar__item-arrow" />
                )}
                {hoveredSession === session.id && session.id !== activeSessionId && (
                  <button
                    className="sidebar__item-delete"
                    onClick={e => { 
                      e.stopPropagation(); 
                      onDeleteSession?.(session.id);
                    }}
                    title="Delete session"
                  >
                    <BsTrash size={11} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Logs tab ── */}
      {activeTab === 'logs' && (
        <div className="sidebar__content">
          <div className="sidebar__section-header">
            <span>Activity Log</span>
            <BsActivity size={11} style={{ color: 'var(--green-bright)' }} />
          </div>
          <LogsView />
        </div>
      )}

      {/* ── Settings tab ── */}
      {activeTab === 'settings' && (
        <div className="sidebar__content">
          <SettingsView />
        </div>
      )}

      {/* ── Footer ── */}
      <div className="sidebar__footer">
        <div className="sidebar__footer-row">
          <BsKeyboard size={12} />
          <span>⌘K for commands</span>
        </div>
      </div>
    </aside>
  );
}

/* ---- Inline sub-components ---- */

const LOG_ENTRIES = [
  { id: 1, type: 'info',    time: '10:42:03', msg: 'Session started'                  },
  { id: 2, type: 'voice',   time: '10:42:11', msg: 'Voice input detected (2.3s)'      },
  { id: 3, type: 'ai',      time: '10:42:14', msg: 'Model inference started'           },
  { id: 4, type: 'code',    time: '10:42:17', msg: 'Code block generated (48 lines)'   },
  { id: 5, type: 'info',    time: '10:42:18', msg: 'Response streamed to chat'         },
  { id: 6, type: 'voice',   time: '10:43:01', msg: 'Voice input detected (1.8s)'      },
  { id: 7, type: 'ai',      time: '10:43:04', msg: 'Refining previous code block'      },
  { id: 8, type: 'code',    time: '10:43:08', msg: 'Code updated (12 lines changed)'  },
  { id: 9, type: 'warning', time: '10:43:09', msg: 'Latency spike: 430ms'             },
  { id: 10, type: 'info',   time: '10:43:10', msg: 'Response complete'                },
];

function LogsView() {
  return (
    <ul className="log-list">
      {LOG_ENTRIES.map(entry => (
        <li key={entry.id} className={`log-entry log-entry--${entry.type}`}>
          <span className="log-time">{entry.time}</span>
          <span className="log-badge">{entry.type}</span>
          <span className="log-msg">{entry.msg}</span>
        </li>
      ))}
    </ul>
  );
}

function SettingsView() {
  return (
    <div className="settings-placeholder">
      <div className="settings-section">
        <span className="settings-label">Voice Input</span>
        <div className="settings-row">
          <span>Auto-detect silence</span>
          <div className="settings-toggle active" />
        </div>
        <div className="settings-row">
          <span>Noise cancellation</span>
          <div className="settings-toggle active" />
        </div>
      </div>
      <div className="settings-section">
        <span className="settings-label">AI Behaviour</span>
        <div className="settings-row">
          <span>Stream responses</span>
          <div className="settings-toggle active" />
        </div>
        <div className="settings-row">
          <span>Auto-run code</span>
          <div className="settings-toggle" />
        </div>
      </div>
      <div className="settings-section">
        <span className="settings-label">Backend</span>
        <div className="settings-row">
          <span>API Endpoint</span>
        </div>
        <div className="settings-input-row">
          <input
            className="settings-input"
            defaultValue="http://localhost:5000"
            readOnly
          />
        </div>
      </div>
      <p className="settings-note">
        Backend integration pending. Connect Flask API to enable live AI responses.
      </p>
    </div>
  );
}
