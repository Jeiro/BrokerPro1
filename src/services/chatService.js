import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '../utils/localStorage';

// In-memory chat storage
let chatMessages = {};

// Helper to get all chats from memory
const getChats = () => {
    return chatMessages;
};

// Helper to save chats to memory
const saveChats = (chats) => {
    chatMessages = chats;
    return true;
};

export const chatService = {
    // Get all messages for a specific user
    getUserMessages: (userId) => {
        const chats = getChats();
        return chats[userId] || [];
    },

    // Get all users who have started a chat (for admin)
    getAllConversations: () => {
        const chats = getChats();
        const conversations = [];

        // Get user details for each conversation (mocked or from local storage)
        // In a real app, you'd fetch user profiles. Here we'll try to get from message metadata

        Object.keys(chats).forEach(userId => {
            const messages = chats[userId];
            if (messages.length > 0) {
                // Find the last message and user info from user messages
                const lastMessage = messages[messages.length - 1];
                const userMsg = messages.find(m => m.sender === 'user') || {};
                const unreadCount = messages.filter(m => !m.read && m.sender === 'user').length;

                conversations.push({
                    userId,
                    userName: userMsg.userName || 'Anonymous User',
                    userEmail: userMsg.userEmail || 'No Email',
                    lastMessage: lastMessage.text,
                    lastMessageTime: lastMessage.timestamp,
                    unreadCount,
                    messages
                });
            }
        });

        return conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    },

    // Send a message
    sendMessage: (userId, messageData) => {
        const chats = getChats();
        const user = getCurrentUser();

        if (!chats[userId]) {
            chats[userId] = [];
        }

        const newMessage = {
            id: uuidv4(),
            text: messageData.text,
            sender: messageData.sender, // 'user' or 'admin'
            timestamp: new Date().toISOString(),
            read: false,
            // Store user info in message to help identify them in admin view
            userName: user ? user.fullName : messageData.userName,
            userEmail: user ? user.email : messageData.userEmail
        };

        chats[userId].push(newMessage);
        saveChats(chats);

        return newMessage;
    },

    // Mark messages as read
    markAsRead: (userId, reader) => { // reader = 'admin' or 'user'
        const chats = getChats();
        if (chats[userId]) {
            chats[userId] = chats[userId].map(msg => {
                // If admin is reading, mark user messages as read
                if (reader === 'admin' && msg.sender === 'user') {
                    return { ...msg, read: true };
                }
                // If user is reading, mark admin messages as read
                if (reader === 'user' && msg.sender === 'admin') {
                    return { ...msg, read: true };
                }
                return msg;
            });
            saveChats(chats);
        }
    },

    // Get total unread count for admin
    getAdminUnreadCount: () => {
        const chats = getChats();
        let count = 0;
        Object.values(chats).forEach(messages => {
            count += messages.filter(m => !m.read && m.sender === 'user').length;
        });
        return count;
    },

    // Get unread count for a specific user
    getUserUnreadCount: (userId) => {
        const chats = getChats();
        const messages = chats[userId] || [];
        return messages.filter(m => !m.read && m.sender === 'admin').length;
    }
};
