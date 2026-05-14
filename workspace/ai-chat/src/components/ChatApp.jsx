import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const ChatApp = () => {
  const [chats, setChats] = useState([
    { id: 1, title: 'General Chat', active: true, messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);

  const handleNewChat = () => {
    const newChatId = Math.max(...chats.map(chat => chat.id), 0) + 1;
    const newChat = {
      id: newChatId,
      title: `Chat ${newChatId}`,
      active: true,
      messages: [],
    };

    setChats(prevChats => [
      ...prevChats.map(chat => ({ ...chat, active: false })),
      newChat,
    ]);
    setCurrentChatId(newChatId);
  };

  const handleSelectChat = (chatId) => {
    setChats(prevChats =>
      prevChats.map(chat => ({
        ...chat,
        active: chat.id === chatId,
      }))
    );
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);
      if (updatedChats.length === 0) {
        return [{ id: 1, title: 'General Chat', active: true, messages: [] }];
      }
      if (chatId === currentChatId) {
        const newActiveChatId = updatedChats[0].id;
        setCurrentChatId(newActiveChatId);
        return updatedChats.map(chat => ({
          ...chat,
          active: chat.id === newActiveChatId,
        }));
      }
      return updatedChats;
    });
  };

  const handleSendMessage = (messageText) => {
    const newMessage = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      })
    );

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        text: `I received your message: "${messageText}". This is a simulated response from the AI.`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, aiResponse],
            };
          }
          return chat;
        })
      );
    }, 1000);
  };

  const currentChat = chats.find(chat => chat.id === currentChatId);

  return (
    <div className="chat-app">
      <ChatSidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatWindow
        messages={currentChat?.messages || []}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatApp;