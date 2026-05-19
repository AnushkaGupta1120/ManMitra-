import React from 'react';
import { Logo } from './Logo';
import { Instagram, Send as TelegramIcon, BookOpen, Heart, ChevronRight, Mail } from 'lucide-react';

export const Footer = ({ onNavClick }: { onNavClick: (page: string) => void }) => {
  return (
    <footer className="relative bg-[#0b1120] text-slate-300 pt-16 pb-8 px-6 overflow-hidden border-t border-slate-800">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-manmitra-teal/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-5">
            <Logo className="h-10 mb-6" />
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed text-sm">
              ManMitra is more than just a platform; it's a movement towards 
              better mental health for everyone. We believe that no one should 
              have to face their struggles alone.
            </p>
            
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/_manmitra/" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-400 hover:border-transparent hover:text-white transition-all">
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a href="https://t.me/Manmitra" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-[#229ED9] hover:border-transparent hover:text-white transition-all">
                <TelegramIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a href="https://medium.com/@Manmitra" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-slate-100 hover:border-transparent hover:text-slate-900 transition-all">
                <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Listeners', 'Contact'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => onNavClick(link.toLowerCase())} 
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                    <span className="group-hover:translate-x-1 transition-transform">{link}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Support</h4>
            <ul className="space-y-3 mb-8">
              {['Privacy Policy', 'Terms & Conditions'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => onNavClick(link.split(' ')[0].toLowerCase())} 
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                    <span className="group-hover:translate-x-1 transition-transform">{link}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
              <h5 className="text-white text-sm font-bold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                Reach Out Directly
              </h5>
              <a href="mailto:hello@manmitra.com" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                hello@manmitra.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ManMitra. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for mental wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};
