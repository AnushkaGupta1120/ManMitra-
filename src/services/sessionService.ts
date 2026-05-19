import { db } from '@/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface ChatMessage {
  id?: string;
  senderId: string;
  text: string;
  timestamp: Date | null;
}

export interface SessionData {
  id: string;
  userId: string;
  listenerId: string;
  mode: string;
  startTime: Date;
  status: 'active' | 'completed';
}

/**
 * Creates or retrieves an active session ID for a user and listener
 */
export async function createSession(userId: string, listenerId: string, mode: string): Promise<string> {
  const sessionId = `${userId}_${listenerId}_${Date.now()}`;
  
  await setDoc(doc(db, 'sessions', sessionId), {
    userId,
    listenerId,
    mode,
    status: 'active',
    startTime: serverTimestamp()
  });

  return sessionId;
}

/**
 * Sends a message to a specific session
 */
export async function sendMessage(sessionId: string, senderId: string, text: string) {
  if (!text.trim()) return;
  
  await addDoc(collection(db, 'sessions', sessionId, 'messages'), {
    senderId,
    text,
    timestamp: serverTimestamp()
  });
}

/**
 * Subscribes to messages for a session (Real-time listener)
 */
export function subscribeToMessages(sessionId: string, callback: (messages: ChatMessage[]) => void) {
  const q = query(
    collection(db, 'sessions', sessionId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        text: data.text,
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
      } as ChatMessage;
    });
    callback(messages);
  });
}

/**
 * Ends a session
 */
export async function endSession(sessionId: string) {
  await setDoc(doc(db, 'sessions', sessionId), {
    status: 'completed',
    endTime: serverTimestamp()
  }, { merge: true });
}
