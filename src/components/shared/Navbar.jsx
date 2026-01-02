import React from 'react';
import { Menu, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();

  return (
    <header className="h-16 bg-background-paper/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar (Visual Only) */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 w-64 focus-within:border-primary-500/50 focus-within:bg-slate-800 transition-all">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search markets..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full indicator animate-pulse"></span>
        </button>

        {/* Settings */}
        <button className="hidden md:block p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>

        {/* Balance Display (Mini) */}
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-xs text-slate-400">Total Balance</span>
          <span className="text-sm font-bold text-emerald-400">
            ${currentUser?.balance?.USD?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;