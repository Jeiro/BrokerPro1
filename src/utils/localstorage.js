// In-memory data storage (database removed - using mock data)
// All data is stored in memory and will be reset on page reload

import {
  getUsers as getMockUsers,
  saveUser as saveMockUser,
  updateUser as updateMockUser,
  getUserById as getMockUserById,
  getUserByEmail as getMockUserByEmail,
  getCurrentUser as getMockCurrentUser,
  setCurrentUser as setMockCurrentUser,
  clearCurrentUser as clearMockCurrentUser,
  getDeposits as getMockDeposits,
  saveDeposit as saveMockDeposit,
  updateDeposit as updateMockDeposit,
  getDepositsByUserId as getMockDepositsByUserId,
  getWithdrawals as getMockWithdrawals,
  saveWithdrawal as saveMockWithdrawal,
  updateWithdrawal as updateMockWithdrawal,
  getWithdrawalsByUserId as getMockWithdrawalsByUserId,
  getTrades as getMockTrades,
  saveTrade as saveMockTrade,
  updateTrade as updateMockTrade,
  getTradesByUserId as getMockTradesByUserId,
  getKYCRequests as getMockKYCRequests,
  saveKYCRequest as saveMockKYCRequest,
  updateKYCRequest as updateMockKYCRequest,
  getKYCRequestsByUserId as getMockKYCRequestsByUserId
} from './mockData';

// Initialize storage - called on app startup
export const initializeStorage = () => {
  // In-memory storage is initialized in mockData.js
  // This function exists for compatibility with existing code
  return true;
};

// User management
export const getUsers = () => getMockUsers();

export const saveUser = (user) => saveMockUser(user);

export const updateUser = (userId, updates) => updateMockUser(userId, updates);

export const getUserById = (userId) => getMockUserById(userId);

export const getUserByEmail = (email) => getMockUserByEmail(email);

// Current user session
export const getCurrentUser = () => getMockCurrentUser();

export const setCurrentUser = (user) => setMockCurrentUser(user);

export const clearCurrentUser = () => clearMockCurrentUser();

// Deposits
export const getDeposits = () => getMockDeposits();

export const saveDeposit = (deposit) => saveMockDeposit(deposit);

export const updateDeposit = (depositId, updates) => updateMockDeposit(depositId, updates);

export const getDepositsByUserId = (userId) => getMockDepositsByUserId(userId);

// Withdrawals
export const getWithdrawals = () => getMockWithdrawals();

export const saveWithdrawal = (withdrawal) => saveMockWithdrawal(withdrawal);

export const updateWithdrawal = (withdrawalId, updates) => updateMockWithdrawal(withdrawalId, updates);

export const getWithdrawalsByUserId = (userId) => getMockWithdrawalsByUserId(userId);

// Trades
export const getTrades = () => getMockTrades();

export const saveTrade = (trade) => saveMockTrade(trade);

export const updateTrade = (tradeId, updates) => updateMockTrade(tradeId, updates);

export const getTradesByUserId = (userId) => getMockTradesByUserId(userId);

// KYC
export const getKYCRequests = () => getMockKYCRequests();

export const saveKYCRequest = (request) => saveMockKYCRequest(request);

export const updateKYCRequest = (requestId, updates) => updateMockKYCRequest(requestId, updates);

export const getKYCRequestsByUserId = (userId) => getMockKYCRequestsByUserId(userId);