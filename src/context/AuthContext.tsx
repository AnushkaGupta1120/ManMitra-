import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { onAuthStateChanged, type User, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/firebase';
import {
  type UserProfile,
  type SignupData,
  sendPhoneOTP,
  verifyPhoneOTP,
  registerWithPhone,
  loginWithGoogle as googleSignIn,
  logoutUser,
  getUserProfile,
  getRecaptchaVerifier,
  clearRecaptchaVerifier,
} from '@/services/authService';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTPAndLogin: (code: string) => Promise<void>;
  verifyOTPAndSignup: (code: string, data: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Store the confirmation result between OTP send and verify
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearRecaptchaVerifier();
    };
  }, []);

  /**
   * Send OTP to a phone number.
   * The phone number should include country code, e.g. "+919876543210".
   */
  const sendOTP = useCallback(async (phoneNumber: string) => {
    const recaptcha = getRecaptchaVerifier('recaptcha-container');
    const result = await sendPhoneOTP(phoneNumber, recaptcha);
    confirmationResultRef.current = result;
  }, []);

  /**
   * Verify OTP for login — just confirms the code (no Firestore profile creation).
   */
  const verifyOTPAndLogin = useCallback(async (code: string) => {
    if (!confirmationResultRef.current) {
      throw new Error('Please request an OTP first.');
    }
    const firebaseUser = await verifyPhoneOTP(confirmationResultRef.current, code);
    const profile = await getUserProfile(firebaseUser.uid);
    setUserProfile(profile);
    confirmationResultRef.current = null;
  }, []);

  /**
   * Verify OTP for signup — confirms the code AND creates Firestore profile.
   */
  const verifyOTPAndSignup = useCallback(async (code: string, data: SignupData) => {
    if (!confirmationResultRef.current) {
      throw new Error('Please request an OTP first.');
    }
    const firebaseUser = await registerWithPhone(confirmationResultRef.current, code, data);
    const profile = await getUserProfile(firebaseUser.uid);
    setUserProfile(profile);
    confirmationResultRef.current = null;
  }, []);

  const handleLoginWithGoogle = useCallback(async () => {
    const firebaseUser = await googleSignIn();
    const profile = await getUserProfile(firebaseUser.uid);
    setUserProfile(profile);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
    confirmationResultRef.current = null;
  }, []);

  const value: AuthContextValue = {
    user,
    userProfile,
    loading,
    sendOTP,
    verifyOTPAndLogin,
    verifyOTPAndSignup,
    loginWithGoogle: handleLoginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
