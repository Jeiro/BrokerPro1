import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertCircle, Check, RefreshCw, Activity, DollarSign, Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePrices } from '../../hooks/usePrices';
import { DataContext } from '../../context/DataContext';
import { CRYPTO_PAIRS, FOREX_PAIRS, TRADE_TYPES, MIN_TRADE } from '../../utils/constants';
import { getCryptoPairPrice } from '../../services/cryptoService';
import { getForexPairRate } from '../../services/forexService';
import PriceChart from '../shared/PriceChart';
import { getCryptoChartData } from '../../services/cryptoService';
import { AnimatePresence } from 'framer-motion';

const Trade = () => {
  const { cryptoPrices, forexRates, loading: pricesLoading, refresh } = usePrices();
  const { createTrade } = useContext(DataContext);
  const navigate = useNavigate();

  const [tradeType, setTradeType] = useState('crypto');
  const [formData, setFormData] = useState({
    type: TRADE_TYPES.BUY,
    pair: 'BTC/USDT',
    amount: '',
    price: 0,
    total: 0
  });

  const [chartData, setChartData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update price when pair changes
  useEffect(() => {
    const updatePrice = () => {
      if (tradeType === 'crypto' && cryptoPrices.BTC) {
        const price = getCryptoPairPrice(formData.pair, cryptoPrices);
        setFormData(prev => ({ ...prev, price }));
      } else if (tradeType === 'forex' && forexRates) {
        const rate = getForexPairRate(formData.pair, forexRates);
        setFormData(prev => ({ ...prev, price: rate }));
      }
    };
    updatePrice();
  }, [formData.pair, cryptoPrices, forexRates, tradeType]);

  // Fetch chart data when pair changes
  useEffect(() => {
    if (tradeType === 'crypto') {
      const [base] = formData.pair.split('/');
      const coinId = base === 'BTC' ? 'bitcoin' : 'ethereum';
      getCryptoChartData(coinId, 7).then(setChartData);
    }
  }, [formData.pair, tradeType]);

  // Calculate total when amount changes
  useEffect(() => {
    const updateTotal = () => {
      if (formData.amount && formData.price) {
        const total = parseFloat(formData.amount) * formData.price;
        setFormData(prev => ({ ...prev, total }));
      }
    };
    updateTotal();
  }, [formData.amount, formData.price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePairChange = (pair) => {
    setFormData(prev => ({
      ...prev,
      pair,
      amount: '',
      total: 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    const minTrade = tradeType === 'crypto' ? MIN_TRADE.CRYPTO : MIN_TRADE.FOREX;
    if (formData.total < minTrade) {
      newErrors.amount = `Minimum trade value is $${minTrade}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = createTrade(formData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setErrors({ general: result.message });
      }

      setIsSubmitting(false);
    }, 1000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-8 rounded-2xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Order Placed!</h2>
          <p className="text-slate-400 mb-6">
            Your trade request has been submitted successfully and is pending execution.
          </p>
          <div className="animate-pulse bg-slate-800/50 rounded-lg p-3 text-sm text-slate-400">
            Redirecting to dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  const availablePairs = tradeType === 'crypto' ? CRYPTO_PAIRS : FOREX_PAIRS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary-500" />
            Trading Terminal
          </h1>
          <p className="text-slate-400 mt-1">Advanced market access and execution</p>
        </div>

        <div className="flex bg-slate-800/50 p-1 rounded-xl">
          <button
            onClick={() => {
              setTradeType('crypto');
              setFormData(prev => ({ ...prev, pair: 'BTC/USDT', amount: '', total: 0 }));
            }}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${tradeType === 'crypto'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            Crypto
          </button>
          <button
            onClick={() => {
              setTradeType('forex');
              setFormData(prev => ({ ...prev, pair: 'EUR/USD', amount: '', total: 0 }));
            }}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${tradeType === 'forex'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            Forex
          </button>
        </div>
      </div>

      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400 text-sm font-medium">{errors.general}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart & Market Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">{formData.pair}</h2>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${tradeType === 'crypto' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                  {tradeType.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase">Current Price</p>
                  <p className="text-2xl font-bold text-white">
                    ${formData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <button
                  onClick={refresh}
                  disabled={pricesLoading}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <RefreshCw className={`w-5 h-5 ${pricesLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {tradeType === 'crypto' ? (
              <PriceChart data={chartData} height={400} color={formData.type === TRADE_TYPES.BUY ? '#10b981' : '#ef4444'} />
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/30">
                <p className="text-slate-500">Forex chart data requires premium subscription</p>
              </div>
            )}
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Available Markets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availablePairs.map(pair => (
                <button
                  key={pair}
                  onClick={() => handlePairChange(pair)}
                  className={`p-3 rounded-xl border transition-all ${formData.pair === pair
                      ? 'border-primary-500 bg-primary-500/10 text-white shadow-lg shadow-primary-500/10'
                      : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                >
                  <span className="font-medium">{pair}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="glass-panel rounded-xl p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold text-white mb-6">Place Order</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-800/50 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: TRADE_TYPES.BUY }))}
                className={`py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${formData.type === TRADE_TYPES.BUY
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
              >
                <TrendingUp className="w-4 h-4" />
                Buy
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: TRADE_TYPES.SELL }))}
                className={`py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${formData.type === TRADE_TYPES.SELL
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
              >
                <TrendingDown className="w-4 h-4" />
                Sell
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Amount ({formData.pair.split('/')[0]})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.00000001"
                    placeholder="0.00"
                    className={`w-full bg-slate-900/50 border ${errors.amount ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 transition-colors`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    {formData.pair.split('/')[0]}
                  </span>
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Market Price ({formData.pair.split('/')[1]})
                </label>
                <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between text-slate-300">
                  <span>${formData.price.toLocaleString()}</span>
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Order Value</span>
                  <span className="text-white font-medium">
                    ${formData.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fees (0.1%)</span>
                  <span className="text-white font-medium">
                    ${(formData.total * 0.001).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-slate-700/50 pt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-300">Total Cost</span>
                  <span className="text-xl font-bold text-white">
                    ${(formData.total * 1.001).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.amount}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${formData.type === TRADE_TYPES.BUY
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-900/20'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-900/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                `${formData.type === TRADE_TYPES.BUY ? 'Buy' : 'Sell'} ${formData.pair.split('/')[0]}`
              )}
            </button>

            <p className="text-xs text-center text-slate-500">
              By placing this order, you agree to our Terms of Service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Trade;