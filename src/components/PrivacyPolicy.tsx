import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-manmitra-teal/10 flex items-center justify-center text-manmitra-teal">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Privacy Policy</h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              Last Updated: April 14, 2026
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-manmitra-teal" /> 1. Information We Collect
              </h2>
              <p className="text-slate-600 mb-4">
                At ManMitra, we collect information to provide better services to all our users. The types of personal information we collect include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and physical address (for in-person services).</li>
                <li><strong>Health & Wellness Information:</strong> Information you share during counseling or peer support sessions to help us provide appropriate support.</li>
                <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
                <li><strong>Payment Information:</strong> We process payments through secure third-party providers and do not store full credit card details on our servers.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-manmitra-teal" /> 2. How We Use Your Information
              </h2>
              <p className="text-slate-600 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>To provide, maintain, and improve our emotional support and companionship services.</li>
                <li>To schedule and manage your sessions with counselors or ManMitras.</li>
                <li>To communicate with you about your appointments, account, or updates to our services.</li>
                <li>To ensure the safety and security of our community members and staff.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-manmitra-teal" /> 3. Data Security & Confidentiality
              </h2>
              <p className="text-slate-600 mb-4">
                Confidentiality is the cornerstone of ManMitra. We implement robust security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Encryption:</strong> All data transmitted through our platform is encrypted using industry-standard SSL/TLS technology.</li>
                <li><strong>Anonymity:</strong> For our anonymous chat services, we do not link your session data to your real identity unless explicitly requested or required for safety.</li>
                <li><strong>Access Control:</strong> Only authorized personnel who need the information to perform their duties have access to personal data.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-manmitra-teal" /> 4. Your Rights
              </h2>
              <p className="text-slate-600 mb-4">
                You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. To exercise these rights, please contact us at support@manmitra.com.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
              <p className="text-slate-600">
                If you have any questions about this Privacy Policy or our data practices, please reach out to our Data Protection Officer at privacy@manmitra.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
