import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, Trash2 } from 'lucide-react';

const ChatSidebar = ({ chats, onSelectChat, onNewChat, onDeleteChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`chat-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button
          className="toggle-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '>' : '<'}
        </button>
        {!isCollapsed && (
          <>
            <h2>AI Chat</h2>
            <button className="new-chat-button" onClick={onNewChat}>
              <Plus size={18} /> New Chat
            </button>
          </>
        )}
      </div>
      {!isCollapsed && (
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${chat.active ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare size={16} />
              <span className="chat-title">{chat.title}</span>
              <button
                className="delete-chat-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <button className="settings-button">
            <Settings size={18} /> Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;