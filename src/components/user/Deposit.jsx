import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownRight, Copy, Check, Upload, AlertCircle, ShieldCheck, Wallet } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { COMPANY_WALLETS, CURRENCIES, MIN_DEPOSIT } from '../../utils/constants';
import { validateAmount, validateTransactionHash } from '../../utils/validation';
import { AnimatePresence } from 'framer-motion';

const Deposit = () => {
  const { createDeposit } = useContext(DataContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currency: 'BTC',
    amount: '',
    txHash: '',
    proofImage: null
  });

  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          proofImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    const amountValidation = validateAmount(formData.amount, MIN_DEPOSIT[formData.currency]);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.message;
    }

    const txHashValidation = validateTransactionHash(formData.txHash);
    if (!txHashValidation.valid) {
      newErrors.txHash = txHashValidation.message;
    }

    if (!formData.proofImage) {
      newErrors.proofImage = 'Please upload proof of payment';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Submit deposit request
    setTimeout(() => {
      const result = createDeposit(formData);

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
          <h2 className="text-3xl font-bold text-white mb-4">Deposit Submitted!</h2>
          <p className="text-slate-400 mb-6">
            Your deposit request has been submitted successfully. Our team will review and approve it shortly.
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
            <ArrowDownRight className="w-8 h-8 text-emerald-500" />
            Deposit Funds
          </h1>
          <p className="text-slate-400 mt-1">Add funds to your secure wallet</p>
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
        {/* Deposit Form */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Transaction Details</h2>

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
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10'
                        : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                  >
                    <span className="font-bold">{curr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Amount to Deposit
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.00000001"
                  placeholder="0.00"
                  className={`w-full bg-slate-900/50 border ${errors.amount ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors`}
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
                Minimum deposit: {MIN_DEPOSIT[formData.currency]} {formData.currency}
              </p>
            </div>

            {/* Transaction Hash */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Transaction Hash (TXID)
              </label>
              <input
                type="text"
                name="txHash"
                value={formData.txHash}
                onChange={handleChange}
                placeholder="Enter transaction hash from your wallet"
                className={`w-full bg-slate-900/50 border ${errors.txHash ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors`}
              />
              {errors.txHash && (
                <p className="mt-1 text-sm text-red-400">{errors.txHash}</p>
              )}
            </div>

            {/* Proof of Payment */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Proof of Payment
              </label>
              <div className={`border-2 border-dashed ${errors.proofImage ? 'border-red-500/30 bg-red-500/5' : 'border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5'} rounded-xl p-8 text-center transition-all cursor-pointer relative`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className={`w-8 h-8 mx-auto mb-3 ${formData.proofImage ? 'text-emerald-500' : 'text-slate-500'}`} />
                {formData.proofImage ? (
                  <p className="text-emerald-400 font-medium">Image Selected</p>
                ) : (
                  <>
                    <p className="text-slate-300 font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              {errors.proofImage && (
                <p className="mt-1 text-sm text-red-400">{errors.proofImage}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Submit Deposit Request'}
            </button>
          </form>
        </div>

        {/* Instructions & Wallet */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Wallet className="w-32 h-32 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-4 relative z-10">Company Wallet</h2>
            <p className="text-sm text-slate-400 mb-6 relative z-10">
              Please transfer exactly the entered amount to the address below.
            </p>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 shadow-inner relative z-10">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                {formData.currency} Address
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-mono text-emerald-400 break-all">
                  {COMPANY_WALLETS[formData.currency]}
                </p>
                <button
                  onClick={() => copyToClipboard(COMPANY_WALLETS[formData.currency])}
                  className="flex-shrink-0 p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl relative z-10">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Transfer Instructions</h4>
                  <ul className="text-xs text-slate-400 mt-2 space-y-1.5 marker:text-blue-500 list-disc pl-4">
                    <li>Only send {formData.currency} via the correct network.</li>
                    <li>Deposits require 3 network confirmations.</li>
                    <li>Always verify the address before sending.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">How it works</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Send Funds', desc: 'Transfer crypto to the wallet address.' },
                { step: 2, title: 'Upload Proof', desc: 'Take a screenshot of the transaction.' },
                { step: 3, title: 'Submit', desc: 'Fill the form and submit request.' },
                { step: 4, title: 'Approval', desc: 'Admin verifies and credits balance.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;