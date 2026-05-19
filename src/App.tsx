/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LonelinessSection } from './components/LonelinessSection';
import { Services } from './components/Services';
import { DetailedServices } from './components/DetailedServices';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

import { Dashboard } from './pages/Dashboard';
import { ListenerDashboard } from './pages/ListenerDashboard';
import { Listeners, Listener, CommMode } from './pages/Listeners';
import { Wallet } from './pages/Wallet';
import { Chatbot } from './components/Chatbot';
import { SessionChat } from './pages/SessionChat';
import { motion, AnimatePresence } from 'framer-motion';

// Pages that should hide the standard Navbar & Footer
const AUTH_PAGES = ['login', 'signup'];

export default function App() {
  console.log('App component is mounting');
  const [activePage, setActivePage] = useState('home');
  const [activeSession, setActiveSession] = useState<{ listener: Listener; mode: CommMode } | null>(null);

  const handleNavClick = (page: string) => {
    if (page === 'contact' && activePage === 'home') {
      const element = document.getElementById('contact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    const element = document.getElementById('loneliness-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAuthPage = AUTH_PAGES.includes(activePage);

  return (
    <div className="min-h-screen bg-white selection:bg-manmitra-teal/20 selection:text-manmitra-teal">
      {/* Show Navbar on all pages except full-screen auth pages */}
      {!isAuthPage && <Navbar onNavClick={handleNavClick} />}
      
      <main>
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero 
                onCtaClick={() => handleNavClick('contact')} 
                onLearnMoreClick={handleLearnMore}
              />
              <LonelinessSection />
              <Services onLearnMore={() => handleNavClick('services')} />
              <ContactForm />
              <div className="bg-manmitra-teal py-20 px-6 text-center text-white">
                <div className="container mx-auto max-w-3xl">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to find your friend in wellness?</h2>
                  <p className="text-xl opacity-90 mb-10">
                    Join thousands of others who have found support and companionship through ManMitra.
                  </p>
                  <button 
                    onClick={() => handleNavClick('contact')}
                    className="bg-white text-manmitra-teal px-10 py-4 rounded-full font-bold text-lg hover:bg-manmitra-yellow-light transition-colors shadow-xl"
                  >
                    Get Started Today
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DetailedServices onContactClick={() => handleNavClick('contact')} />
            </motion.div>
          )}

          {activePage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-32"
            >
              <ContactForm />
            </motion.div>
          )}

          {activePage === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PrivacyPolicy />
            </motion.div>
          )}

          {activePage === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TermsAndConditions />
            </motion.div>
          )}

          {/* ─── Auth Pages ─────────────────────────────────── */}
          {activePage === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Login onNavClick={handleNavClick} />
            </motion.div>
          )}

          {activePage === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Signup onNavClick={handleNavClick} />
            </motion.div>
          )}



          {activePage === 'listeners' && (
            <motion.div
              key="listeners"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Listeners 
                onNavClick={handleNavClick} 
                onStartSession={(listener, mode) => {
                  setActiveSession({ listener, mode });
                  setActivePage('chat');
                }}
              />
            </motion.div>
          )}

          {activePage === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Wallet onNavClick={handleNavClick} />
            </motion.div>
          )}

          {activePage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard onNavClick={handleNavClick} />
            </motion.div>
          )}

          {activePage === 'listener-dashboard' && (
            <motion.div
              key="listener-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ListenerDashboard 
                onJoinSession={(sessionId, mode) => {
                  setActiveSession({ listener: { id: '', name: '', tagline: '', rating: 0, experience: '', categories: [], online: true, avatar: '' }, mode });
                  setActivePage('chat-listener');
                }} 
              />
            </motion.div>
          )}

          {activePage === 'chat' && activeSession && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="pt-20 min-h-screen bg-slate-50"
            >
              <SessionChat 
                listener={activeSession.listener} 
                mode={activeSession.mode} 
                role="user"
                onEndSession={() => {
                  setActiveSession(null);
                  setActivePage('listeners');
                }} 
              />
            </motion.div>
          )}

          {activePage === 'chat-listener' && activeSession && (
            <motion.div
              key="chat-listener"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="pt-20 min-h-screen bg-slate-50"
            >
              <SessionChat 
                mode={activeSession.mode} 
                role="listener"
                existingSessionId={activeSession.listener.id} // Reusing listener.id as the sessionId hack for routing
                onEndSession={() => {
                  setActiveSession(null);
                  setActivePage('listener-dashboard');
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Show Footer on all pages except full-screen auth pages and chat */}
      {!isAuthPage && activePage !== 'chat' && activePage !== 'chat-listener' && <Footer onNavClick={handleNavClick} />}

      {/* Chatbot — available on all pages */}
      <Chatbot />
    </div>
  );
}
