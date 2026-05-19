import React, { useState, useEffect, useRef } from 'react';
import { Listener, CommMode } from './Listeners';
import { useAuth } from '@/hooks/useAuth';
import { createSession, sendMessage, subscribeToMessages, endSession, ChatMessage } from '@/services/sessionService';
import { Send, Phone, Video, MoreVertical, ShieldCheck, ArrowLeft, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionChatProps {
  listener?: Listener;
  mode: CommMode;
  onEndSession: () => void;
  role?: 'user' | 'listener';
  existingSessionId?: string;
  userName?: string;
}

export function SessionChat({ listener, mode, onEndSession, role = 'user', existingSessionId, userName = 'Anonymous User' }: SessionChatProps) {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize session
  useEffect(() => {
    if (!user) return;
    
    if (existingSessionId) {
      setSessionId(existingSessionId);
      return;
    }

    const init = async () => {
      try {
        if (listener) {
          const id = await createSession(user.uid, listener.id, mode);
          setSessionId(id);
        }
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    };
    init();
  }, [user, listener?.id, mode, existingSessionId]);

  // Subscribe to messages
  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = subscribeToMessages(sessionId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !sessionId) return;

    const text = newMessage;
    setNewMessage(''); // optimistic clear
    
    try {
      await sendMessage(sessionId, user.uid, text);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert if failed
      setNewMessage(text);
    }
  };

  const handleEnd = async () => {
    if (sessionId) {
      await endSession(sessionId);
    }
    onEndSession();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto bg-white rounded-t-2xl shadow-xl overflow-hidden mt-4 border border-slate-200 relative">
      
      {/* Welcome Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-slate-700 w-max max-w-[90%]"
          >
            <ShieldCheck className="w-5 h-5 text-manmitra-teal" />
            <span className="font-medium text-sm">Welcome! This is a 100% judgment-free safe space.</span>
            <button onClick={() => setShowPopup(false)} className="ml-2 hover:bg-slate-700 rounded-full p-1 transition-colors text-slate-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleEnd}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            {role === 'user' && listener ? (
              <>
                <img src={listener.avatar} alt={listener.name} className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
                {listener.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </>
            ) : (
              <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400 font-medium">U</span>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">
              {role === 'user' && listener ? listener.name : userName}
            </h2>
            <p className="text-sm text-manmitra-teal font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure {mode} session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode !== 'chat' && (
            <button className="w-10 h-10 rounded-full bg-slate-50 text-manmitra-teal hover:bg-manmitra-teal hover:text-white flex items-center justify-center transition-colors">
              {mode === 'call' ? <Phone className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}
          <button onClick={handleEnd} className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-full hover:bg-red-100 transition-colors text-sm">
            End Session
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-slate-50 overflow-y-auto p-6 space-y-4 relative">
        
        {/* Security Notice */}
        <div className="flex justify-center mb-8">
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            Messages are end-to-end encrypted. Your safe space is protected.
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 text-manmitra-teal animate-spin" />
          </div>
        ) : (
          messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 text-slate-500 pb-20">
              {role === 'user' && listener ? (
                <>
                  <img src={listener.avatar} className="w-20 h-20 rounded-full mb-4 grayscale object-cover" />
                  <p>Say hi to {listener.name}! They are ready to listen.</p>
                </>
              ) : (
                <p>Waiting for the user to say hi...</p>
              )}
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.senderId === user?.uid;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id || idx} 
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMine ? 'bg-manmitra-teal text-white rounded-tr-sm shadow-md' : 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100'}`}>
                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block ${isMine ? 'text-teal-100' : 'text-slate-400'}`}>
                      {msg.timestamp ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 relative z-10 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
          <button type="button" className="p-3 text-slate-400 hover:bg-slate-100 rounded-full transition-colors mb-1">
            <MoreVertical className="w-5 h-5" />
          </button>
          
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl flex items-center px-4 py-1 focus-within:ring-2 ring-manmitra-teal/20 transition-all">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-transparent border-none focus:ring-0 py-3 text-slate-700 outline-none"
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!newMessage.trim() || !sessionId}
            className="p-4 bg-manmitra-teal text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 mb-1"
          >
            <Send className="w-5 h-5 -ml-1 mt-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
