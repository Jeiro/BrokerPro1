import React, { useContext, useState } from 'react';
import { Clock, Filter, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Search, Download } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import StatusBadge from '../shared/StatusBadge';
import { AnimatePresence } from 'framer-motion';

const TransactionHistory = () => {
  const { deposits, withdrawals, trades } = useContext(DataContext);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allTransactions = [
    ...deposits.map(d => ({ ...d, type: 'deposit' })),
    ...withdrawals.map(w => ({ ...w, type: 'withdrawal' })),
    ...trades.map(t => ({ ...t, type: 'trade' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredTransactions = allTransactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = searchTerm === '' ||
      t.currency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.pair?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="w-5 h-5 text-emerald-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'trade': return <ArrowLeftRight className="w-5 h-5 text-blue-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary-500" />
            History
          </h1>
          <p className="text-slate-400 mt-1">View and manage your transaction history</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-colors border border-slate-700/50">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'deposit', 'withdrawal', 'trade'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${filter === type
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel overflow-hidden rounded-xl">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg font-medium">No transactions found</p>
            <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset/Pair</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-slate-800/50"
              >
                <AnimatePresence>
                  {filteredTransactions.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      variants={itemVariants}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10 ${transaction.type === 'deposit' ? 'bg-emerald-500' :
                              transaction.type === 'withdrawal' ? 'bg-red-500' : 'bg-blue-500'
                            }`}>
                            {getIcon(transaction.type)}
                          </div>
                          <span className="capitalize font-medium text-white">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.type === 'trade' ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{transaction.pair}</span>
                            <span className={`text-xs ${transaction.side === 'buy' ? 'text-emerald-400' : 'text-red-400'} uppercase font-bold`}>
                              {transaction.side}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{transaction.currency}</span>
                            {transaction.currency === 'BTC' && <span className="text-orange-500 text-xs">●</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-mono font-bold ${transaction.type === 'deposit' ? 'text-emerald-400' :
                            transaction.type === 'withdrawal' ? 'text-white' :
                              transaction.side === 'buy' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                          {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                          {parseFloat(transaction.amount).toFixed(8)}
                        </span>
                        <span className="text-slate-500 text-xs ml-1">
                          {transaction.currency || transaction.pair?.split('/')[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                        <span className="text-xs text-slate-600 block">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-600 max-w-xs truncate cursor-help" title={transaction.id}>
                        {transaction.id.slice(0, 8)}...
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;