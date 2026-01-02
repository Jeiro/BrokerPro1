import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Wallet, AlertCircle, Check, Activity, ShieldCheck, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { DataContext } from '../../context/DataContext';
import { MIN_WITHDRAWAL, FEES } from '../../utils/constants';
import { validateAmount, validateWalletAddress } from '../../utils/validation';
import { motion } from 'framer-motion';

const Withdraw = () => {
  const { currentUser } = useAuth();
  const { createWithdrawal } = useContext(DataContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currency: 'BTC',
    amount: '',
    walletAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const calculateFee = () => {
    if (!formData.amount) return 0;
    return parseFloat(formData.amount) * (FEES.WITHDRAWAL / 100);
  };

  const calculateNetAmount = () => {
    if (!formData.amount) return 0;
    return parseFloat(formData.amount) - calculateFee();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    const amountValidation = validateAmount(formData.amount, MIN_WITHDRAWAL[formData.currency]);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.message;
    }

    // Check if user has sufficient balance
    const userBalance = currentUser?.balance[formData.currency] || 0;
    if (parseFloat(formData.amount) > userBalance) {
      newErrors.amount = `Insufficient balance. Available: ${userBalance} ${formData.currency}`;
    }

    const walletValidation = validateWalletAddress(formData.walletAddress, formData.currency);
    if (!walletValidation.valid) {
      newErrors.walletAddress = walletValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Submit withdrawal request
    setTimeout(() => {
      const result = createWithdrawal(formData);

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
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Request Submitted!</h2>
          <p className="text-slate-400 mb-6">
            Your withdrawal request has been submitted successfully. Our team will process it shortly.
          </p>
          <div className="animate-pulse bg-slate-800/50 rounded-lg p-3 text-sm text-slate-400">
            Redirecting to dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ArrowUpRight className="w-8 h-8 text-blue-500" />
            Withdraw Funds
          </h1>
          <p className="text-slate-400 mt-1">Withdraw earnings to your external wallet</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Withdrawal Form */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Withdrawal Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Select Currency
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['BTC', 'ETH', 'USDT'].map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setFormData({ ...formData, currency: curr })}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.currency === curr
                        ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10'
                        : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                  >
                    <span className="font-bold">{curr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Balance */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-400 font-medium">Available Balance:</span>
                <span className="text-lg font-bold text-white">
                  {(currentUser?.balance[formData.currency] || 0).toFixed(8)} <span className="text-sm font-normal text-slate-400">{formData.currency}</span>
                </span>
              </div>
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-400">
                  Amount
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const maxAmount = currentUser?.balance[formData.currency] || 0;
                    setFormData(prev => ({ ...prev, amount: maxAmount.toString() }));
                  }}
                  className="text-xs text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Use Max
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.00000001"
                  placeholder="0.00"
                  className={`w-full bg-slate-900/50 border ${errors.amount ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  {formData.currency}
                </span>
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
              )}
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Minimum withdrawal: {MIN_WITHDRAWAL[formData.currency]} {formData.currency}
              </p>
            </div>

            {/* Wallet Address */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Destination Wallet Address
              </label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder={`Enter your ${formData.currency} wallet address`}
                className={`w-full bg-slate-900/50 border ${errors.walletAddress ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {errors.walletAddress && (
                <p className="mt-1 text-sm text-red-400">{errors.walletAddress}</p>
              )}
              <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-orange-500/5 text-orange-400/80 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Double-check your address. Transactions on the blockchain cannot be reversed.</p>
              </div>
            </div>

            {/* Fee Breakdown */}
            {formData.amount && (
              <div className="p-4 bg-slate-800/50 rounded-xl space-y-2 border border-slate-700/50">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Withdrawal Amount:</span>
                  <span className="font-semibold text-white">
                    {parseFloat(formData.amount).toFixed(8)} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Network Fee ({FEES.WITHDRAWAL}%):</span>
                  <span className="font-semibold text-red-400">
                    -{calculateFee().toFixed(8)} {formData.currency}
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-slate-300">You'll Receive:</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {calculateNetAmount().toFixed(8)} {formData.currency}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>

        {/* Instructions & Info */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Processing Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Manual Processing</h3>
                  <p className="text-sm text-slate-400 mt-1">All withdrawals are manually reviewed by our security team.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Processing Time</h3>
                  <p className="text-sm text-slate-400 mt-1">Usually completed within 24-48 hours depending on network load.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure & Safe</h3>
                  <p className="text-sm text-slate-400 mt-1">Multiple automated security checks to protect your funds.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Important Notes</h2>
            <ul className="space-y-3">
              {[
                'Minimum withdrawal amount varies by currency',
                `A ${FEES.WITHDRAWAL}% network fee is deducted from your withdrawal`,
                'Ensure your wallet address is correct',
                'Only send to addresses that support the selected currency',
                'Your withdrawal will be pending until approved'
              ].map((note, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <p className="text-sm text-slate-400">{note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-xl p-6 border-l-4 border-l-red-500 bg-red-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Security Warning</p>
                <p className="text-xs text-slate-400">
                  Never share your wallet's private keys with anyone. Our team will never ask for your private keys or passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;