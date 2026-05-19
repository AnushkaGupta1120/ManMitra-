import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getWalletBalance } from '@/services/walletService';

export const Navbar = ({ onNavClick }: { onNavClick: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile, loading, logout } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      getWalletBalance(user.uid).then(setBalance).catch(console.error);
    } else {
      setBalance(null);
    }
  }, [user]);

  const handleNav = (page: string) => {
    onNavClick(page);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleNav('home');
    } catch {
      // Error handled silently
    }
  };

  const displayName = userProfile?.name || user?.displayName || '';
  const initials = displayName
    ? displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Listeners', id: 'listeners' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleNav('home')}>
            <Logo className="h-9 sm:h-10" />
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-manmitra-teal hover:bg-manmitra-teal/5 rounded-full transition-all cursor-pointer"
              >
                {link.name}
              </button>
            ))}

            <div className="w-px h-6 bg-slate-200 mx-4" />

            {!loading && user ? (
              /* ─── Authenticated ─── */
              <div className="flex items-center gap-3">
                {/* Wallet Pill */}
                <button
                  onClick={() => handleNav('wallet')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer group"
                >
                  <Wallet className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold tracking-tight">
                    ₹{balance !== null ? balance.toFixed(0) : '...'}
                  </span>
                </button>

                {/* Profile Pill */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full p-1 pl-3 shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => handleNav(user?.email === 'shashikant132@gmail.com' ? 'listener-dashboard' : 'dashboard')}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="text-sm font-bold text-slate-700 max-w-[90px] truncate group-hover:text-manmitra-teal transition-colors">
                      {displayName.split(' ')[0] || 'Dashboard'}
                    </span>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-manmitra-teal to-emerald-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
                        {initials || <User className="w-4 h-4" />}
                      </div>
                    )}
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button 
                    onClick={handleLogout}
                    title="Sign Out"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            ) : !loading ? (
              /* ─── Not Authenticated ─── */
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-manmitra-teal hover:bg-slate-50 rounded-full transition-all cursor-pointer"
                >
                  Log in
                </button>
                <Button 
                  onClick={() => handleNav('signup')}
                  className="rounded-full bg-manmitra-teal hover:bg-manmitra-teal/90 text-white px-6 py-2 text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Sign Up
                </Button>
              </div>
            ) : null}
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-slate-200 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <button 
                onClick={() => handleNav('home')}
                className="text-lg font-semibold text-slate-700 hover:text-manmitra-teal transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => handleNav('services')}
                className="text-lg font-semibold text-slate-700 hover:text-manmitra-teal transition-colors text-left"
              >
                Services
              </button>
              <button 
                onClick={() => handleNav('listeners')}
                className="text-lg font-semibold text-slate-700 hover:text-manmitra-teal transition-colors text-left"
              >
                Listeners
              </button>

              {!loading && user ? (
                <>
                  <button
                    onClick={() => handleNav(user?.email === 'shashikant132@gmail.com' ? 'listener-dashboard' : 'dashboard')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-lg font-semibold text-red-500 hover:text-red-600 transition-colors text-left flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : !loading ? (
                <>
                  <button
                    onClick={() => handleNav('login')}
                    className="text-lg font-semibold text-slate-700 hover:text-manmitra-teal transition-colors text-left"
                  >
                    Login
                  </button>
                  <Button 
                    onClick={() => handleNav('signup')}
                    className="w-full rounded-xl bg-manmitra-teal hover:bg-manmitra-teal/90 text-white py-6 text-lg"
                  >
                    Sign Up
                  </Button>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
