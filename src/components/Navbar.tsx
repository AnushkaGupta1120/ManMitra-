import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Navbar = ({ onNavClick }: { onNavClick: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavClick(page);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => handleNav('home')}>
            <Logo className="h-10" />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNav('home')}
              className="text-base font-semibold text-slate-600 hover:text-manmitra-teal hover:scale-105 transition-all cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('services')}
              className="text-base font-semibold text-slate-600 hover:text-manmitra-teal hover:scale-105 transition-all cursor-pointer"
            >
              Services
            </button>
            <Button 
              onClick={() => handleNav('contact')}
              className="rounded-full bg-manmitra-teal hover:bg-manmitra-teal/90 text-white px-8 py-2 hover:scale-105 transition-all"
            >
              Get in Touch
            </Button>
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
              <Button 
                onClick={() => handleNav('contact')}
                className="w-full rounded-xl bg-manmitra-teal hover:bg-manmitra-teal/90 text-white py-6 text-lg"
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
