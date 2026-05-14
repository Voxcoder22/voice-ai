import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Copy, Check } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: `I received your message: "${inputValue}". This is a simulated response from the AI.`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-screen pt-16">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={messageVariants}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl p-4 rounded-lg ${message.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
                <div className="flex items-center mb-2">
                  {message.sender === 'bot' ? (
                    <Bot className="h-5 w-5 mr-2 text-purple-600" />
                  ) : (
                    <User className="h-5 w-5 mr-2 text-white" />
                  )}
                  <span className="font-semibold">
                    {message.sender === 'bot' ? 'AI Assistant' : 'You'}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.sender === 'bot' && (
                  <button
                    onClick={() => copyToClipboard(message.text)}
                    className="mt-2 text-sm text-purple-200 hover:text-white flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-w-3xl">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-purple-600 animate-pulse" />
                <span className="font-semibold">AI Assistant</span>
              </div>
              <div className="mt-2 flex space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;