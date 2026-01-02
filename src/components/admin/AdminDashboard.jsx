import React, { useContext } from 'react';
import { Users, ArrowDownRight, ArrowUpRight, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { TRANSACTION_STATUS } from '../../utils/constants';
import StatusBadge from '../shared/StatusBadge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { deposits, withdrawals, trades, users } = useContext(DataContext);

  // Calculate stats
  const pendingDeposits = deposits.filter(d => d.status === TRANSACTION_STATUS.PENDING).length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === TRANSACTION_STATUS.PENDING).length;
  const pendingTrades = trades.filter(t => t.status === TRANSACTION_STATUS.PENDING).length;
  const totalUsers = users.filter(u => u.role === 'user').length;

  // Recent activity
  const recentActivity = [
    ...deposits.slice(-5).map(d => ({ ...d, type: 'deposit' })),
    ...withdrawals.slice(-5).map(w => ({ ...w, type: 'withdrawal' })),
    ...trades.slice(-5).map(t => ({ ...t, type: 'trade' }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of platform activity and pending tasks</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Deposits */}
        <Link to="/admin/deposits" className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownRight className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Pending Deposits</h3>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{pendingDeposits}</p>
            <p className="text-sm text-slate-500 mt-2">
              Action specific items
            </p>
          </div>
        </Link>

        {/* Pending Withdrawals */}
        <Link to="/admin/withdrawals" className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight className="w-24 h-24 text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Pending Withdrawals</h3>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{pendingWithdrawals}</p>
            <p className="text-sm text-slate-500 mt-2">
              Review requests
            </p>
          </div>
        </Link>

        {/* Pending Trades */}
        <Link to="/admin/trades" className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-primary-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Pending Trades</h3>
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{pendingTrades}</p>
            <p className="text-sm text-slate-500 mt-2">
              Market execution
            </p>
          </div>
        </Link>

        {/* Total Users */}
        <Link to="/admin/users" className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-purple-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Total Users</h3>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
            <p className="text-sm text-slate-500 mt-2">
              Active accounts
            </p>
          </div>
        </Link>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No recent activity</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {recentActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white">{activity.userName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${activity.type === 'deposit' ? 'bg-emerald-500' :
                              activity.type === 'withdrawal' ? 'bg-blue-500' : 'bg-primary-500'
                            }`}></span>
                          <span className="text-sm text-slate-300 capitalize">{activity.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {activity.amount} {activity.currency || activity.pair}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={activity.status} />
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-400">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/deposits"
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-emerald-400 group-hover:text-emerald-300">Review Deposits</h3>
                  <p className="text-xs text-slate-400 mt-1">Approve pending funds</p>
                </div>
                <ArrowDownRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin/withdrawals"
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-blue-400 group-hover:text-blue-300">Process Withdrawals</h3>
                  <p className="text-xs text-slate-400 mt-1">Release funds</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin/trades"
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-primary-400 group-hover:text-primary-300">Execute Trades</h3>
                  <p className="text-xs text-slate-400 mt-1">Market orders</p>
                </div>
                <TrendingUp className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-bold text-white">System Status</h3>
                <p className="text-sm text-slate-400 mt-1">System is running normally. All services are operational.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;