import React, { createContext, useState } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUserByEmail,
  saveUser,
  updateUser,
  initializeStorage
} from '../utils/localStorage';
import { USER_ROLES } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

export const AuthContext = createContext();

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setUser] = useState(() => {
    initializeStorage();
    return getCurrentUser();
  });
  const [loading, setLoading] = useState(false);

  // Login function
  const login = (email, password) => {
    const user = getUserByEmail(email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    setUser(user);
    setCurrentUser(user);
    return { success: true, message: 'Login successful', user };
  };

  // Register function
  const register = (userData) => {
    const existingUser = getUserByEmail(userData.email);

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: uuidv4(),
      email: userData.email,
      password: userData.password, // In production, hash this!
      fullName: userData.fullName,
      role: USER_ROLES.USER,
      balance: { BTC: 0, USDT: 0, ETH: 0, USD: 0 },
      walletAddresses: { BTC: '', USDT: '', ETH: '' },
      kycStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    const saved = saveUser(newUser);

    if (saved) {
      setUser(newUser);
      setCurrentUser(newUser);
      return { success: true, message: 'Registration successful', user: newUser };
    }

    return { success: false, message: 'Registration failed' };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!currentUser) return { success: false, message: 'No user logged in' };

    const success = updateUser(currentUser.id, updates);

    if (success) {
      const updatedUser = { ...currentUser, ...updates };
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      return { success: true, message: 'Profile updated successfully' };
    }

    return { success: false, message: 'Update failed' };
  };

  // Update user balance
  const updateBalance = (currency, amount) => {
    if (!currentUser) return { success: false, message: 'No user logged in' };

    const newBalance = {
      ...currentUser.balance,
      [currency]: (currentUser.balance[currency] || 0) + amount
    };

    return updateProfile({ balance: newBalance });
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === USER_ROLES.ADMIN;
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateBalance,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};