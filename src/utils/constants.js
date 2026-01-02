// Application Constants

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRADE: 'trade'
};

export const TRADE_TYPES = {
  BUY: 'buy',
  SELL: 'sell'
};

export const CURRENCIES = {
  BTC: 'BTC',
  USDT: 'USDT',
  ETH: 'ETH',
  USD: 'USD'
};

export const CRYPTO_PAIRS = [
  'BTC/USDT',
  'ETH/USDT',
  'BTC/USD',
  'ETH/USD'
];

export const FOREX_PAIRS = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'AUD/USD',
  'USD/CAD',
  'USD/CHF'
];

export const KYC_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Crypto wallet addresses for deposits (Company wallets)
export const COMPANY_WALLETS = {
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  USDT: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
  ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
};

// API Endpoints
export const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  EXCHANGE_RATE: 'https://api.exchangerate-api.com/v4/latest'
};

// Tawk.to Configuration (You'll replace this with your actual Tawk.to ID)
export const TAWK_CONFIG = {
  propertyId: 'YOUR_TAWK_PROPERTY_ID', // Replace with your Tawk.to property ID
  widgetId: 'YOUR_TAWK_WIDGET_ID' // Replace with your Tawk.to widget ID
};

// Pagination
export const ITEMS_PER_PAGE = 10;

// Minimum amounts
export const MIN_DEPOSIT = {
  BTC: 0.001,
  USDT: 10,
  ETH: 0.01
};

export const MIN_WITHDRAWAL = {
  BTC: 0.001,
  USDT: 10,
  ETH: 0.01
};

export const MIN_TRADE = {
  CRYPTO: 10, // USD equivalent
  FOREX: 100 // USD equivalent
};

// Transaction fees (in percentage)
export const FEES = {
  DEPOSIT: 0,
  WITHDRAWAL: 1, // 1%
  TRADE: 0.5 // 0.5%
};