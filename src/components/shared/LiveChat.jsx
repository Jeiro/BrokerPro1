import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Headphones, Check, CheckCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const LiveChat = () => {
  const { activeChat, sendMessage, markAsRead, userUnreadCount } = useChat();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (currentUser && userUnreadCount > 0) {
        markAsRead(currentUser.id);
      }
    }
  }, [activeChat, isOpen, userUnreadCount]);

  // Handle when chat opens
  useEffect(() => {
    if (isOpen && currentUser) {
      markAsRead(currentUser.id);
    }
  }, [isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage(inputValue);
    setInputValue('');
  };

  // Only show chat for logged in users
  if (!currentUser) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-colors ${isOpen ? 'bg-gray-400 opacity-0 pointer-events-none' : 'bg-blue-600 text-white'
          }`}
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          {userUnreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">
              {userUnreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Customer Support</h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> We typically reply in minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {/* Welcome Message */}
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none">
                  <p>Hello {currentUser.fullName}! How can we help you today?</p>
                  <span className="text-[10px] mt-1 block opacity-70 text-gray-400">
                    Just now
                  </span>
                </div>
              </div>

              {activeChat.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}>
                    <p className="break-words">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                      <span className="text-[10px]">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender === 'user' && (
                        <span>
                          {msg.read ? <CheckCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none max-h-24 min-h-[44px] overflow-hidden"
                  rows="1"
                  style={{ height: 'auto', minHeight: '44px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm mb-0.5"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
        </div>
      )}
    </>
  );
};

export default LiveChat;