import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, User, MessageSquare, Clock, Check, CheckCircle, ChevronLeft } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { chatService } from '../../services/chatService';

const AdminChat = () => {
    const { conversations, refreshChats, markAsRead } = useChat();
    const [selectedChat, setSelectedChat] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat, conversations]);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        markAsRead(chat.userId);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedChat) return;

        const messageData = {
            text: inputValue,
            sender: 'admin',
            userName: 'Support Agent', // Or get actual admin name
            userEmail: 'support@broker.com'
        };

        chatService.sendMessage(selectedChat.userId, messageData);
        setInputValue('');
        refreshChats();

        // Update local selected chat immediately for responsiveness
        // In a real app with WebSockets this wouldn't be needed in this way
        const updatedMessages = [
            ...selectedChat.messages,
            {
                ...messageData,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                read: false
            }
        ];
        setSelectedChat(prev => ({ ...prev, messages: updatedMessages }));
    };

    const filteredConversations = conversations.filter(chat =>
        chat.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-6rem)] bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden">

            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        Support Messages
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No messages found</p>
                        </div>
                    ) : (
                        filteredConversations.map((chat) => (
                            <button
                                key={chat.userId}
                                onClick={() => handleSelectChat(chat)}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${selectedChat?.userId === chat.userId ? 'bg-blue-50/50 border-blue-100' : ''
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                                        {chat.userName.charAt(0).toUpperCase()}
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-medium truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                                            {chat.userName}
                                        </h3>
                                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                                            {new Date(chat.lastMessageTime).toLocaleDateString() === new Date().toLocaleDateString()
                                                ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : new Date(chat.lastMessageTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {!selectedChat ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium text-gray-500">Select a conversation to start chatting</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                            <button
                                onClick={() => setSelectedChat(null)}
                                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                {selectedChat.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{selectedChat.userName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    {selectedChat.userEmail}
                                </p>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                            {selectedChat.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex flex-col max-w-[70%] ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'admin'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}>
                                            <p className="break-words leading-relaxed">{msg.text}</p>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 px-1">
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.sender === 'admin' && (
                                                <span className="text-blue-600">
                                                    {msg.read ? <CheckCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2 items-end max-w-4xl mx-auto">
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
                                        placeholder="Type your reply..."
                                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none max-h-32 min-h-[44px]"
                                        rows="1"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
