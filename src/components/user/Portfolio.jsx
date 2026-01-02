import React from 'react';
import { Wallet, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePrices } from '../../hooks/usePrices';
import { motion } from 'framer-motion';

const Portfolio = () => {
  const { currentUser } = useAuth();
  const { cryptoPrices, loading } = usePrices();

  const calculateAssetValue = (currency, amount) => {
    if (!cryptoPrices[currency]) return 0;
    return amount * cryptoPrices[currency].price;
  };

  const calculateTotalValue = () => {
    if (!currentUser || !cryptoPrices.BTC) return 0;

    const btcValue = calculateAssetValue('BTC', currentUser.balance.BTC || 0);
    const ethValue = calculateAssetValue('ETH', currentUser.balance.ETH || 0);
    const usdtValue = currentUser.balance.USDT || 0;
    const usdValue = currentUser.balance.USD || 0;

    return btcValue + ethValue + usdtValue + usdValue;
  };

  const totalValue = calculateTotalValue();

  const assets = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      balance: currentUser?.balance.BTC || 0,
      value: calculateAssetValue('BTC', currentUser?.balance.BTC || 0),
      color: 'orange',
      icon: '₿',
      bg: 'bg-orange-500'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      balance: currentUser?.balance.ETH || 0,
      value: calculateAssetValue('ETH', currentUser?.balance.ETH || 0),
      color: 'purple',
      icon: 'Ξ',
      bg: 'bg-purple-500'
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      balance: currentUser?.balance.USDT || 0,
      value: currentUser?.balance.USDT || 0,
      color: 'green',
      icon: '₮',
      bg: 'bg-emerald-500'
    },
    {
      name: 'US Dollar',
      symbol: 'USD',
      balance: currentUser?.balance.USD || 0,
      value: currentUser?.balance.USD || 0,
      color: 'blue',
      icon: '$',
      bg: 'bg-blue-500'
    }
  ].sort((a, b) => b.value - a.value);

  const getPercentage = (value) => {
    if (totalValue === 0) return 0;
    return ((value / totalValue) * 100).toFixed(2);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <PieChart className="w-8 h-8 text-primary-500" />
            Portfolio
          </h1>
          <p className="text-slate-400 mt-1">Track your assets and performance</p>
        </div>
      </div>

      {/* Total Value Card */}
      <motion.div variants={itemVariants} className="glass-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet className="w-32 h-32 text-primary-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-slate-400 font-medium mb-2">Total Portfolio Value</p>
            <h2 className="text-5xl font-bold text-white tracking-tight">
              ${loading ? '...' : totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center mt-4 space-x-2 bg-emerald-500/10 w-fit px-3 py-1 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 font-medium">+2.5% this week</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 min-w-[120px]">
              <p className="text-xs text-slate-400 mb-1">Today's PnL</p>
              <p className="text-emerald-400 font-bold">+$124.50</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 min-w-[120px]">
              <p className="text-xs text-slate-400 mb-1">Total Profit</p>
              <p className="text-emerald-400 font-bold">+$1,240.00</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-bold text-white">Your Assets</h2>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.symbol} className="glass-panel p-5 hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asset.bg} bg-opacity-20 text-white font-bold text-xl`}>
                      {asset.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{asset.name}</h3>
                      <p className="text-sm text-slate-500">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {asset.balance.toFixed(asset.symbol === 'BTC' || asset.symbol === 'ETH' ? 6 : 2)}
                    </p>
                    <p className="text-sm text-slate-500">
                      ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Allocation</span>
                    <span className="text-white font-medium">{getPercentage(asset.value)}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${asset.bg} transition-all duration-1000 ease-out`}
                      style={{ width: `${getPercentage(asset.value)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Distribution */}
        <motion.div variants={itemVariants} className="glass-panel p-6 h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Distribution</h2>

          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Simple CSS Pie Chart representation for visual flair */}
            <div className="absolute inset-0 rounded-full border-[16px] border-slate-700/30"></div>
            {assets.filter(a => a.value > 0).map((asset, i, arr) => {
              // Simplified visual representation - in a real app would use Recharts Pie
              const prev = arr.slice(0, i).reduce((acc, curr) => acc + (curr.value / totalValue) * 100, 0);
              const current = (asset.value / totalValue) * 100;
              return (
                <div
                  key={asset.symbol}
                  className={`absolute inset-0 rounded-full border-[16px] ${asset.symbol === 'BTC' ? 'border-orange-500' :
                      asset.symbol === 'ETH' ? 'border-purple-500' :
                        asset.symbol === 'USDT' ? 'border-emerald-500' : 'border-blue-500'
                    }`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(2 * Math.PI * current / 100)}% ${50 - 50 * Math.cos(2 * Math.PI * current / 100)}%)`,
                    transform: `rotate(${prev * 3.6}deg)`
                  }}
                ></div>
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-slate-400 text-sm">Total</span>
              <span className="text-white font-bold text-xl">${(totalValue / 1000).toFixed(1)}k</span>
            </div>
          </div>

          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.symbol + '_legend'} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${asset.bg}`}></div>
                  <span className="text-slate-300 font-medium">{asset.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold block">{getPercentage(asset.value)}%</span>
                </div>
              </div>
            ))}
          </div>

          {totalValue === 0 && (
            <div className="text-center mt-8 p-4 bg-slate-800/50 rounded-xl">
              <p className="text-slate-400">No assets found</p>
              <button className="mt-2 text-primary-400 text-sm font-medium hover:text-primary-300">
                Make a Deposit
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Portfolio;