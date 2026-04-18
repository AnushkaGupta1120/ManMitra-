import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Hero = ({ onCtaClick, onLearnMoreClick }: { onCtaClick: () => void, onLearnMoreClick: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Hero Banner Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516534775068-ba3e84529519?auto=format&fit=crop&q=80&w=2000" 
          alt="Peaceful background" 
          className="w-full h-full object-cover opacity-10"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-manmitra-teal/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-manmitra-yellow/10 rounded-full blur-3xl animate-pulse delay-700" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-manmitra-teal-light text-manmitra-teal text-sm font-bold mb-8 shadow-sm border border-manmitra-teal/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Your Safe Space for Mental Wellness</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-8xl font-bold text-slate-900 mb-8 leading-[1.05]"
        >
          Kyunki har Mann ko <br />
          <span className="text-manmitra-teal">ek dost chahiye</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          ManMitra is India's leading <strong>active listening platform</strong> providing <strong>non-judgmental emotional support online</strong>. 
          Find a <strong>safe space to vent online</strong> and <strong>talk to a listener</strong> who truly cares.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button 
            onClick={onCtaClick}
            size="lg" 
            className="rounded-full bg-manmitra-teal hover:bg-manmitra-teal/90 text-white px-12 py-8 text-xl font-bold shadow-2xl shadow-manmitra-teal/30 hover:scale-105 transition-all active:scale-95"
          >
            Start Your Journey
          </Button>
          <Button 
            onClick={onLearnMoreClick}
            variant="outline" 
            size="lg" 
            className="rounded-full border-2 border-manmitra-yellow text-manmitra-yellow hover:bg-manmitra-yellow/10 px-12 py-8 text-xl font-bold hover:scale-105 transition-all active:scale-95"
          >
            Learn More
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { icon: Heart, title: "Compassionate Care", desc: "Support that feels like a warm hug." },
            { icon: ShieldCheck, title: "100% Confidential", desc: "Your privacy is our utmost priority." },
            { icon: Sparkles, title: "Expert Guidance", desc: "Verified professionals at your service." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center p-6 rounded-3xl bg-white/50 border border-white/20 backdrop-blur-sm card-shadow shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-manmitra-teal-light flex items-center justify-center text-manmitra-teal mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
