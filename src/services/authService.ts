import {
  signInWithPopup,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signOut,
  updateProfile,
  type User,
  type ConfirmationResult,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/firebase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  is_verified: boolean;
  auth_provider: 'phone' | 'google';
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
}

// ─── Error Mapping ───────────────────────────────────────────────────────────

const FIREBASE_ERROR_MAP: Record<string, string> = {
  'auth/invalid-phone-number': 'Please enter a valid phone number.',
  'auth/missing-phone-number': 'Phone number is required.',
  'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
  'auth/invalid-verification-code': 'Invalid OTP code. Please check and try again.',
  'auth/code-expired': 'OTP has expired. Please request a new one.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/popup-blocked': 'Popup was blocked by your browser. Please allow popups.',
  'auth/account-exists-with-different-credential':
    'An account already exists with this email using a different sign-in method.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
};

function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code;
    if (code && FIREBASE_ERROR_MAP[code]) {
      return FIREBASE_ERROR_MAP[code];
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

// ─── reCAPTCHA ───────────────────────────────────────────────────────────────

let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Initialize or reuse an invisible reCAPTCHA verifier.
 * The container element must exist in the DOM.
 */
export function getRecaptchaVerifier(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
  // Clean up existing verifier
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      // Ignore cleanup errors
    }
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved — will proceed with phone auth
    },
    'expired-callback': () => {
      // reCAPTCHA expired — reset
      recaptchaVerifier = null;
    },
  });

  return recaptchaVerifier;
}

/**
 * Clear the reCAPTCHA verifier (cleanup).
 */
export function clearRecaptchaVerifier(): void {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      // Ignore cleanup errors
    }
    recaptchaVerifier = null;
  }
}

// ─── Phone Auth Functions ────────────────────────────────────────────────────

/**
 * Send an OTP to the given phone number.
 * Returns a ConfirmationResult to be used for OTP verification.
 */
export async function sendPhoneOTP(
  phoneNumber: string,
  recaptcha: RecaptchaVerifier
): Promise<ConfirmationResult> {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    return confirmationResult;
  } catch (error) {
    clearRecaptchaVerifier();
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Verify the OTP code and sign the user in.
 * Returns the Firebase user.
 */
export async function verifyPhoneOTP(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<User> {
  try {
    const credential = await confirmationResult.confirm(code);
    return credential.user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Register a new user via phone OTP.
 * Verifies the OTP, then creates the Firestore user profile.
 */
export async function registerWithPhone(
  confirmationResult: ConfirmationResult,
  code: string,
  data: SignupData
): Promise<User> {
  try {
    const credential = await confirmationResult.confirm(code);
    const user = credential.user;

    // Set display name on Firebase Auth profile
    await updateProfile(user, { displayName: data.name });

    // Create Firestore user document
    await createUserProfile(user.uid, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      is_verified: true,
      auth_provider: 'phone',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

// ─── Google Auth ─────────────────────────────────────────────────────────────

export async function loginWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;

    // Check if user doc exists in Firestore — create if new
    const exists = await checkUserExists(user.uid);
    if (!exists) {
      await createUserProfile(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        is_verified: user.emailVerified,
        auth_provider: 'google',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    return user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

// ─── Firestore Functions ─────────────────────────────────────────────────────

export async function createUserProfile(
  uid: string,
  data: UserProfile
): Promise<void> {
  await setDoc(doc(db, 'users', uid), data);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

export async function checkUserExists(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists();
}

/**
 * Look up a user's profile by their phone number in Firestore.
 */
export async function getUserByPhone(phone: string): Promise<{ uid: string; profile: UserProfile } | null> {
  const q = query(collection(db, 'users'), where('phone', '==', phone));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return { uid: docSnap.id, profile: docSnap.data() as UserProfile };
  }
  return null;
}
