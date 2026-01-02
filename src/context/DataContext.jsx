import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import {
  getDeposits,
  getWithdrawals,
  getTrades,
  getDepositsByUserId,
  getWithdrawalsByUserId,
  getTradesByUserId,
  saveDeposit,
  saveWithdrawal,
  saveTrade,
  updateDeposit,
  updateWithdrawal,
  updateTrade,
  getUsers,
  updateUser as updateUserInStorage,
  getKYCRequests,
  getKYCRequestsByUserId,
  saveKYCRequest,
  updateKYCRequest
} from '../utils/localStorage';
import { TRANSACTION_STATUS, KYC_STATUS } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { currentUser, updateBalance } = useContext(AuthContext);

  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [trades, setTrades] = useState([]);
  const [kycRequests, setKycRequests] = useState([]);
  const [users, setUsers] = useState([]);


  const loadData = useCallback(() => {
    if (currentUser?.role === 'admin') {
      // Admin sees all data
      setDeposits(getDeposits());
      setWithdrawals(getWithdrawals());
      setTrades(getTrades());
      setUsers(getUsers());
      setKycRequests(getKYCRequests());
    } else if (currentUser) {
      // User sees only their data
      setDeposits(getDepositsByUserId(currentUser.id));
      setWithdrawals(getWithdrawalsByUserId(currentUser.id));
      setTrades(getTradesByUserId(currentUser.id));
      setKycRequests(getKYCRequestsByUserId(currentUser.id));
    }
  }, [currentUser]);


  // Load data on mount and when currentUser changes
  useEffect(() => {
    loadData();
  }, [currentUser, loadData]);


  // Create deposit request
  const createDeposit = (depositData) => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };

    const newDeposit = {
      id: uuidv4(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      amount: parseFloat(depositData.amount),
      currency: depositData.currency,
      txHash: depositData.txHash,
      proofImage: depositData.proofImage,
      status: TRANSACTION_STATUS.PENDING,
      adminNote: '',
      createdAt: new Date().toISOString(),
      approvedAt: null
    };

    const saved = saveDeposit(newDeposit);

    if (saved) {
      loadData();
      return { success: true, message: 'Deposit request submitted successfully', deposit: newDeposit };
    }

    return { success: false, message: 'Failed to submit deposit request' };
  };

  // Create withdrawal request
  const createWithdrawal = (withdrawalData) => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };

    // Check if user has sufficient balance
    const userBalance = currentUser.balance[withdrawalData.currency] || 0;
    if (userBalance < parseFloat(withdrawalData.amount)) {
      return { success: false, message: 'Insufficient balance' };
    }

    const newWithdrawal = {
      id: uuidv4(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      amount: parseFloat(withdrawalData.amount),
      currency: withdrawalData.currency,
      walletAddress: withdrawalData.walletAddress,
      status: TRANSACTION_STATUS.PENDING,
      adminNote: '',
      createdAt: new Date().toISOString(),
      processedAt: null
    };

    const saved = saveWithdrawal(newWithdrawal);

    if (saved) {
      loadData();
      return { success: true, message: 'Withdrawal request submitted successfully', withdrawal: newWithdrawal };
    }

    return { success: false, message: 'Failed to submit withdrawal request' };
  };

  // Create trade request
  const createTrade = (tradeData) => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };

    const newTrade = {
      id: uuidv4(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      type: tradeData.type,
      pair: tradeData.pair,
      amount: parseFloat(tradeData.amount),
      price: parseFloat(tradeData.price),
      total: parseFloat(tradeData.total),
      status: TRANSACTION_STATUS.PENDING,
      adminNote: '',
      createdAt: new Date().toISOString(),
      executedAt: null
    };

    const saved = saveTrade(newTrade);

    if (saved) {
      loadData();
      return { success: true, message: 'Trade request submitted successfully', trade: newTrade };
    }

    return { success: false, message: 'Failed to submit trade request' };
  };

  // ADMIN FUNCTIONS

  // Approve deposit
  const approveDeposit = (depositId, adminNote = '') => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return { success: false, message: 'Deposit not found' };

    const updated = updateDeposit(depositId, {
      status: TRANSACTION_STATUS.APPROVED,
      adminNote,
      approvedAt: new Date().toISOString()
    });

    if (updated) {
      // Update user balance
      const userBalance = users.find(u => u.id === deposit.userId)?.balance || {};
      const newBalance = {
        ...userBalance,
        [deposit.currency]: (userBalance[deposit.currency] || 0) + deposit.amount
      };

      updateUserInStorage(deposit.userId, { balance: newBalance });

      loadData();
      return { success: true, message: 'Deposit approved successfully' };
    }

    return { success: false, message: 'Failed to approve deposit' };
  };

  // Reject deposit
  const rejectDeposit = (depositId, adminNote = '') => {
    const updated = updateDeposit(depositId, {
      status: TRANSACTION_STATUS.REJECTED,
      adminNote,
      approvedAt: new Date().toISOString()
    });

    if (updated) {
      loadData();
      return { success: true, message: 'Deposit rejected' };
    }

    return { success: false, message: 'Failed to reject deposit' };
  };

  // Approve withdrawal
  const approveWithdrawal = (withdrawalId, adminNote = '') => {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) return { success: false, message: 'Withdrawal not found' };

    const updated = updateWithdrawal(withdrawalId, {
      status: TRANSACTION_STATUS.APPROVED,
      adminNote,
      processedAt: new Date().toISOString()
    });

    if (updated) {
      // Deduct from user balance
      const userBalance = users.find(u => u.id === withdrawal.userId)?.balance || {};
      const newBalance = {
        ...userBalance,
        [withdrawal.currency]: (userBalance[withdrawal.currency] || 0) - withdrawal.amount
      };

      updateUserInStorage(withdrawal.userId, { balance: newBalance });

      loadData();
      return { success: true, message: 'Withdrawal approved successfully' };
    }

    return { success: false, message: 'Failed to approve withdrawal' };
  };

  // Reject withdrawal
  const rejectWithdrawal = (withdrawalId, adminNote = '') => {
    const updated = updateWithdrawal(withdrawalId, {
      status: TRANSACTION_STATUS.REJECTED,
      adminNote,
      processedAt: new Date().toISOString()
    });

    if (updated) {
      loadData();
      return { success: true, message: 'Withdrawal rejected' };
    }

    return { success: false, message: 'Failed to reject withdrawal' };
  };

  // Execute trade
  const executeTrade = (tradeId, adminNote = '') => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return { success: false, message: 'Trade not found' };

    const updated = updateTrade(tradeId, {
      status: TRANSACTION_STATUS.COMPLETED,
      adminNote,
      executedAt: new Date().toISOString()
    });

    if (updated) {
      // Update user balance
      const user = users.find(u => u.id === trade.userId);
      const currentBalance = user?.balance || {};
      const [baseAsset, quoteAsset] = trade.pair.split('/'); // e.g., BTC/USDT

      let newBalance = { ...currentBalance };

      if (trade.type === 'buy') {
        // Buy: Receive Base, Spend Quote
        newBalance[baseAsset] = (newBalance[baseAsset] || 0) + trade.amount;
        newBalance[quoteAsset] = (newBalance[quoteAsset] || 0) - trade.total;
      } else {
        // Sell: Spend Base, Receive Quote
        newBalance[baseAsset] = (newBalance[baseAsset] || 0) - trade.amount;
        newBalance[quoteAsset] = (newBalance[quoteAsset] || 0) + trade.total;
      }

      updateUserInStorage(trade.userId, { balance: newBalance });

      loadData();
      return { success: true, message: 'Trade executed successfully' };
    }

    return { success: false, message: 'Failed to execute trade' };
  };

  // Reject trade
  const rejectTrade = (tradeId, adminNote = '') => {
    const updated = updateTrade(tradeId, {
      status: TRANSACTION_STATUS.REJECTED,
      adminNote,
      executedAt: new Date().toISOString()
    });

    if (updated) {
      loadData();
      return { success: true, message: 'Trade rejected' };
    }

    return { success: false, message: 'Failed to reject trade' };
  };

  // Update user (admin only)
  const updateUser = (userId, updates) => {
    const success = updateUserInStorage(userId, updates);
    if (success) {
      loadData();
      return { success: true, message: 'User updated successfully' };
    }
    return { success: false, message: 'Failed to update user' };
  };

  // Submit KYC Request
  const submitKYC = (data) => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };

    const existingPending = kycRequests.find(k => k.userId === currentUser.id && k.status === KYC_STATUS.PENDING);
    if (existingPending) {
      return { success: false, message: 'You already have a pending verification request.' };
    }

    const newRequest = {
      id: uuidv4(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      type: data.type, // 'id_card', 'passport', 'driver_license'
      documentNumber: data.documentNumber,
      frontImage: data.frontImage, // Base64 or URL
      backImage: data.backImage, // Optional
      status: KYC_STATUS.PENDING,
      adminNote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = saveKYCRequest(newRequest);
    if (saved) {
      loadData();
      return { success: true, message: 'KYC submitted successfully' };
    }
    return { success: false, message: 'Failed to submit KYC' };
  };

  // Update KYC Status (Admin)
  const updateKYCStatus = (requestId, status, adminNote = '') => {
    const request = kycRequests.find(r => r.id === requestId);
    if (!request) return { success: false, message: 'Request not found' };

    const updated = updateKYCRequest(requestId, {
      status,
      adminNote,
      updatedAt: new Date().toISOString()
    });

    if (updated) {
      // If approved, update the user profile too
      if (status === KYC_STATUS.APPROVED) {
        updateUserInStorage(request.userId, { kycStatus: KYC_STATUS.APPROVED });
      } else if (status === KYC_STATUS.REJECTED) {
        updateUserInStorage(request.userId, { kycStatus: KYC_STATUS.REJECTED });
      }

      loadData();
      return { success: true, message: `KYC request ${status}` };
    }
    return { success: false, message: 'Failed to update request' };
  };

  const value = {
    deposits,
    withdrawals,
    trades,
    users,
    createDeposit,
    createWithdrawal,
    createTrade,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    executeTrade,
    rejectTrade,
    updateUser,
    kycRequests,
    submitKYC,
    updateKYCStatus,
    refreshData: loadData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};