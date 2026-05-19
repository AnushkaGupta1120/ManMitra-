import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/auth/Loader';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  IndianRupee,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  getWalletBalance,
  addFunds,
  getTransactionHistory,
  initiatePayment,
  MIN_TOPUP,
  PRESET_AMOUNTS,
  type Transaction,
} from '@/services/walletService';

interface WalletProps {
  onNavClick: (page: string) => void;
}

export function Wallet({ onNavClick }: WalletProps) {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load wallet data
  const loadWallet = useCallback(async () => {
    if (!user) return;
    try {
      const [bal, txns] = await Promise.all([
        getWalletBalance(user.uid),
        getTransactionHistory(user.uid),
      ]);
      setBalance(bal);
      setTransactions(txns);
    } catch (err) {
      console.error('Failed to load wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadWallet();
  }, [user, loadWallet]);

  // Handle add money
  const handleAddMoney = async (amount: number) => {
    if (!user || adding) return;
    if (amount < MIN_TOPUP) {
      setError(`Minimum top-up amount is ₹${MIN_TOPUP}`);
      return;
    }

    setError('');
    setSuccess('');
    setAdding(true);

    try {
      const result = await initiatePayment(
        amount,
        userProfile?.email || user.email || '',
        userProfile?.name || user.displayName || '',
        userProfile?.phone || ''
      );

      if (result.success && result.paymentId) {
        const newBalance = await addFunds(user.uid, amount, result.paymentId);
        setBalance(newBalance);
        setSuccess(`₹${amount} added successfully!`);
        setCustomAmount('');
        // Reload transactions
        const txns = await getTransactionHistory(user.uid);
        setTransactions(txns);
      } else if (result.error && result.error !== 'Payment cancelled') {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setAdding(false);
    }
  };

  // Auth guard
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Please sign in</h2>
          <p className="text-slate-500 mb-6">You need to be signed in to access your wallet.</p>
          <button
            onClick={() => onNavClick('login')}
            className="bg-manmitra-teal text-white px-8 py-3 rounded-xl font-semibold hover:bg-manmitra-teal/90 transition-colors cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-manmitra-teal-light/20 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">My Wallet</h1>
          <p className="text-slate-500">Manage your balance and add money for sessions</p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-manmitra-teal to-emerald-600 rounded-2xl p-6 sm:p-8 mb-6 text-white shadow-xl shadow-manmitra-teal/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <WalletIcon className="w-5 h-5" />
            </div>
            <span className="text-white/70 font-medium text-sm">Available Balance</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-lg text-white/70">₹</span>
            <span className="text-5xl font-bold tracking-tight">{balance.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60 text-xs">
            <Sparkles className="w-3 h-3" />
            <span>First 15 minutes with any listener are FREE</span>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
                <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">✕</button>
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                {success}
                <button onClick={() => setSuccess('')} className="ml-auto text-emerald-400 hover:text-emerald-600 cursor-pointer">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Money Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6"
        >
          <h2 className="font-bold text-slate-800 text-lg mb-1">Add Money</h2>
          <p className="text-slate-400 text-sm mb-5">Minimum top-up: ₹{MIN_TOPUP}</p>

          {/* Preset Amounts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAddMoney(amount)}
                disabled={adding}
                className="py-3 rounded-xl border-2 border-manmitra-teal/20 text-manmitra-teal font-bold text-lg hover:bg-manmitra-teal hover:text-white hover:border-manmitra-teal transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                ₹{amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min={MIN_TOPUP}
                className="w-full h-12 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-base font-medium outline-none focus:border-manmitra-teal focus:ring-2 focus:ring-manmitra-teal/20 transition-all"
              />
            </div>
            <button
              onClick={() => handleAddMoney(Number(customAmount))}
              disabled={adding || !customAmount || Number(customAmount) < MIN_TOPUP}
              className="px-6 h-12 rounded-xl bg-manmitra-teal text-white font-semibold hover:bg-manmitra-teal/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <h2 className="font-bold text-slate-800 text-lg mb-4">Transaction History</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No transactions yet</p>
              <p className="text-slate-300 text-xs mt-1">Add money to your wallet to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((txn, i) => (
                <div
                  key={txn.id || i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    txn.type === 'credit'
                      ? 'bg-emerald-50 text-emerald-500'
                      : 'bg-red-50 text-red-400'
                  }`}>
                    {txn.type === 'credit'
                      ? <ArrowDownLeft className="w-4 h-4" />
                      : <ArrowUpRight className="w-4 h-4" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{txn.description}</p>
                    <p className="text-xs text-slate-400">
                      {txn.timestamp.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${
                    txn.type === 'credit' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Back to Listeners */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavClick('listeners')}
            className="text-manmitra-teal font-semibold hover:underline cursor-pointer text-sm"
          >
            ← Browse Listeners
          </button>
        </div>
      </div>
    </div>
  );
}
