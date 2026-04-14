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
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [activePage, setActivePage] = useState('home');

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

  return (
    <div className="min-h-screen bg-white selection:bg-manmitra-teal/20 selection:text-manmitra-teal">
      <Navbar onNavClick={handleNavClick} />
      
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
        </AnimatePresence>
      </main>

      <Footer onNavClick={handleNavClick} />
    </div>
  );
}

