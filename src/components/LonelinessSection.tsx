import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Brain, Users, HeartPulse, UserMinus, Activity } from 'lucide-react';

const stats = [
  {
    icon: Flame,
    title: "15 cigarettes",
    desc: "Loneliness increases risk of early death as much as smoking 15 cigarettes daily",
    color: "text-orange-500"
  },
  {
    icon: Brain,
    title: "64% more likely",
    desc: "People who feel lonely are 64% more likely to develop clinical anxiety or depression",
    color: "text-manmitra-teal"
  },
  {
    icon: Users,
    title: "1 in 3 Young",
    desc: "1 in 3 young Indians privately admit they have no one to talk to about their feelings",
    color: "text-manmitra-yellow"
  },
  {
    icon: HeartPulse,
    title: "25% & 32%",
    desc: "Loneliness increases risk of heart disease by 25% and stroke by 32%",
    color: "text-red-500"
  },
  {
    icon: UserMinus,
    title: "73% Isolated",
    desc: "73% of senior citizens in India report feeling isolated in urban areas",
    color: "text-manmitra-teal"
  },
  {
    icon: Activity,
    title: "40% Higher Risk",
    desc: "Humans deprived of emotional connection show 40% higher risk of dementia",
    color: "text-manmitra-yellow"
  }
];

export const LonelinessSection = () => {
  return (
    <section id="loneliness-section" className="section-padding bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-manmitra-teal font-medium uppercase tracking-widest text-sm mb-4">Impact & Awareness</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-manmitra-yellow">Loneliness</span> Epidemic
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Loneliness is more than just a feeling; it's a health crisis. As India's premier <strong>active listening platform</strong>, 
            we provide <strong>non-judgmental emotional support online</strong> to help you navigate these challenges. 
            Find a <strong>safe space to vent online</strong> and reconnect with your wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-start"
            >
              <div className={`mb-4 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{stat.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
