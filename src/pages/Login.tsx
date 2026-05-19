import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputField } from '@/components/auth/InputField';
import { AuthButton } from '@/components/auth/AuthButton';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import {
  Phone,
  ArrowRight,
  ArrowLeft,
  Heart,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

// ─── Country Codes ───────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
];

// ─── OTP Input Component ─────────────────────────────────────────────────────

function OTPInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const newValue = value.split('');
    newValue[index] = char;
    const joined = newValue.join('').slice(0, 6);
    onChange(joined);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-11 h-13 sm:w-13 sm:h-14 rounded-xl border-2 text-center text-xl font-bold
            transition-all duration-200 outline-none
            ${value[i]
              ? 'border-manmitra-teal bg-manmitra-teal/5 text-slate-800'
              : 'border-slate-200 bg-white text-slate-800'
            }
            focus:border-manmitra-teal focus:ring-2 focus:ring-manmitra-teal/30
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Country Code Selector Component ─────────────────────────────────────────

function CountryCodeSelector({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  const filtered = useMemo(
    () =>
      COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search)
      ),
    [search]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 h-11 px-3 rounded-xl border border-slate-200 bg-white
          text-sm font-medium text-slate-700 transition-all duration-200 cursor-pointer
          hover:border-slate-300 focus:border-manmitra-teal focus:ring-2 focus:ring-manmitra-teal/30 outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${open ? 'border-manmitra-teal ring-2 ring-manmitra-teal/30' : ''}
        `}
      >
        <span className="text-lg">{selected.flag}</span>
        <span>{selected.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100">
              <input
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-manmitra-teal transition-colors"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No results</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer
                      ${c.code === value
                        ? 'bg-manmitra-teal/5 text-manmitra-teal font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                      }
                    `}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="flex-1">{c.name}</span>
                    <span className="text-slate-400 font-mono text-xs">{c.code}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface LoginProps {
  onNavClick: (page: string) => void;
}

export function Login({ onNavClick }: LoginProps) {
  const { sendOTP, verifyOTPAndLogin, loginWithGoogle } = useAuth();

  // Step: 1 = phone input, 2 = OTP verification
  const [step, setStep] = useState<1 | 2>(1);

  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');

  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // OTP countdown timer
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(60);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Validation
  const phoneValid = /^\d{7,15}$/.test(phone);
  const phoneError = touched && !phoneValid ? 'Enter a valid phone number' : '';

  // ─── Handlers ────────────────────────────────────────────────────────

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!phoneValid) return;

    setLoading(true);
    setServerError('');

    try {
      const fullPhone = `${countryCode}${phone}`;
      await sendOTP(fullPhone);
      setStep(2);
      startCountdown();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    setServerError('');

    try {
      await verifyOTPAndLogin(otp);
      onNavClick('dashboard');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setServerError('');
    setOtp('');

    try {
      const fullPhone = `${countryCode}${phone}`;
      await sendOTP(fullPhone);
      startCountdown();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError('');
    try {
      await loginWithGoogle();
      onNavClick('dashboard');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* reCAPTCHA container — required by Firebase Phone Auth */}
      <div id="recaptcha-container" />

      {/* Left — Brand Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-manmitra-teal via-manmitra-teal/90 to-emerald-700 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-32 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-20 w-56 h-56 bg-manmitra-yellow/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 text-white max-w-md"
        >
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Welcome back to<br />
            your safe space
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Continue your wellness journey. Your ManMitra is always here,
            ready to listen without judgment.
          </p>

          <div className="space-y-5">
            {[
              { icon: MessageCircle, text: 'Pick up right where you left off' },
              { icon: Heart, text: 'Your conversations are always private' },
              { icon: Sparkles, text: 'Personalized support waiting for you' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-manmitra-yellow" />
                </div>
                <span className="text-white/90 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-white via-manmitra-teal-light/20 to-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="cursor-pointer inline-block mb-6" onClick={() => onNavClick('home')}>
              <Logo className="h-9" />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1-header"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">Sign in to your account</h1>
                  <p className="text-slate-500">
                    Enter your phone number to continue
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="step2-header"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(''); setServerError(''); }}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-manmitra-teal transition-colors mb-4 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change number
                  </button>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">Enter verification code</h1>
                  <p className="text-slate-500">
                    We've sent a 6-digit code to{' '}
                    <span className="font-semibold text-manmitra-teal">{countryCode} {phone}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Google Login — only on step 1 */}
          {step === 1 && (
            <>
              <GoogleButton
                onClick={handleGoogleLogin}
                loading={googleLoading}
                disabled={loading}
              />

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-sm text-slate-400 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
            >
              {serverError}
            </motion.div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSendOTP}
                className="space-y-5"
                noValidate
              >
                {/* Phone with Country Code */}
                <div className="space-y-1.5">
                  <label htmlFor="login-phone" className="text-sm font-medium text-slate-700">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <CountryCodeSelector
                      value={countryCode}
                      onChange={setCountryCode}
                      disabled={loading}
                    />
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="login-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPhone(val);
                          setServerError('');
                        }}
                        onBlur={() => setTouched(true)}
                        maxLength={15}
                        autoComplete="tel"
                        className={`
                          h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-base transition-all duration-200 outline-none
                          placeholder:text-slate-400
                          ${phoneError
                            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-200 focus:border-manmitra-teal focus:ring-2 focus:ring-manmitra-teal/30'
                          }
                        `}
                      />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1" role="alert">
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {phoneError}
                    </p>
                  )}
                </div>

                <AuthButton type="submit" loading={loading} disabled={!phoneValid || googleLoading}>
                  Send OTP <ArrowRight className="w-4 h-4" />
                </AuthButton>
              </motion.form>
            ) : (
              <motion.form
                key="step2-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleVerifyOTP}
                className="space-y-6"
                noValidate
              >
                {/* OTP Input */}
                <div className="py-4">
                  <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                </div>

                {/* Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-slate-400">
                      Resend code in{' '}
                      <span className="font-semibold text-manmitra-teal">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm text-manmitra-teal font-semibold hover:underline cursor-pointer disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <AuthButton type="submit" loading={loading} disabled={otp.length !== 6}>
                  Verify & Sign In <ArrowRight className="w-4 h-4" />
                </AuthButton>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{' '}
            <button
              onClick={() => onNavClick('signup')}
              className="text-manmitra-teal font-semibold hover:underline cursor-pointer"
            >
              Create one
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
