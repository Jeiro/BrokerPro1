// LocalStorage based data persistence
// Data is stored in browser's localStorage and persists across reloads

const STORAGE_KEY = 'broker_pro_db_v1';

// Default data for when storage is empty
const DEFAULT_DATA = {
  users: [
    {
      id: '1',
      email: 'user@example.com',
      password: 'password123',
      fullName: 'Demo User',
      role: 'user',
      balance: { BTC: 0.5, USDT: 1000, ETH: 2.0, USD: 5000 },
      walletAddresses: { BTC: 'bc1q...', USDT: '0x...', ETH: '0x...' },
      status: 'active',
      kycStatus: 'verified',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'admin@broker.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin',
      balance: { BTC: 0, USDT: 0, ETH: 0, USD: 0 },
      walletAddresses: {},
      status: 'active',
      kycStatus: 'verified',
      createdAt: new Date().toISOString()
    }
  ],
  currentUser: null,
  deposits: [],
  withdrawals: [],
  trades: [],
  kycRequests: []
};

// Initialize appData from localStorage or defaults
let appData = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge defaults if structure changed or ensure core fields exist
      return { ...DEFAULT_DATA, ...parsed, currentUser: null }; // Reset currentUser on reload usually, or keep it if we want peristent session
    }
  } catch (e) {
    console.error('Failed to load data from storage', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
})();

// Helper to save state
const saveData = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    console.error('Failed to save data to storage', e);
  }
};

// User Management
export const getUsers = () => appData.users;

export const saveUser = (user) => {
  appData.users.push(user);
  saveData();
  return true;
};

export const updateUser = (userId, updates) => {
  const index = appData.users.findIndex(u => u.id === userId);
  if (index !== -1) {
    appData.users[index] = { ...appData.users[index], ...updates };
    saveData();
    return true;
  }
  return false;
};

export const getUserById = (userId) => {
  return appData.users.find(u => u.id === userId);
};

export const getUserByEmail = (email) => {
  return appData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Current User Session
export const getCurrentUser = () => {
  // Try to recover session from localStorage if not in memory
  if (!appData.currentUser) {
    const storedUser = localStorage.getItem('broker_pro_session');
    if (storedUser) {
      appData.currentUser = JSON.parse(storedUser);
    }
  }
  return appData.currentUser;
};

export const setCurrentUser = (user) => {
  appData.currentUser = user;
  localStorage.setItem('broker_pro_session', JSON.stringify(user));
  return true;
};

export const clearCurrentUser = () => {
  appData.currentUser = null;
  localStorage.removeItem('broker_pro_session');
  return true;
};

// Deposits
export const getDeposits = () => appData.deposits;

export const saveDeposit = (deposit) => {
  appData.deposits.push(deposit);
  saveData();
  return true;
};

export const updateDeposit = (depositId, updates) => {
  const index = appData.deposits.findIndex(d => d.id === depositId);
  if (index !== -1) {
    appData.deposits[index] = { ...appData.deposits[index], ...updates };
    saveData();
    return true;
  }
  return false;
};

export const getDepositsByUserId = (userId) => {
  return appData.deposits.filter(d => d.userId === userId);
};

// Withdrawals
export const getWithdrawals = () => appData.withdrawals;

export const saveWithdrawal = (withdrawal) => {
  appData.withdrawals.push(withdrawal);
  saveData();
  return true;
};

export const updateWithdrawal = (withdrawalId, updates) => {
  const index = appData.withdrawals.findIndex(w => w.id === withdrawalId);
  if (index !== -1) {
    appData.withdrawals[index] = { ...appData.withdrawals[index], ...updates };
    saveData();
    return true;
  }
  return false;
};

export const getWithdrawalsByUserId = (userId) => {
  return appData.withdrawals.filter(w => w.userId === userId);
};

// Trades
export const getTrades = () => appData.trades;

export const saveTrade = (trade) => {
  appData.trades.push(trade);
  saveData();
  return true;
};

export const updateTrade = (tradeId, updates) => {
  const index = appData.trades.findIndex(t => t.id === tradeId);
  if (index !== -1) {
    appData.trades[index] = { ...appData.trades[index], ...updates };
    saveData();
    return true;
  }
  return false;
};

export const getTradesByUserId = (userId) => {
  return appData.trades.filter(t => t.userId === userId);
};

// KYC Requests
export const getKYCRequests = () => appData.kycRequests;

export const saveKYCRequest = (request) => {
  appData.kycRequests.push(request);
  saveData();
  return true;
};

export const updateKYCRequest = (requestId, updates) => {
  const index = appData.kycRequests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    appData.kycRequests[index] = { ...appData.kycRequests[index], ...updates };
    saveData();
    return true;
  }
  return false;
};

export const getKYCRequestsByUserId = (userId) => {
  return appData.kycRequests.filter(r => r.userId === userId);
};

// Helper for testing - reset all data
export const resetAppData = () => {
  appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  saveData();
  localStorage.removeItem('broker_pro_session');
};
