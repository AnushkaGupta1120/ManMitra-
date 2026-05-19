import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── System Prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are ManMitra's friendly AI assistant on their website. ManMitra is India's leading active listening and emotional support platform. Your role is to answer visitor questions warmly and helpfully.

KEY INFORMATION ABOUT MANMITRA:
- ManMitra provides non-judgmental emotional support online
- Services: Chat, Voice Call, and Video Call with trained listeners
- Pricing: First 15 minutes FREE, then ₹4/min for Chat, ₹10/min for Voice Call, ₹16/min for Video Call
- Listeners are trained in: Active listening, Empathetic conversation, Motivational talk, Stress counseling, Break-up support, Career guidance, Study motivation, Exam stress, Family issues, Relationship advice, Loneliness support
- Users can browse and connect with available listeners on the Listeners page
- Sign up requires only: Name, Email, and Phone number (OTP verified)
- Google sign-in is also available
- All conversations are 100% confidential and private
- ManMitra is NOT a replacement for professional therapy or medical advice

TONE & STYLE:
- Be warm, empathetic, and supportive
- Keep responses concise (2-4 sentences max unless asked for details)
- If someone seems to be in crisis, gently suggest professional help and provide AASRA helpline: 9820466726
- Use simple, clear language
- Don't use markdown formatting — just plain text with line breaks
- If you don't know something specific, say so honestly and suggest contacting ManMitra directly`;

// ─── Gemini Client ───────────────────────────────────────────────────────────

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  // Vite replaces `process.env.GEMINI_API_KEY` at build time via define config
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  genAIClient = new GoogleGenAI({ apiKey });
  return genAIClient;
}

// ─── Chat Widget Component ──────────────────────────────────────────────────

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Greeting on first open
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content:
            "Hi there! 👋 I'm ManMitra's assistant. I can help you with questions about our services, pricing, how to connect with a listener, or anything else. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const genAI = getGenAI();
      let reply: string;

      if (!genAI) {
        console.warn('[Chatbot] No Gemini API key found, using fallback. Key value:', process.env.GEMINI_API_KEY ? '(set)' : '(empty)');
        // Fallback if no API key
        reply = getFallbackResponse(text);
      } else {
        // Build conversation history for context
        const history = messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
        const prompt = `${SYSTEM_PROMPT}\n\nConversation so far:\n${history}\nUser: ${text}\nAssistant:`;

        console.log('[Chatbot] Calling Gemini API...');
        const response = await genAI.models.generateContent({
          model: 'gemini-2.0-flash-lite',
          contents: prompt,
        });

        reply = response.text?.trim() || "I'm sorry, I couldn't process that. Could you try rephrasing?";
        console.log('[Chatbot] Got response:', reply.substring(0, 50));
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error('[Chatbot] Error:', error?.message || error);
      console.error('[Chatbot] Full error:', error);

      // If API fails, try fallback response instead of showing error
      const fallback = getFallbackResponse(text);
      const fallbackMsg: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: fallback,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Quick Reply Suggestions ─────────────────────────────────────

  const suggestions = [
    'What services do you offer?',
    'How does pricing work?',
    'How do I connect with a listener?',
  ];

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => sendMessage(), 50);
  };

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[999] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-manmitra-teal to-emerald-600 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">ManMitra Assistant</h3>
                  <p className="text-white/70 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-manmitra-teal/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-manmitra-teal" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-manmitra-teal text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-700 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-manmitra-teal/10 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-manmitra-teal" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions — only when no user messages yet */}
              {messages.length === 1 && messages[0].role === 'assistant' && !loading && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-manmitra-teal/20 text-manmitra-teal bg-manmitra-teal/5 hover:bg-manmitra-teal/10 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 p-3 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1 h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-manmitra-teal focus:ring-1 focus:ring-manmitra-teal/20 transition-all disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-manmitra-teal text-white flex items-center justify-center hover:bg-manmitra-teal/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-[999]
          flex items-center justify-center cursor-pointer transition-colors
          ${isOpen
            ? 'bg-slate-700 hover:bg-slate-800'
            : 'bg-manmitra-teal hover:bg-manmitra-teal/90 shadow-manmitra-teal/30'
          }
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

// ─── Fallback Responses (when no API key) ────────────────────────────────────

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  // 1. Crisis detection (ABSOLUTE HIGHEST PRIORITY)
  if (q.includes('suicid') || q.includes('kill myself') || q.includes('end my life') || q.includes('don\'t want to live') || q.includes('self harm')) {
    return "I'm really glad you reached out. Please know you matter. 💛 If you're in crisis, please call AASRA helpline: 9820466726 (available 24/7). You can also connect with a ManMitra listener right away — we're here for you.";
  }

  // 2. EMOTIONAL queries
  const emotionalWords = ['overwhelm', 'depress', 'anxious', 'anxiety', 'sad', 'lonely', 'alone', 'stress', 'scared', 'afraid', 'hurt', 'pain', 'cry', 'upset', 'angry', 'frustrated', 'hopeless', 'worthless', 'tired', 'exhausted', 'broken', 'lost', 'confused', 'feeling', 'struggle', 'suffer'];
  if (emotionalWords.some((w) => q.includes(w))) {
    return "I hear you, and I want you to know it's okay to feel this way. 💛 You're not alone. ManMitra's trained listeners are here to provide a safe, non-judgmental space for you. Head to our Listeners page to connect with someone who cares — your first 15 minutes are free.";
  }

  // 3. Greetings
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
    return 'Hello! 😊 Welcome to ManMitra. How can I help you today? Feel free to ask about our services, pricing, or how to connect with a listener.';
  }

  // 4. Pricing
  if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('charge') || q.includes('fee') || q.includes('free')) {
    return 'Our pricing is simple! The first 15 minutes are completely FREE. After that, it\'s ₹4/min for Chat, ₹10/min for Voice Call, and ₹16/min for Video Call.';
  }

  // 5. Services
  if (q.includes('service') || q.includes('offer') || q.includes('what do you') || q.includes('what is manmitra')) {
    return 'ManMitra offers emotional support through Chat, Voice Call, and Video Call with trained, empathetic listeners. Our listeners are trained in active listening, stress counseling, relationship advice, career guidance, and more.';
  }

  // 6. Sign up
  if (q.includes('sign up') || q.includes('register') || q.includes('account') || q.includes('join')) {
    return 'Signing up is quick! You just need your Name, Email, and Phone Number. We verify your phone with a one-time OTP. You can also sign up with Google.';
  }

  // 7. Listeners
  if (q.includes('listener') || q.includes('connect') || q.includes('talk') || q.includes('someone to')) {
    return 'You can browse our available listeners on the Listeners page. Each listener has a profile with their expertise, rating, and experience. Click "Start Chat" to connect!';
  }

  // 8. Privacy
  if (q.includes('confidential') || q.includes('private') || q.includes('safe') || q.includes('secure')) {
    return 'Absolutely! All conversations on ManMitra are 100% confidential and private. Your data is protected and we never share your personal information.';
  }

  // 9. Thank you
  if (q.includes('thank') || q.includes('thanks')) {
    return "You're welcome! 😊 Remember, ManMitra is always here for you whenever you need someone to listen. Take care!";
  }

  return "I appreciate your message! I'd love to help you better — you can ask me about our services, pricing, how to connect with a listener, or anything about ManMitra. You can also connect directly with a listener on the Listeners page. 💛";
}
