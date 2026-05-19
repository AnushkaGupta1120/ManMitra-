import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, increment } from 'firebase/firestore';
import { db } from '@/firebase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Transaction {
  id?: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: Date;
  paymentId?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const MIN_TOPUP = 150;       // Minimum add money amount (₹)
export const MIN_BALANCE = 50;      // Minimum balance required to start session (₹)
export const PRESET_AMOUNTS = [150, 200, 300, 500];

// ─── Wallet Functions ────────────────────────────────────────────────────────

export async function getWalletBalance(uid: string): Promise<number> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().walletBalance ?? 0;
  }
  return 0;
}

export async function addFunds(
  uid: string,
  amount: number,
  paymentId: string
): Promise<number> {
  const userRef = doc(db, 'users', uid);

  // Update balance (use setDoc with merge to create doc if it doesn't exist)
  await setDoc(userRef, {
    walletBalance: increment(amount),
  }, { merge: true });

  // Record transaction
  await addDoc(collection(db, 'users', uid, 'transactions'), {
    type: 'credit',
    amount,
    description: `Added ₹${amount} via Razorpay`,
    timestamp: new Date(),
    paymentId,
  });

  // Return new balance
  const updated = await getDoc(userRef);
  return updated.data()?.walletBalance ?? 0;
}

export async function deductFunds(
  uid: string,
  amount: number,
  description: string
): Promise<{ success: boolean; newBalance: number }> {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  const currentBalance = userDoc.data()?.walletBalance ?? 0;

  if (currentBalance < amount) {
    return { success: false, newBalance: currentBalance };
  }

  await setDoc(userRef, {
    walletBalance: increment(-amount),
  }, { merge: true });

  await addDoc(collection(db, 'users', uid, 'transactions'), {
    type: 'debit',
    amount,
    description,
    timestamp: new Date(),
  });

  return { success: true, newBalance: currentBalance - amount };
}

export async function getTransactionHistory(
  uid: string,
  count: number = 20
): Promise<Transaction[]> {
  const q = query(
    collection(db, 'users', uid, 'transactions'),
    orderBy('timestamp', 'desc'),
    limit(count)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate?.() || new Date(),
  })) as Transaction[];
}

// ─── Razorpay ────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiatePayment(
  amount: number,
  userEmail: string,
  userName: string,
  userPhone: string
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    return { success: false, error: 'Failed to load payment gateway' };
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    return { success: false, error: 'Payment gateway not configured' };
  }

  return new Promise((resolve) => {
    const options = {
      key: keyId,
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      name: 'ManMitra',
      description: `Add ₹${amount} to Wallet`,
      image: '',
      handler: (response: any) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
        });
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userPhone,
      },
      theme: {
        color: '#43A089',
      },
      modal: {
        ondismiss: () => {
          resolve({ success: false, error: 'Payment cancelled' });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      resolve({
        success: false,
        error: response.error?.description || 'Payment failed',
      });
    });
    rzp.open();
  });
}
