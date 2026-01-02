import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Calendar
} from 'lucide-react';
import { DataContext } from '../../context/DataContext';

const UserManagement = () => {
  const { users, updateUser } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // all, user, admin
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Calculate stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const activeCount = users.filter(u => u.kycStatus === 'approved').length;

  const handleRoleToggle = (user) => {
    setSelectedUser(user);
    setShowRoleDialog(true);
  };

  const confirmRoleChange = () => {
    if (!selectedUser) return;

    const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
    updateUser(selectedUser.id, { role: newRole });

    setShowRoleDialog(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 mt-1">Manage user accounts, roles, and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Users</p>
            <p className="text-3xl font-bold text-white mt-1">{totalUsers}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Administrators</p>
            <p className="text-3xl font-bold text-white mt-1">{adminCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Shield className="w-6 h-6" />
          </div>
        </div>
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Verified Users</p>
            <p className="text-3xl font-bold text-white mt-1">{activeCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterRole === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRole('user')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterRole === 'user' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Users
            </button>
            <button
              onClick={() => setFilterRole('admin')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterRole === 'admin' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Admins
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Balance Est.</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <AnimatePresence>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-700/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-slate-600">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.fullName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                          {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                          {user.role === 'admin' ? 'Administrator' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-300">
                          {/* Simplified balance view */}
                          {user.balance?.USDT?.toFixed(2) || '0.00'} USDT
                        </div>
                        <div className="text-xs text-slate-500">
                          {user.balance?.BTC?.toFixed(5) || '0.000'} BTC
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.kycStatus === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                          {user.kycStatus === 'approved' ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRoleToggle(user)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${user.role === 'admin'
                              ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                              : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                            }`}
                        >
                          {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Dialog */}
      <AnimatePresence>
        {showRoleDialog && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoleDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 mx-auto">
                <ShieldAlert className="w-6 h-6 text-yellow-500" />
              </div>

              <h3 className="text-xl font-bold text-white text-center mb-2">
                change User Role?
              </h3>

              <p className="text-slate-400 text-center mb-6 text-sm">
                Are you sure you want to {selectedUser.role === 'admin' ? 'remove admin privileges from' : 'grant admin privileges to'}{' '}
                <span className="text-white font-semibold">{selectedUser.fullName}</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoleDialog(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRoleChange}
                  className="flex-1 px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors font-bold shadow-lg shadow-primary-500/20"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
