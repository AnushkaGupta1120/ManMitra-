import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Phone, BookOpen, HeartPulse, Brain, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const services = [
  {
    title: "Professional Counseling",
    desc: "Get non-judgmental emotional support from certified experts. Our emotional support online India platform connects you with professionals who understand.",
    icon: Brain,
    color: "bg-manmitra-teal"
  },
  {
    title: "Elderly Companionship",
    desc: "Premium companion for old age parents in Noida, Ghaziabad, and Delhi NCR. We provide dedicated elder care companionship to combat isolation.",
    icon: Heart,
    color: "bg-manmitra-yellow"
  },
  {
    title: "Peer Support Community",
    desc: "Join our peer support community online. A safe space to vent online and share feelings without judgment with people who've been there.",
    icon: Users,
    color: "bg-manmitra-teal"
  },
  {
    title: "Chat, Audio Call & Video Call connectivity",
    desc: "Talk to a stranger about feelings or vent out anonymously India. Our anonymous emotional support chat is available for late night support.",
    icon: Phone,
    color: "bg-manmitra-yellow"
  },
  {
    title: "Wellness Workshops",
    desc: "Interactive sessions on mindfulness and resilience. Learn to manage stress on India's premier active listening platform.",
    icon: HeartPulse,
    color: "bg-manmitra-teal"
  },
  {
    title: "In person ManMitra availability",
    desc: "Hire a companion for seniors in Ghaziabad or Noida. We offer in-person emotional support for seniors across Delhi NCR.",
    icon: Users,
    color: "bg-manmitra-yellow"
  }
];

export const Services = ({ onLearnMore }: { onLearnMore?: () => void }) => {
  return (
    <section id="services-section" className="section-padding bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
          <p className="text-lg text-slate-600">
            We offer a wide range of mental wellness services tailored to your unique needs. 
            Our goal is to provide accessible, compassionate support for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group flex flex-col">
                <CardHeader className="pb-2">
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base text-slate-500 leading-relaxed mb-6">
                    {service.desc}
                  </CardDescription>
                </CardContent>
                <div className="px-6 pb-8">
                  <button 
                    onClick={onLearnMore}
                    className="text-manmitra-teal font-bold text-sm hover:underline flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Learn More Details →
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
