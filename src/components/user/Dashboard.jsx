import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, Activity, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePrices } from '../../hooks/usePrices';
import { DataContext } from '../../context/DataContext';
import StatusBadge from '../shared/StatusBadge';
import PriceChart from '../shared/PriceChart';
import { getCryptoChartData } from '../../services/cryptoService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { cryptoPrices, loading: pricesLoading } = usePrices();
  const { deposits, withdrawals, trades } = useContext(DataContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch BTC chart data
    const fetchChartData = async () => {
      try {
        const data = await getCryptoChartData('bitcoin', 7);
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      }
    };
    fetchChartData();
  }, []);

  // Calculate total portfolio value in USD
  const calculateTotalValue = () => {
    if (!currentUser || !cryptoPrices.BTC) return 0;

    const btcValue = (currentUser.balance.BTC || 0) * cryptoPrices.BTC.price;
    const ethValue = (currentUser.balance.ETH || 0) * (cryptoPrices.ETH?.price || 0);
    const usdtValue = currentUser.balance.USDT || 0;
    const usdValue = currentUser.balance.USD || 0;

    return btcValue + ethValue + usdtValue + usdValue;
  };

  // Get recent transactions
  const recentTransactions = [
    ...deposits.slice(-5).map(d => ({ ...d, type: 'deposit' })),
    ...withdrawals.slice(-5).map(w => ({ ...w, type: 'withdrawal' })),
    ...trades.slice(-5).map(t => ({ ...t, type: 'trade' }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const totalValue = calculateTotalValue();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {currentUser?.fullName}!</h1>
          <p className="text-slate-400 mt-1">Here's your portfolio overview for today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/deposit" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/25 transition-all flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4" />
            <span>Deposit</span>
          </Link>
          <Link to="/trade" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg border border-slate-600 transition-all flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Trade</span>
          </Link>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio Value */}
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-24 h-24 text-primary-500" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-400">Total Balance</h3>
            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white relative z-10">
            ${pricesLoading ? '...' : totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-emerald-400 mt-2 flex items-center relative z-10">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2.5% this week
          </p>
        </div>

        {/* BTC Balance */}
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-8xl font-bold text-orange-500">₿</span>
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-400">Bitcoin</h3>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <span className="text-orange-500 font-bold text-xl">₿</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white relative z-10">
            {currentUser?.balance.BTC?.toFixed(6) || '0.000000'}
          </p>
          <p className="text-sm text-slate-500 mt-2 relative z-10">
            ≈ ${pricesLoading ? '...' : ((currentUser?.balance.BTC || 0) * (cryptoPrices.BTC?.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* ETH Balance */}
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-8xl font-bold text-indigo-500">Ξ</span>
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-400">Ethereum</h3>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <span className="text-indigo-500 font-bold text-xl">Ξ</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white relative z-10">
            {currentUser?.balance.ETH?.toFixed(6) || '0.000000'}
          </p>
          <p className="text-sm text-slate-500 mt-2 relative z-10">
            ≈ ${pricesLoading ? '...' : ((currentUser?.balance.ETH || 0) * (cryptoPrices.ETH?.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* USDT Balance */}
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-8xl font-bold text-emerald-500">₮</span>
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-400">Tether</h3>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <span className="text-emerald-500 font-bold text-xl">₮</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white relative z-10">
            {currentUser?.balance.USDT?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-slate-500 mt-2 relative z-10">
            ≈ ${currentUser?.balance.USDT?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-400" />
                Bitcoin Price
              </h2>
              <p className="text-xs text-slate-400 mt-1">Live market data (7 days)</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-white">
                ${cryptoPrices.BTC?.price.toLocaleString() || '...'}
              </span>
              <span className={`text-sm ${(cryptoPrices.BTC?.change24h || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {(cryptoPrices.BTC?.change24h || 0) >= 0 ? '+' : ''}
                {cryptoPrices.BTC?.change24h?.toFixed(2)}%
              </span>
            </div>
          </div>
          <PriceChart data={chartData} height={350} />
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/deposit"
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Deposit Funds</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                to="/withdraw"
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Withdraw Funds</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                to="/trade"
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Place Trade</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Account Status</h2>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <span className="text-slate-400 text-sm">KYC Verified</span>
              <StatusBadge status={currentUser?.kycStatus || 'pending'} />
            </div>
            <div className="flex items-center justify-between mt-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <span className="text-slate-400 text-sm">Level</span>
              <span className="text-white font-medium text-sm">Standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          <Link to="/history" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            View All
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No recent activity</p>
            <p className="text-sm text-slate-500 mt-2">Start by making a deposit or placing a trade</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-500' :
                            tx.type === 'withdrawal' ? 'bg-indigo-500/20 text-indigo-500' :
                              'bg-primary-500/20 text-primary-500'
                          }`}>
                          {tx.type === 'deposit' && <ArrowDownRight className="w-4 h-4" />}
                          {tx.type === 'withdrawal' && <ArrowUpRight className="w-4 h-4" />}
                          {tx.type === 'trade' && <Activity className="w-4 h-4" />}
                        </div>
                        <span className="font-medium text-slate-200 capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">
                        {tx.amount} {tx.currency || tx.pair}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;