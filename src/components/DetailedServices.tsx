import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Users, MessageCircle, HeartPulse, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const detailedServices = [
  {
    id: "anonymous-chat",
    title: "Chat, Audio Call & Video Call connectivity",
    subtitle: "Seamless Emotional Support Connectivity",
    icon: Phone,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    color: "bg-manmitra-yellow",
    price: "Starting from ₹4 per minute",
    trial: "( First 10 Mins free )",
    duration: "Instant connectivity",
    description: "Need someone to talk to right now? Our platform offers seamless chat, audio, and video connectivity. Whether it's a late night emotional support chat or a quick session to share feelings without judgment online, we are always available.",
    features: [
      "Instant Audio & Video Calls",
      "100% Anonymous & Confidential",
      "Late night emotional support chat",
      "Talk to a stranger about feelings"
    ],
    keywords: ["talk to a stranger about feelings", "vent out anonymously India", "anonymous emotional support chat", "need someone to talk to right now"]
  },
  {
    id: "in-person",
    title: "In person ManMitra availability",
    subtitle: "Face-to-Face Emotional Support",
    icon: Users,
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=800",
    color: "bg-manmitra-yellow",
    price: "Starting from ₹699 per hour",
    duration: "Personalized home visits",
    description: "For those who prefer physical presence, we offer in-person ManMitra availability across Delhi, Noida, and Ghaziabad. Our companions are trained to provide empathetic presence and engage in meaningful conversations and activities.",
    features: [
      "Home visits in Noida & Ghaziabad",
      "Accompaniment for walks or appointments",
      "Engaging in hobbies and conversation",
      "Trained and background-verified companions"
    ],
    keywords: ["hire a companion for seniors Ghaziabad", "spend time with elderly parents service Noida", "elder care companionship Noida"]
  },
  {
    id: "elderly",
    title: "Elderly Companionship & Support",
    subtitle: "Companion for Old Age Parents in Noida & Delhi NCR",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800",
    color: "bg-manmitra-yellow",
    price: "Starting from ₹549 per hour",
    duration: "Flexible hourly engagement",
    description: "We specialize in providing elderly companion services in Delhi NCR, Noida, and Ghaziabad. Our trained 'ManMitras' spend quality time with your parents, offering in-person emotional support for seniors to combat isolation and loneliness in urban environments.",
    features: [
      "Spend time with elderly parents service Noida",
      "Elder care companionship Noida & Ghaziabad",
      "In-person emotional support for seniors Delhi",
      "Regular updates for family members"
    ],
    keywords: ["companion for old age parents in Noida", "elderly companion services Delhi NCR", "hire a companion for seniors Ghaziabad"]
  },
  {
    id: "counseling",
    title: "Professional Counseling & Therapy",
    subtitle: "Emotional Support Online India",
    icon: Brain,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    color: "bg-manmitra-teal",
    price: "Starting from ₹999 per session",
    duration: "50-55 Mins per session",
    description: "Our professional counseling services provide a non-judgmental emotional support system for individuals facing life's toughest challenges. Whether you're dealing with anxiety, depression, or work-related stress, our certified experts are here to help you navigate your journey to wellness.",
    features: [
      "Certified & Verified Therapists",
      "Evidence-based therapeutic approaches",
      "Personalized wellness plans",
      "Flexible scheduling options"
    ],
    keywords: ["non-judgmental emotional support", "emotional support online India", "professional therapy"]
  },
  {
    id: "workshops",
    title: "Emotional Wellness Workshops",
    subtitle: "Skill-building for Resilience",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    color: "bg-manmitra-teal",
    price: "Starting from ₹1299 per workshop",
    duration: "1.5 Hour intensive session",
    description: "Our workshops are designed to equip you with the tools needed for emotional self-regulation and stress management. From mindfulness sessions to resilience building, we provide actionable insights for a healthier mind.",
    features: [
      "Mindfulness & Meditation sessions",
      "Stress management techniques",
      "Emotional intelligence training",
      "Corporate wellness programs"
    ],
    keywords: ["emotional wellness", "stress management", "mindfulness India"]
  },
  {
    id: "peer-support",
    title: "Peer Support Community Online",
    subtitle: "Active Listening Platform India",
    icon: Users,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    color: "bg-manmitra-teal",
    price: "Starting from ₹4 per minute",
    duration: "Pay-as-you-go support",
    description: "Join a vibrant peer support community online where you can share your feelings without judgment. ManMitra acts as an active listening platform in India, connecting people with shared experiences to foster mutual growth and emotional resilience.",
    features: [
      "Moderated support groups",
      "Safe space to vent online",
      "Community-led wellness initiatives",
      "Peer-to-peer connection"
    ],
    keywords: ["peer support community online", "active listening platform India", "safe space to vent online"]
  }
];

export const DetailedServices = ({ onContactClick }: { onContactClick: () => void }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-manmitra-teal pt-24 pb-12 px-6 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Our Specialized Services
          </motion.h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Comprehensive emotional support and companionship tailored for every stage of life. 
            From anonymous online venting to in-person elderly care in Delhi NCR.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-24">
            {detailedServices.map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">{service.title}</h2>
                  <p className="text-manmitra-teal font-semibold mb-4 uppercase tracking-wider text-sm">{service.subtitle}</p>
                  
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-3 mb-6 inline-block">
                    <div className="flex flex-col">
                      <p className="text-xl font-bold text-slate-900">{service.price}</p>
                      {service.trial && (
                        <p className="text-sm font-bold text-manmitra-teal mt-0.5">{service.trial}</p>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1.5">
                      <Clock className="w-3.5 h-3.5" /> {service.duration}
                    </p>
                  </div>

                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <ShieldCheck className="w-5 h-5 text-manmitra-teal shrink-0" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.keywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-medium">
                        #{kw.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>

                  <Button 
                    onClick={onContactClick}
                    className="rounded-full bg-manmitra-teal hover:bg-manmitra-teal/90 text-white px-8 py-6 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-manmitra-teal/20"
                  >
                    Book a Session
                  </Button>
                </div>
                
                <div className="flex-1 w-full max-w-md">
                  <div className={`aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl border-8 border-white`}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
