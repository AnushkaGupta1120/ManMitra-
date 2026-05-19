import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InputField } from '@/components/auth/InputField';
import { AuthButton } from '@/components/auth/AuthButton';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';

interface ForgotPasswordProps {
  onNavClick: (page: string) => void;
}

export function ForgotPassword({ onNavClick }: ForgotPasswordProps) {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = touched && !isValidEmail ? 'Enter a valid email address' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail) return;

    setLoading(true);
    setError('');

    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-manmitra-teal-light via-white to-manmitra-yellow-light pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
          {/* Header */}
          <div className="cursor-pointer inline-block mb-6" onClick={() => onNavClick('home')}>
            <Logo className="h-9" />
          </div>

          {success ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-manmitra-teal/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-manmitra-teal" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Check your inbox</h2>
              <p className="text-slate-500 mb-2">
                We've sent a password reset link to:
              </p>
              <p className="text-manmitra-teal font-semibold mb-6">{email}</p>
              <p className="text-sm text-slate-400 mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <div className="space-y-3">
                <AuthButton
                  variant="outline"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                    setTouched(false);
                  }}
                >
                  Try another email
                </AuthButton>
                <button
                  onClick={() => onNavClick('login')}
                  className="w-full text-sm text-manmitra-teal font-semibold hover:underline cursor-pointer py-2"
                >
                  Back to Sign In
                </button>
              </div>
            </motion.div>
          ) : (
            /* Form State */
            <>
              <button
                onClick={() => onNavClick('login')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-manmitra-teal transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>

              <h1 className="text-2xl font-bold text-slate-800 mb-2">Reset your password</h1>
              <p className="text-slate-500 text-sm mb-8">
                Enter the email address associated with your account and we'll send you
                a link to reset your password.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <InputField
                  id="forgot-email"
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onBlur={() => setTouched(true)}
                  error={emailError}
                  icon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                />

                <AuthButton type="submit" loading={loading} disabled={!isValidEmail}>
                  <Send className="w-4 h-4" />
                  Send Reset Link
                </AuthButton>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Remember your password?{' '}
          <button
            onClick={() => onNavClick('login')}
            className="text-manmitra-teal font-semibold hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
