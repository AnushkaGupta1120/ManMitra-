import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { CommMode } from './Listeners';
import { Clock, MessageCircle, Phone, Video, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ActiveSession {
  id: string;
  userId: string;
  listenerId: string;
  mode: CommMode;
  startTime: Date;
  status: string;
}

interface ListenerDashboardProps {
  onJoinSession: (sessionId: string, mode: CommMode) => void;
}

export function ListenerDashboard({ onJoinSession }: ListenerDashboardProps) {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK: If the user is the admin, they act as Listener "1" (Ananya S)
  const isMockListener = user?.email === 'shashikant132@gmail.com';
  const listenerId = isMockListener ? '1' : user?.uid;

  useEffect(() => {
    if (!listenerId) return;

    const q = query(
      collection(db, 'sessions'),
      where('listenerId', '==', listenerId),
      where('status', '==', 'active'),
      // orderBy('startTime', 'desc') // Might require an index, omit for now
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          listenerId: data.listenerId,
          mode: data.mode as CommMode,
          startTime: data.startTime?.toDate() || new Date(),
          status: data.status,
        };
      });
      
      // Sort in memory to avoid needing a composite index
      sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
      
      setActiveSessions(sessions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listenerId]);

  if (!isMockListener) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center px-6">
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-600 mt-2">You are not registered as a listener.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Listener Dashboard</h1>
          <p className="text-slate-600 mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
            You are online and ready to accept sessions.
          </p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">Today's Earnings</p>
          <p className="text-2xl font-bold text-manmitra-teal">₹850</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Incoming Requests</h2>
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
            {activeSessions.length} Active
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading requests...</div>
        ) : activeSessions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No active requests</h3>
            <p className="text-slate-500 mt-1 max-w-md">When a user requests a session with you, it will appear here immediately.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeSessions.map((session) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={session.id} 
                className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    session.mode === 'video' ? 'bg-indigo-100 text-indigo-600' :
                    session.mode === 'call' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {session.mode === 'video' ? <Video className="w-6 h-6" /> :
                     session.mode === 'call' ? <Phone className="w-6 h-6" /> :
                     <MessageCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Anonymous User</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-manmitra-teal" /> 
                      Requested a {session.mode} session
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs font-semibold text-slate-400">
                    {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button 
                    onClick={() => onJoinSession(session.id, session.mode)}
                    className="bg-manmitra-teal text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    Join Session <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
