import React from 'react';
import { Logo } from './Logo';
import { Instagram, Send as TelegramIcon, BookOpen, Heart } from 'lucide-react';

export const Footer = ({ onNavClick }: { onNavClick: (page: string) => void }) => {
  return (
    <footer className="bg-slate-900 text-white py-10 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="h-10 mb-6" />
            <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
              ManMitra is more than just a platform; it's a movement towards 
              better mental health for everyone. We believe that no one should 
              have to face their struggles alone.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/_manmitra/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-manmitra-teal transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://t.me/Manmitra" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-manmitra-teal transition-colors">
                <TelegramIcon className="w-5 h-5" />
              </a>
              <a href="https://medium.com/@Manmitra" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-manmitra-teal transition-colors">
                <BookOpen className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <button 
                  onClick={() => onNavClick('home')} 
                  className="hover:text-manmitra-teal transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavClick('services')} 
                  className="hover:text-manmitra-teal transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavClick('contact')} 
                  className="hover:text-manmitra-teal transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <button 
                  onClick={() => onNavClick('privacy')} 
                  className="hover:text-manmitra-teal transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavClick('terms')} 
                  className="hover:text-manmitra-teal transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ManMitra. All rights reserved.</p>
          <span className="hidden md:inline">•</span>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for mental wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};
