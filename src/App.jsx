import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Components
import UserLayout from './components/layout/UserLayout';
import AdminLayoutNew from './components/layout/AdminLayoutNew';

// User Components
import Dashboard from './components/user/Dashboard';
import Deposit from './components/user/Deposit';
import Withdraw from './components/user/Withdraw';
import Trade from './components/user/Trade';
import Portfolio from './components/user/Portfolio';
import TransactionHistory from './components/user/TransactionHistory';
import KYC from './components/user/KYC';
import Forex from './components/user/Forex';
import Settings from './components/user/Settings';
// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import PendingDeposits from './components/admin/PendingDeposits';
import PendingWithdrawals from './components/admin/PendingWithdrawals';
import PendingTrades from './components/admin/PendingTrades';
import UserManagement from './components/admin/UserManagement';
import AdminKYC from './components/admin/AdminKYC';
import AdminChat from './components/admin/AdminChat';

// Context
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ChatProvider } from './context/ChatContext';

// Shared
import LiveChat from './components/shared/LiveChat';
import NotFound from './components/shared/NotFound';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <DataProvider>
        <ChatProvider>
          <div className="min-h-screen bg-background text-slate-100">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            />
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Protected User Routes */}
                <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="deposit" element={<Deposit />} />
                  <Route path="withdraw" element={<Withdraw />} />
                  <Route path="trade" element={<Trade />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="history" element={<TransactionHistory />} />
                  <Route path="kyc" element={<KYC />} />
                  <Route path="forex" element={<Forex />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayoutNew /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="deposits" element={<PendingDeposits />} />
                  <Route path="withdrawals" element={<PendingWithdrawals />} />
                  <Route path="trades" element={<PendingTrades />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="kyc" element={<AdminKYC />} />
                  <Route path="chat" element={<AdminChat />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
            <LiveChat />
          </div>
        </ChatProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;