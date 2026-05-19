import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getWalletBalance, MIN_BALANCE } from '@/services/walletService';
import {
  Search,
  Star,
  MessageCircle,
  PhoneCall,
  Video,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Gift,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Listener {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  experience: string;
  categories: string[];
  online: boolean;
  avatar: string;
}

export type CommMode = 'chat' | 'voice' | 'video';

// ─── Pricing (global rate) ───────────────────────────────────────────────────

const PRICING: Record<CommMode, { rate: number; label: string }> = {
  chat: { rate: 4, label: 'Chat' },
  voice: { rate: 10, label: 'Voice Call' },
  video: { rate: 16, label: 'Video Call' },
};

const FREE_MINUTES = 15;

// ─── Category Data ───────────────────────────────────────────────────────────

const CATEGORY_GROUPS = [
  {
    title: 'Communication & Emotional Support',
    items: [
      'Active listening',
      'Empathetic conversation',
      'Motivational talk',
      'Stress counseling',
      'Break-up support',
    ],
  },
  {
    title: 'Career & Academic',
    items: [
      'Career guidance',
      'Study motivation',
      'Exam stress',
    ],
  },
  {
    title: 'Relationships & Family',
    items: [
      'Family issues',
      'Relationship advice',
      'Loneliness support',
    ],
  },
];

// ─── Mock Listeners ──────────────────────────────────────────────────────────

const MOCK_LISTENERS: Listener[] = [
  {
    id: '1', name: 'Ananya S', tagline: "Let's talk with empathy",
    rating: 4.9, experience: '3 yrs+',
    categories: ['Active listening', 'Empathetic conversation', 'Break-up support'],
    online: true, avatar: 'AS',
  },
  {
    id: '2', name: 'Rohan M', tagline: 'Your emotional ally',
    rating: 4.8, experience: '2 yrs+',
    categories: ['Motivational talk', 'Career guidance', 'Stress counseling'],
    online: true, avatar: 'RM',
  },
  {
    id: '3', name: 'Priya K', tagline: 'Towards healing together',
    rating: 5.0, experience: '5 yrs+',
    categories: ['Active listening', 'Family issues', 'Loneliness support'],
    online: true, avatar: 'PK',
  },
  {
    id: '4', name: 'Vikram J', tagline: 'Good vibes coach',
    rating: 4.7, experience: '1 yr+',
    categories: ['Motivational talk', 'Study motivation', 'Exam stress'],
    online: false, avatar: 'VJ',
  },
  {
    id: '5', name: 'Meera D', tagline: 'Shoulder to lean on',
    rating: 4.9, experience: '4 yrs+',
    categories: ['Empathetic conversation', 'Relationship advice', 'Break-up support'],
    online: true, avatar: 'MD',
  },
  {
    id: '6', name: 'Arjun T', tagline: 'Career path navigator',
    rating: 4.6, experience: '2 yrs+',
    categories: ['Career guidance', 'Study motivation', 'Stress counseling'],
    online: true, avatar: 'AT',
  },
  {
    id: '7', name: 'Kavya R', tagline: 'Happy talks ahead',
    rating: 5.0, experience: '3 yrs+',
    categories: ['Active listening', 'Motivational talk', 'Loneliness support'],
    online: false, avatar: 'KR',
  },
  {
    id: '8', name: 'Siddharth N', tagline: 'Calm in the chaos',
    rating: 4.8, experience: '2 yrs+',
    categories: ['Stress counseling', 'Exam stress', 'Active listening'],
    online: true, avatar: 'SN',
  },
  {
    id: '9', name: 'Ishita G', tagline: 'Empathy is my strength',
    rating: 4.7, experience: '1 yr+',
    categories: ['Empathetic conversation', 'Family issues', 'Relationship advice'],
    online: true, avatar: 'IG',
  },
  {
    id: '10', name: 'Aditya P', tagline: 'Listener for life',
    rating: 4.9, experience: '4 yrs+',
    categories: ['Active listening', 'Loneliness support', 'Motivational talk'],
    online: true, avatar: 'AP',
  },
  {
    id: '11', name: 'Neha B', tagline: 'Your study buddy',
    rating: 4.5, experience: '1 yr+',
    categories: ['Study motivation', 'Exam stress', 'Career guidance'],
    online: false, avatar: 'NB',
  },
  {
    id: '12', name: 'Rahul C', tagline: 'Breaking barriers together',
    rating: 4.8, experience: '3 yrs+',
    categories: ['Break-up support', 'Relationship advice', 'Stress counseling'],
    online: true, avatar: 'RC',
  },
];

// ─── Avatar Colors ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'from-manmitra-teal to-emerald-600',
  'from-violet-500 to-purple-600',
  'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-600',
  'from-teal-400 to-cyan-600',
  'from-fuchsia-400 to-pink-500',
  'from-lime-400 to-green-600',
  'from-indigo-400 to-violet-600',
  'from-red-400 to-rose-600',
  'from-emerald-400 to-teal-600',
  'from-blue-400 to-indigo-600',
];

// ─── Star Rating Component ──────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : i < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-600">{rating}/5</span>
    </div>
  );
}

// ─── Listener Card Component ─────────────────────────────────────────────────

function ListenerCard({
  listener,
  mode,
  colorIndex,
  onConnect,
}: {
  listener: Listener;
  mode: CommMode;
  colorIndex: number;
  onConnect: (listener: Listener, mode: CommMode) => void;
}) {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  const { rate, label } = PRICING[mode];
  const modeIcon = mode === 'chat'
    ? <MessageCircle className="w-3.5 h-3.5" />
    : mode === 'voice'
    ? <PhoneCall className="w-3.5 h-3.5" />
    : <Video className="w-3.5 h-3.5" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg
        transition-all duration-300 p-5 group relative
      `}
    >
      {/* Free trial badge */}
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-manmitra-yellow/15 text-amber-700">
          <Gift className="w-3 h-3" />
          {FREE_MINUTES} min free
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
            {listener.avatar}
          </div>
          {/* Online dot */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full border-2 border-white ${listener.online ? 'bg-emerald-400' : 'bg-slate-300'}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-slate-800 text-base truncate">{listener.name}</h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              listener.online
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {listener.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate mb-1.5">{listener.tagline}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={listener.rating} />
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-medium">{listener.experience}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {listener.categories.slice(0, 3).map((cat) => (
          <span
            key={cat}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-manmitra-teal/8 text-manmitra-teal border border-manmitra-teal/10"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Pricing info */}
      <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>After {FREE_MINUTES} free mins: <span className="font-semibold text-slate-600">₹{rate}/min</span></span>
      </div>

      {/* Connect Button */}
      <button
        onClick={() => onConnect(listener, mode)}
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-200 cursor-pointer
          bg-manmitra-teal text-white shadow-sm hover:bg-manmitra-teal/90 hover:shadow-md active:scale-[0.98]
        `}
      >
        {modeIcon}
        <span>Start {label}</span>
      </button>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export interface ListenersProps {
  onNavClick: (page: string) => void;
  onStartSession?: (listener: Listener, mode: CommMode) => void;
}

export function Listeners({ onNavClick, onStartSession }: ListenersProps) {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<CommMode>('chat');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(CATEGORY_GROUPS.map((g) => g.title))
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const { user, userProfile } = useAuth();

  const handleConnect = async (listener: Listener, selectedMode: CommMode) => {
    if (!user) {
      onNavClick('login');
      return;
    }

    setConnecting(true);
    try {
      const balance = await getWalletBalance(user.uid);
      if (balance < MIN_BALANCE) {
        alert(`Insufficient balance. Minimum ₹${MIN_BALANCE} required in wallet.`);
        onNavClick('wallet');
      } else {
        if (onStartSession) {
          onStartSession(listener, selectedMode);
        } else {
          alert(`Connecting with ${listener.name} via ${selectedMode}...\nWallet balance is ₹${balance}. Session started!`);
        }
      }
    } catch (error: any) {
      console.error('Failed to check wallet balance:', error);
      alert('Something went wrong. Please try again.\nError: ' + (error.message || String(error)));
    } finally {
      setConnecting(false);
    }
  };

  // Toggle category
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Toggle group expand
  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories(new Set());
    setShowOnlineOnly(false);
    setSearch('');
  };

  // Filtered listeners
  const filtered = useMemo(() => {
    return MOCK_LISTENERS.filter((l) => {
      if (showOnlineOnly && !l.online) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.name.toLowerCase().includes(q) &&
          !l.tagline.toLowerCase().includes(q) &&
          !l.categories.some((c) => c.toLowerCase().includes(q))
        )
          return false;
      }
      if (selectedCategories.size > 0) {
        if (!l.categories.some((c) => selectedCategories.has(c))) return false;
      }
      return true;
    });
  }, [search, showOnlineOnly, selectedCategories]);

  const hasActiveFilters = showOnlineOnly || selectedCategories.size > 0 || search;

  // ─── Filter Sidebar Content ────────────────────────────────────────

  const filterContent = (
    <div className="space-y-6">
      {/* Availability */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">Availability</h3>
        <div className="flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setShowOnlineOnly(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              !showOnlineOnly ? 'bg-white text-manmitra-teal shadow-sm' : 'text-slate-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setShowOnlineOnly(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              showOnlineOnly ? 'bg-white text-manmitra-teal shadow-sm' : 'text-slate-500'
            }`}
          >
            Online
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">Categories</h3>
          {selectedCategories.size > 0 && (
            <button
              onClick={() => setSelectedCategories(new Set())}
              className="text-xs text-manmitra-teal font-semibold hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-3">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full text-left cursor-pointer group"
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {group.title}
                </span>
                {expandedGroups.has(group.title) ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedGroups.has(group.title) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 space-y-1">
                      {group.items.map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2.5 py-1.5 px-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.has(item)}
                            onChange={() => toggleCategory(item)}
                            className="w-4 h-4 rounded border-slate-300 text-manmitra-teal focus:ring-manmitra-teal/30 accent-manmitra-teal cursor-pointer"
                          />
                          <span className="text-sm text-slate-600">{item}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-manmitra-teal-light/20 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Browse Listeners
          </h1>
          <p className="text-slate-500 text-lg">
            Find a compassionate listener who understands your needs
          </p>
        </motion.div>

        {/* Top Bar: Tabs + Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          {/* Communication Mode Tabs */}
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {([
              { key: 'chat' as CommMode, icon: MessageCircle, label: 'Chat' },
              { key: 'voice' as CommMode, icon: PhoneCall, label: 'Voice Call' },
              { key: 'video' as CommMode, icon: Video, label: 'Video Call' },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer
                  ${mode === key
                    ? 'bg-manmitra-teal text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Search + Mobile Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search listeners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-manmitra-teal focus:ring-2 focus:ring-manmitra-teal/20 transition-all"
              />
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-slate-300 transition-all cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-manmitra-teal" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Main Content: Sidebar + Grid */}
        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="hidden lg:block w-64 shrink-0"
          >
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-manmitra-teal font-semibold hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </motion.aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                  onClick={() => setMobileFilterOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl p-6 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg text-slate-800">Filters</h2>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  {filterContent}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="w-full py-3 bg-manmitra-teal text-white font-semibold rounded-xl hover:bg-manmitra-teal/90 transition-colors cursor-pointer"
                    >
                      Show {filtered.length} Listener{filtered.length !== 1 ? 's' : ''}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Listener Grid */}
          <div className="flex-1">
            {/* Results count */}
            <p className="text-sm text-slate-400 mb-4">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> listener{filtered.length !== 1 ? 's' : ''}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-manmitra-teal font-semibold hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </p>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">No listeners found</h3>
                <p className="text-slate-400 mb-4">Try adjusting your filters or search term</p>
                <button
                  onClick={clearFilters}
                  className="text-manmitra-teal font-semibold hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((listener, i) => (
                    <ListenerCard
                      key={listener.id}
                      listener={listener}
                      mode={mode}
                      colorIndex={i}
                      onConnect={handleConnect}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
