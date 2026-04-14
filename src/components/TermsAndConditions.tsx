import React from 'react';
import { motion } from 'framer-motion';
import { Scale, AlertCircle, CreditCard, UserCheck } from 'lucide-react';

export const TermsAndConditions = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-manmitra-yellow/10 flex items-center justify-center text-manmitra-yellow">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Terms & Conditions</h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              Welcome to ManMitra. By using our website and services, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-manmitra-teal" /> 1. Use of Services
              </h2>
              <p className="text-slate-600 mb-4">
                ManMitra provides emotional support, companionship, and wellness services. Our services are not a substitute for professional medical advice, diagnosis, or treatment by a psychiatrist or medical doctor.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>You must be at least 18 years old to use our services independently.</li>
                <li>You agree to provide accurate and complete information when booking sessions.</li>
                <li>You are responsible for maintaining the confidentiality of any account details.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-manmitra-teal" /> 2. Payments & Cancellations
              </h2>
              <p className="text-slate-600 mb-4">
                Our pricing is transparent and as listed on our Services page.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Payments:</strong> All fees must be paid in advance or as per the pay-per-minute structure for chat services.</li>
                <li><strong>Cancellations:</strong> Appointments cancelled less than 24 hours in advance may be subject to a cancellation fee.</li>
                <li><strong>Refunds:</strong> Refunds are processed on a case-by-case basis at the discretion of ManMitra management.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-manmitra-teal" /> 3. Code of Conduct
              </h2>
              <p className="text-slate-600 mb-4">
                We maintain a safe and respectful environment for both our users and ManMitras.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Abusive, harassing, or discriminatory behavior towards our staff or community members will result in immediate termination of services.</li>
                <li>Users must not use the platform for any illegal activities.</li>
                <li>Confidentiality must be respected by all parties involved in peer support groups.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitation of Liability</h2>
              <p className="text-slate-600 mb-4">
                ManMitra and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Modifications to Terms</h2>
              <p className="text-slate-600">
                We reserve the right to modify these terms at any time. Your continued use of the platform after changes are posted constitutes your acceptance of the new terms.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
