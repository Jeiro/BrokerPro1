// Validation utility functions

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 6 characters
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true, message: '' };
};

export const validateWalletAddress = (address, currency) => {
  if (!address || address.trim() === '') {
    return { valid: false, message: 'Wallet address is required' };
  }

  // Basic validation patterns (you can make these more strict)
  const patterns = {
    BTC: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
    USDT: /^T[A-Za-z1-9]{33}$/, // TRON address
    ETH: /^0x[a-fA-F0-9]{40}$/
  };

  if (patterns[currency] && !patterns[currency].test(address)) {
    return { valid: false, message: `Invalid ${currency} wallet address format` };
  }

  return { valid: true, message: '' };
};

export const validateAmount = (amount, minAmount) => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { valid: false, message: 'Please enter a valid amount' };
  }

  if (minAmount && numAmount < minAmount) {
    return { valid: false, message: `Minimum amount is ${minAmount}` };
  }

  return { valid: true, message: '' };
};

export const validateTransactionHash = (txHash) => {
  if (!txHash || txHash.trim() === '') {
    return { valid: false, message: 'Transaction hash is required' };
  }

  // Basic validation (64 hex characters for most crypto)
  if (!/^(0x)?[a-fA-F0-9]{64}$/.test(txHash)) {
    return { valid: false, message: 'Invalid transaction hash format' };
  }

  return { valid: true, message: '' };
};

export const validateForm = (fields) => {
  const errors = {};
  
  Object.keys(fields).forEach(key => {
    const value = fields[key];
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};