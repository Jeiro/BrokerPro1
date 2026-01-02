import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { currentUser, isAdmin } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState([]);
    const [adminUnreadCount, setAdminUnreadCount] = useState(0);
    const [userUnreadCount, setUserUnreadCount] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Poll for updates every few seconds to simulate real-time
    useEffect(() => {
        const fetchChats = () => {
            if (isAdmin()) {
                const convos = chatService.getAllConversations();
                setConversations(convos);
                setAdminUnreadCount(chatService.getAdminUnreadCount());
            } else if (currentUser) {
                const messages = chatService.getUserMessages(currentUser.id);
                setActiveChat(messages);
                setUserUnreadCount(chatService.getUserUnreadCount(currentUser.id));
            }
        };

        fetchChats();
        const interval = setInterval(fetchChats, 3000);

        return () => clearInterval(interval);
    }, [currentUser, refreshTrigger]);

    const sendMessage = (text) => {
        if (!currentUser) return;

        const messageData = {
            text,
            sender: isAdmin() ? 'admin' : 'user',
            userName: currentUser.fullName,
            userEmail: currentUser.email
        };

        // If admin is sending, we need the target user ID (passed differently usually)
        // But for the user-facing chat component, it's always sending to themselves (storage-wise)
        // For admin replying, we'll handle that in the AdminChat component directly accessing chatService
        // This sendMessage is primarily for the current user context

        chatService.sendMessage(currentUser.id, messageData);
        setRefreshTrigger(prev => prev + 1);
    };

    const markAsRead = (userId) => {
        const reader = isAdmin() ? 'admin' : 'user';
        chatService.markAsRead(userId, reader);
        setRefreshTrigger(prev => prev + 1);
    };

    const value = {
        conversations,
        activeChat, // For regular user
        adminUnreadCount,
        userUnreadCount,
        sendMessage,
        markAsRead,
        refreshChats: () => setRefreshTrigger(prev => prev + 1)
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
