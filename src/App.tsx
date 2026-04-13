/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LonelinessSection } from './components/LonelinessSection';
import { Services } from './components/Services';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const handleNavClick = (page: string) => {
    if (page === 'services' && activePage === 'home') {
      const element = document.getElementById('services-section');
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
              <Services />
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-32"
            >
              <Services />
              <div className="container mx-auto px-6 pb-20 text-center">
                <h3 className="text-2xl font-bold mb-6">Need a custom support plan?</h3>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className="bg-manmitra-teal text-white px-8 py-3 rounded-full font-bold hover:bg-manmitra-teal/90 transition-colors"
                >
                  Talk to an Expert
                </button>
              </div>
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
        </AnimatePresence>
      </main>

      <Footer onNavClick={handleNavClick} />
    </div>
  );
}

