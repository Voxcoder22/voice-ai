import { useEffect, useRef } from 'react';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import './ChatContainer.css';

/** Mock conversation demonstrating conversational programming */


export default function ChatContainer({ messages, isTyping }) {
  const bottomRef = useRef(null);

  // Append new messages from parent

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header__left">
          <span className="chat-header__title">Conversation</span>
          <span className="chat-header__count">{messages.length} messages</span>
        </div>
        <div className="chat-header__state">
          <span className="chat-state-dot chat-state-dot--active" />
          <span className="chat-header__state-label">Session Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <div className="chat-messages__inner">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
