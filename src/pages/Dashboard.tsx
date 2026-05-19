import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/auth/Loader';
import { Logo } from '@/components/Logo';
import { getWalletBalance } from '@/services/walletService';
import {
  LogOut,
  User,
  Mail,
  Phone,
  Shield,
  Heart,
  MessageCircle,
  Wallet,
} from 'lucide-react';

interface DashboardProps {
  onNavClick: (page: string) => void;
}

export function Dashboard({ onNavClick }: DashboardProps) {
  const { user, userProfile, loading, logout } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      getWalletBalance(user.uid).then(setWalletBalance).catch(console.error);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      onNavClick('home');
    } catch {
      // Error handled silently
    }
  };

  if (loading) {
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
          <p className="text-slate-500 mb-6">You need to be signed in to view your dashboard.</p>
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

  const profile = userProfile;
  const displayName = profile?.name || user.displayName || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-manmitra-teal-light/30 via-white to-manmitra-yellow-light/30 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Welcome back, {displayName.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 text-lg">
            Here's your ManMitra dashboard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8"
          >
            <div className="flex items-start gap-5 mb-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-manmitra-teal flex items-center justify-center text-white font-bold text-xl">
                  {initials}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800">{displayName}</h2>
                <p className="text-slate-500 text-sm">{user.email}</p>
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-manmitra-teal/10 text-manmitra-teal text-xs font-semibold">
                  <Shield className="w-3 h-3" />
                  {profile?.auth_provider === 'google' ? 'Google Account' : 'Phone Account'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: User, label: 'Full Name', value: profile?.name || displayName },
                { icon: Mail, label: 'Email', value: profile?.email || user.email || '—' },
                { icon: Phone, label: 'Phone', value: profile?.phone || 'Not provided' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className="text-sm text-slate-700 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-500 font-semibold hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-manmitra-teal to-emerald-600 rounded-2xl p-6 text-white">
              <Heart className="w-8 h-8 mb-4 text-manmitra-yellow" />
              <h3 className="font-bold text-lg mb-2">Need Support?</h3>
              <p className="text-white/80 text-sm mb-4">
                Connect with a compassionate listener who's here for you.
              </p>
              <button
                onClick={() => onNavClick('contact')}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm backdrop-blur-sm cursor-pointer"
              >
                Get in Touch
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <Wallet className="w-8 h-8 mb-4 text-manmitra-teal" />
              <h3 className="font-bold text-slate-800 mb-2">My Wallet</h3>
              <p className="text-slate-500 text-sm mb-4">
                Balance: {walletBalance !== null ? `₹${walletBalance.toFixed(2)}` : 'Loading...'}
              </p>
              <button
                onClick={() => onNavClick('wallet')}
                className="w-full bg-manmitra-teal/10 hover:bg-manmitra-teal/20 text-manmitra-teal font-semibold py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
              >
                Add Money / View
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
