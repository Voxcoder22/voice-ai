import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';

const ChatWindow = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-avatar">
              {message.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-content">
              <div className="message-sender">
                {message.sender === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Fixed typo: targetValue -> target.value
          placeholder="Type your message here..."
        />
        <button type="submit" className="send-button">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;