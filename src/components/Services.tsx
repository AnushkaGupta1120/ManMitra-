import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Users, Phone, BookOpen, HeartPulse, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const services = [
  {
    title: "One-on-One Counseling",
    desc: "Personalized sessions with certified therapists to help you navigate life's challenges.",
    icon: Brain,
    color: "bg-manmitra-teal"
  },
  {
    title: "Active Listening",
    desc: "Sometimes you just need someone to listen without judgment. We are here for you.",
    icon: MessageCircle,
    color: "bg-manmitra-yellow"
  },
  {
    title: "Support Groups",
    desc: "Connect with others who understand your journey in a safe, moderated environment.",
    icon: Users,
    color: "bg-manmitra-teal"
  },
  {
    title: "Chat, Audio & Video Connectivity",
    desc: "Connect with your ManMitra through your preferred mode of communication seamlessly.",
    icon: Phone,
    color: "bg-manmitra-yellow"
  },
  {
    title: "Wellness Workshops",
    desc: "Interactive sessions on mindfulness, stress management, and emotional resilience.",
    icon: HeartPulse,
    color: "bg-manmitra-teal"
  },
  {
    title: "In person ManMitra availability",
    desc: "Face-to-face support for those who prefer physical presence and personal connection.",
    icon: Users,
    color: "bg-manmitra-yellow"
  }
];

export const Services = () => {
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
              <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
                <CardHeader className="pb-2">
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-500 leading-relaxed">
                    {service.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
