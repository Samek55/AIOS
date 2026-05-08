import { useState, useRef, useEffect } from 'react';
import {
  Send, Mic, Bot, User, Plus, Search, MoreVertical,
  ShoppingBag, Heart, Wallet, Calendar, MapPin, Star,
  Sparkles, Zap, ChevronRight, X, Clock
} from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  cards?: CardData[];
}

interface CardData {
  type: 'food' | 'health' | 'task' | 'finance';
  items: { title: string; sub: string; emoji: string; action?: string }[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'assistant',
    text: "Hey Alex! 👋 I'm **AIOS**, your AI life companion. I know your schedule, health stats, spending habits, and nearby shops. What can I help you with today?",
    time: '9:00 AM',
  },
];

const quickChips = [
  { label: "I'm hungry 🍔", query: "i'm hungry" },
  { label: "Plan my day 📅", query: "plan my day" },
  { label: "Health check 💪", query: "health check" },
  { label: "Finance report 💸", query: "finance report" },
  { label: "What's nearby? 📍", query: "what's nearby" },
  { label: "I need a workout 🏃", query: "suggest a workout" },
];

const pastChats = [
  { title: "Order dinner + movie plan", time: "Yesterday" },
  { title: "Weekly health summary", time: "2 days ago" },
  { title: "Budget analysis April", time: "3 days ago" },
  { title: "Morning routine setup", time: "1 week ago" },
];

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function generateResponse(query: string): Omit<Message, 'id'> {
  const q = query.toLowerCase();

  if (q.includes('hungry') || q.includes('food') || q.includes('eat') || q.includes('order')) {
    return {
      role: 'assistant',
      text: "Based on your mood (😊 Happy) and the fact you last ate 4 hours ago, here are top picks nearby! You usually love Japanese or Italian. I've also noticed it's 28°C — maybe something refreshing?",
      time: getTime(),
      cards: [{
        type: 'food',
        items: [
          { emoji: '🥗', title: 'Garden Fresh Bowl', sub: 'Green Kitchen · 18 min · $12.99', action: 'Order' },
          { emoji: '🍕', title: 'Margherita Pizza', sub: 'Pizza Palace · 25 min · $14.50', action: 'Order' },
          { emoji: '🍣', title: 'Salmon Sushi Set', sub: 'Tokyo Bites · 30 min · $18.00', action: 'Order' },
        ]
      }]
    };
  }

  if (q.includes('plan') || q.includes('schedule') || q.includes('day') || q.includes('routine')) {
    return {
      role: 'assistant',
      text: "Here's your optimized day plan, Alex! I've scheduled your tasks based on your energy levels and priorities. You have a free slot at 5 PM — I suggest your evening jog! 🏃",
      time: getTime(),
      cards: [{
        type: 'task',
        items: [
          { emoji: '💪', title: '8:00 AM — Morning Workout', sub: '30 min · Completed ✅', action: 'Done' },
          { emoji: '💼', title: '9:30 AM — Team Standup', sub: '20 min · Completed ✅', action: 'Done' },
          { emoji: '🎯', title: '3:00 PM — Deep Work', sub: '2 hours · In Progress', action: 'Start' },
          { emoji: '🏃', title: '6:00 PM — Evening Jog', sub: '45 min · Upcoming', action: 'View' },
        ]
      }]
    };
  }

  if (q.includes('health') || q.includes('fitness') || q.includes('workout') || q.includes('steps') || q.includes('weight')) {
    return {
      role: 'assistant',
      text: "Your health score today is **78/100** — Great! 🎉 You've been more consistent this week. Here's a quick snapshot:",
      time: getTime(),
      cards: [{
        type: 'health',
        items: [
          { emoji: '👟', title: '7,842 Steps', sub: '78% of daily goal · Keep going!', action: 'View' },
          { emoji: '🔥', title: '1,450 kcal burned', sub: 'Moderate activity · On track', action: 'View' },
          { emoji: '💧', title: '5 / 8 glasses', sub: 'Need 3 more glasses of water', action: 'Log' },
          { emoji: '😴', title: '7h 20min sleep', sub: 'Good quality · Deep sleep 85%', action: 'View' },
        ]
      }]
    };
  }

  if (q.includes('finance') || q.includes('money') || q.includes('spend') || q.includes('budget') || q.includes('expense')) {
    return {
      role: 'assistant',
      text: "Here's your financial snapshot for April. ⚠️ You've spent 23% more on food this month. Want me to suggest some budget-friendly meal options?",
      time: getTime(),
      cards: [{
        type: 'finance',
        items: [
          { emoji: '💰', title: '$3,240 Remaining', sub: 'Of $5,000 monthly budget · 65%', action: 'View' },
          { emoji: '🍔', title: 'Food: $480', sub: '↑ 23% vs last month · Over budget', action: 'Analyze' },
          { emoji: '🛍️', title: 'Shopping: $320', sub: '↓ 10% vs last month · On track', action: 'View' },
          { emoji: '🏋️', title: 'Fitness: $89', sub: 'Gym + supplements · Normal', action: 'View' },
        ]
      }]
    };
  }

  if (q.includes('nearby') || q.includes('around') || q.includes('location') || q.includes('close')) {
    return {
      role: 'assistant',
      text: "I found some great spots near you in New York, NY! Based on your preferences and ratings, here are the highlights:",
      time: getTime(),
      cards: [{
        type: 'food',
        items: [
          { emoji: '🍔', title: 'Burger Republic', sub: '0.3 km · Open · ⭐ 4.8', action: 'Order' },
          { emoji: '☕', title: 'Morning Brew Café', sub: '0.5 km · Open · ⭐ 4.7', action: 'Visit' },
          { emoji: '🛒', title: 'Fresh Market', sub: '0.8 km · Open · 🔥 Flash Sale', action: 'Shop' },
        ]
      }]
    };
  }

  if (q.includes('workout') || q.includes('exercise') || q.includes('gym') || q.includes('train')) {
    return {
      role: 'assistant',
      text: "Based on your fitness history and today's activity, I recommend a **moderate workout** — you did well yesterday! Here's a customized plan:",
      time: getTime(),
      cards: [{
        type: 'health',
        items: [
          { emoji: '🏃', title: '20 min Cardio Run', sub: 'Moderate pace · Burns ~250 kcal', action: 'Start' },
          { emoji: '💪', title: 'Upper Body Strength', sub: '4 sets · 30 min · Intermediate', action: 'Start' },
          { emoji: '🧘', title: '10 min Meditation', sub: 'Post-workout recovery · Relax', action: 'Start' },
        ]
      }]
    };
  }

  return {
    role: 'assistant',
    text: `Got it! I'm processing your request: "${query}". 🤔 As your AI life companion, I can help you order food, plan your day, track health metrics, manage finances, and much more. What specific help do you need?`,
    time: getTime(),
  };
}

const cardColors: Record<string, string> = {
  food: '#F9731620',
  health: '#14B8A620',
  task: '#2563EB20',
  finance: '#0F766E20',
};

const cardAccents: Record<string, string> = {
  food: '#F97316',
  health: '#0F766E',
  task: '#2563EB',
  finance: '#0F766E',
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(text);
      setMessages(prev => [...prev, { ...response, id: Date.now() + 1 }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-full bg-[#EEF3F8]" style={{height: 'calc(100vh - 61px)'}}>
      {/* Sidebar - chat history */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto
        w-64 bg-white border-r border-[#14B8A6]/30 flex flex-col shrink-0
        transition-transform duration-300
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-[#14B8A6]/20 flex items-center justify-between">
          <h2 style={{fontSize:'15px', fontWeight:700}} className="text-[#17202E]">Conversations</h2>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-[#E0F7F3] rounded-lg transition-colors">
              <Search size={15} className="text-[#888]" />
            </button>
            <button
              onClick={() => { setMessages(INITIAL_MESSAGES); }}
              className="p-1.5 hover:bg-[#E0F7F3] rounded-lg transition-colors"
              title="New chat"
            >
              <Plus size={15} className="text-[#888]" />
            </button>
            <button onClick={() => setShowSidebar(false)} className="lg:hidden p-1.5 hover:bg-[#E0F7F3] rounded-lg">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Current chat */}
        <div className="p-3">
          <button className="w-full flex items-center gap-3 p-3 bg-[#E0F7F3] rounded-xl border border-[#14B8A6]/30">
            <div className="w-7 h-7 rounded-lg bg-[#14B8A6] flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-[#17202E]" />
            </div>
            <div className="text-left min-w-0">
              <p style={{fontSize:'12px', fontWeight:600}} className="text-[#17202E] truncate">New Conversation</p>
              <p style={{fontSize:'10px'}} className="text-[#888]">Just now</p>
            </div>
          </button>
        </div>

        {/* Past chats */}
        <div className="px-3 pb-3 flex-1 overflow-y-auto">
          <p style={{fontSize:'11px'}} className="text-[#aaa] uppercase tracking-wide px-1 mb-2">Recent</p>
          <div className="space-y-1">
            {pastChats.map((chat, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-2.5 hover:bg-[#EEF3F8] rounded-xl transition-colors text-left group">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Bot size={13} className="text-[#888]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{fontSize:'12px'}} className="text-[#444] truncate group-hover:text-[#222]">{chat.title}</p>
                  <p style={{fontSize:'10px'}} className="text-[#bbb]">{chat.time}</p>
                </div>
                <MoreVertical size={13} className="text-[#ccc] opacity-0 group-hover:opacity-100 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* AIOS branding at bottom */}
        <div className="p-4 border-t border-[#14B8A6]/20">
          <div className="p-3 rounded-xl bg-[#17202E] text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap size={14} className="text-[#14B8A6]" />
              <span style={{fontSize:'12px', fontWeight:700}} className="text-white">AIOS Pro</span>
            </div>
            <p style={{fontSize:'10px'}} className="text-white/50">Unlimited AI assistance</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setShowSidebar(false)} />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="bg-white border-b border-[#14B8A6]/30 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowSidebar(true)} className="lg:hidden p-1.5 hover:bg-[#E0F7F3] rounded-lg">
            <Bot size={18} className="text-[#666]" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-[#17202E] flex items-center justify-center">
            <Sparkles size={17} className="text-[#14B8A6]" />
          </div>
          <div>
            <h2 style={{fontSize:'15px', fontWeight:700}} className="text-[#17202E]">AIOS Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p style={{fontSize:'11px'}} className="text-[#888]">Online · Knows your full profile</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#E0F7F3] rounded-lg">
              <Star size={12} className="text-[#0F766E] fill-[#0F766E]" />
              <span style={{fontSize:'11px', fontWeight:600}} className="text-[#0F766E]">GPT-4 Powered</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Context bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: MapPin, label: 'New York, NY' },
              { icon: Heart, label: 'Health: 78/100' },
              { icon: Wallet, label: '$3,240 Budget' },
              { icon: Clock, label: '5 tasks today' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#14B8A6]/20">
                <item.icon size={11} className="text-[#0F766E]" />
                <span style={{fontSize:'11px'}} className="text-[#666]">{item.label}</span>
              </div>
            ))}
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-[#17202E]' : 'bg-[#14B8A6]'
              }`}>
                {msg.role === 'assistant'
                  ? <Sparkles size={15} className="text-[#14B8A6]" />
                  : <User size={15} className="text-[#17202E]" />
                }
              </div>

              {/* Message bubble */}
              <div className={`max-w-[80%] space-y-2`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[#17202E] text-white rounded-tr-sm'
                    : 'bg-white border border-[#14B8A6]/20 text-[#333] rounded-tl-sm'
                }`}>
                  <p style={{fontSize:'14px', lineHeight:'1.6'}}>
                    {msg.text.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                  <p style={{fontSize:'10px'}} className={`mt-1 ${msg.role === 'user' ? 'text-white/40' : 'text-[#bbb]'}`}>
                    {msg.time}
                  </p>
                </div>

                {/* Suggestion cards */}
                {msg.cards?.map((card, ci) => (
                  <div key={ci} className="grid grid-cols-1 gap-2 mt-2">
                    {card.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer"
                        style={{
                          backgroundColor: cardColors[card.type],
                          borderColor: cardAccents[card.type] + '30',
                        }}
                      >
                        <span className="text-xl shrink-0">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p style={{fontSize:'13px', fontWeight:600}} className="text-[#17202E] truncate">{item.title}</p>
                          <p style={{fontSize:'11px'}} className="text-[#666] truncate">{item.sub}</p>
                        </div>
                        {item.action && (
                          <button
                            className="px-3 py-1.5 rounded-lg text-white shrink-0"
                            style={{fontSize:'11px', fontWeight:600, backgroundColor: cardAccents[card.type]}}
                          >
                            {item.action}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#17202E] flex items-center justify-center shrink-0">
                <Sparkles size={15} className="text-[#14B8A6]" />
              </div>
              <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-[#14B8A6]/20 flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#14B8A6] animate-bounce"
                    style={{animationDelay: `${i * 0.15}s`}}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick chips */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-[#14B8A6]/20 bg-white">
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => sendMessage(chip.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF3F8] border border-[#14B8A6]/30 rounded-full hover:bg-[#E0F7F3] hover:border-[#14B8A6] transition-all whitespace-nowrap"
              style={{fontSize:'12px', fontWeight:500}}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-[#14B8A6]/20 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <button
              type="button"
              className="p-2.5 rounded-xl bg-[#EEF3F8] border border-[#14B8A6]/30 text-[#888] hover:bg-[#E0F7F3] transition-colors shrink-0"
            >
              <Mic size={18} />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask AIOS anything... order food, plan your day, check health"
                className="w-full px-4 py-2.5 bg-[#EEF3F8] border border-[#14B8A6]/30 rounded-xl text-[#222] placeholder:text-[#bbb] outline-none focus:border-[#14B8A6] transition-colors"
                style={{fontSize:'14px'}}
                disabled={isTyping}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-[#17202E] text-[#14B8A6] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
          <p style={{fontSize:'10px'}} className="text-center text-[#ccc] mt-2">
            AIOS uses your personal data (location, health, finances) to give smart suggestions
          </p>
        </div>
      </div>
    </div>
  );
}
