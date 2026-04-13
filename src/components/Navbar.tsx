import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export const Navbar = ({ onNavClick }: { onNavClick: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavClick(page);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="max-w-4xl w-full relative">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-full px-6 py-3 flex items-center gap-8 shadow-lg w-full justify-between relative z-50"
        >
          <div className="cursor-pointer" onClick={() => handleNav('home')}>
            <Logo className="h-8" />
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => handleNav('home')}
              className="text-sm font-medium text-slate-600 hover:text-manmitra-teal transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('services')}
              className="text-sm font-medium text-slate-600 hover:text-manmitra-teal transition-colors"
            >
              Services
            </button>
            <Button 
              onClick={() => handleNav('contact')}
              className="rounded-full bg-manmitra-teal hover:bg-manmitra-teal/90 text-white px-6"
            >
              Get in Touch
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 p-4 glass rounded-3xl shadow-xl md:hidden z-40"
            >
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => handleNav('home')}
                  className="p-4 text-left font-medium text-slate-700 hover:bg-manmitra-teal-light rounded-2xl transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNav('services')}
                  className="p-4 text-left font-medium text-slate-700 hover:bg-manmitra-teal-light rounded-2xl transition-colors"
                >
                  Services
                </button>
                <Button 
                  onClick={() => handleNav('contact')}
                  className="w-full rounded-2xl bg-manmitra-teal hover:bg-manmitra-teal/90 text-white py-6 text-lg"
                >
                  Get in Touch
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
