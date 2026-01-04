import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  History,
  Users,
  FileText,
  LogOut,
  X,
  CreditCard,
  UserCheck,
  Globe,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { adminUnreadCount } = useChat();
  const location = useLocation();

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/deposit', label: 'Deposit', icon: ArrowDownLeft },
    { path: '/withdraw', label: 'Withdraw', icon: ArrowUpRight },
    { path: '/trade', label: 'Trade', icon: TrendingUp },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
    { path: '/history', label: 'History', icon: History },
    { path: '/kyc', label: 'Verification', icon: UserCheck },
    { path: '/forex', label: 'Forex Trading', icon: Globe },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/deposits', label: 'Deposits', icon: ArrowDownLeft },
    { path: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
    { path: '/admin/trades', label: 'Trades', icon: TrendingUp },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/kyc', label: 'KYC Requests', icon: UserCheck },
    { path: '/admin/chat', label: 'Support Chat', icon: MessageSquare, badge: adminUnreadCount },
  ];

  const links = isAdmin() ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-background-paper/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col transition-transform duration-300 transform md:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-primary-500 to-accent-500 p-2 rounded-lg shadow-lg shadow-primary-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              BrokerPro
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-primary-500/10 text-primary-400 shadow-lg shadow-primary-900/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-500/10 rounded-xl"
                  />
                )}
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {link.badge > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-slate-900">
                      {link.badge}
                    </span>
                  )}
                </div>
                <span className="font-medium">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.fullName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
