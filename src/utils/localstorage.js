// LocalStorage utility functions for data persistence

const STORAGE_KEYS = {
  USERS: 'broker_users',
  DEPOSITS: 'broker_deposits',
  WITHDRAWALS: 'broker_withdrawals',
  TRADES: 'broker_trades',
  CURRENT_USER: 'broker_current_user',
  KYC: 'broker_kyc'
};

// Generic storage functions
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// User management
export const getUsers = () => {
  return getFromStorage(STORAGE_KEYS.USERS) || [];
};

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  return saveToStorage(STORAGE_KEYS.USERS, users);
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return saveToStorage(STORAGE_KEYS.USERS, users);
  }
  return false;
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find(u => u.id === userId);
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Current user session
export const getCurrentUser = () => {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (user) => {
  return saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const clearCurrentUser = () => {
  return removeFromStorage(STORAGE_KEYS.CURRENT_USER);
};

// Deposits
export const getDeposits = () => {
  return getFromStorage(STORAGE_KEYS.DEPOSITS) || [];
};

export const saveDeposit = (deposit) => {
  const deposits = getDeposits();
  deposits.push(deposit);
  return saveToStorage(STORAGE_KEYS.DEPOSITS, deposits);
};

export const updateDeposit = (depositId, updates) => {
  const deposits = getDeposits();
  const index = deposits.findIndex(d => d.id === depositId);
  if (index !== -1) {
    deposits[index] = { ...deposits[index], ...updates };
    return saveToStorage(STORAGE_KEYS.DEPOSITS, deposits);
  }
  return false;
};

export const getDepositsByUserId = (userId) => {
  const deposits = getDeposits();
  return deposits.filter(d => d.userId === userId);
};

// Withdrawals
export const getWithdrawals = () => {
  return getFromStorage(STORAGE_KEYS.WITHDRAWALS) || [];
};

export const saveWithdrawal = (withdrawal) => {
  const withdrawals = getWithdrawals();
  withdrawals.push(withdrawal);
  return saveToStorage(STORAGE_KEYS.WITHDRAWALS, withdrawals);
};

export const updateWithdrawal = (withdrawalId, updates) => {
  const withdrawals = getWithdrawals();
  const index = withdrawals.findIndex(w => w.id === withdrawalId);
  if (index !== -1) {
    withdrawals[index] = { ...withdrawals[index], ...updates };
    return saveToStorage(STORAGE_KEYS.WITHDRAWALS, withdrawals);
  }
  return false;
};

export const getWithdrawalsByUserId = (userId) => {
  const withdrawals = getWithdrawals();
  return withdrawals.filter(w => w.userId === userId);
};

// Trades
export const getTrades = () => {
  return getFromStorage(STORAGE_KEYS.TRADES) || [];
};

export const saveTrade = (trade) => {
  const trades = getTrades();
  trades.push(trade);
  return saveToStorage(STORAGE_KEYS.TRADES, trades);
};

export const updateTrade = (tradeId, updates) => {
  const trades = getTrades();
  const index = trades.findIndex(t => t.id === tradeId);
  if (index !== -1) {
    trades[index] = { ...trades[index], ...updates };
    return saveToStorage(STORAGE_KEYS.TRADES, trades);
  }
  return false;
};

export const getTradesByUserId = (userId) => {
  const trades = getTrades();
  return trades.filter(t => t.userId === userId);
};

// KYC
export const getKYCRequests = () => {
  return getFromStorage(STORAGE_KEYS.KYC) || [];
};

export const saveKYCRequest = (request) => {
  const requests = getKYCRequests();
  requests.push(request);
  return saveToStorage(STORAGE_KEYS.KYC, requests);
};

export const updateKYCRequest = (requestId, updates) => {
  const requests = getKYCRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    return saveToStorage(STORAGE_KEYS.KYC, requests);
  }
  return false;
};

export const getKYCRequestsByUserId = (userId) => {
  const requests = getKYCRequests();
  return requests.filter(r => r.userId === userId);
};

// Initialize with demo admin account if no users exist
export const initializeStorage = () => {
  const users = getUsers();
  if (users.length === 0) {
    const adminUser = {
      id: 'admin-001',
      email: 'admin@broker.com',
      password: 'admin123', // In production, this should be hashed!
      fullName: 'Admin User',
      role: 'admin',
      balance: { BTC: 0, USDT: 0, ETH: 0, USD: 0 },
      walletAddresses: { BTC: '', USDT: '', ETH: '' },
      kycStatus: 'approved',
      createdAt: new Date().toISOString()
    };
    saveUser(adminUser);
    console.log('Demo admin account created: admin@broker.com / admin123');
  }
};