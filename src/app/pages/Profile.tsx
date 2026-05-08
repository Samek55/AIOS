import { useState } from 'react';
import {
  Edit3, Settings, Bell, Shield, Moon, Smartphone,
  Star, Award, Zap, Trophy, Target, Heart, Wallet,
  ChevronRight, Camera, LogOut, Crown, Flame, TrendingUp,
  CheckCircle, Globe, HelpCircle
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const PROFILE_IMG = 'https://images.unsplash.com/photo-1723189038268-3ef8fd518ad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const RUNNING_IMG = 'https://images.unsplash.com/photo-1773681823208-7f3657c0688f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200';

const badges = [
  { name: 'Early Bird', emoji: '🌅', desc: '7 AM workouts for 10 days', earned: true },
  { name: 'Step Master', emoji: '👟', desc: 'Hit 10K steps 20 times', earned: true },
  { name: 'Zen Mode', emoji: '🧘', desc: '15-day meditation streak', earned: true },
  { name: 'Clean Eater', emoji: '🥗', desc: 'Healthy meals 30 days', earned: true },
  { name: 'Finance Guru', emoji: '💰', desc: 'Stay under budget 3 months', earned: false },
  { name: 'Social Star', emoji: '⭐', desc: 'Get 100 post likes', earned: false },
  { name: 'Iron Warrior', emoji: '🏋️', desc: 'Complete 50 workouts', earned: false },
  { name: 'Hydration Pro', emoji: '💧', desc: '30 days of 8 glasses', earned: false },
];

const weeklyStats = [
  { label: 'Steps', value: '63,882', icon: '👟', change: '+12%' },
  { label: 'Workouts', value: '5', icon: '💪', change: '+1' },
  { label: 'Sleep Avg', value: '7.4h', icon: '😴', change: '+0.3h' },
  { label: 'Spent', value: '$185', icon: '💸', change: '-15%' },
];

const settingsGroups = [
  {
    title: 'App Preferences',
    items: [
      { icon: Bell, label: 'Smart Notifications', sub: 'AI-powered alerts', toggle: true, value: true },
      { icon: Moon, label: 'Dark Mode', sub: 'System preference', toggle: true, value: false },
      { icon: Globe, label: 'Language', sub: 'English (US)', toggle: false },
      { icon: Smartphone, label: 'Mobile App', sub: 'Download for iOS & Android', toggle: false },
    ]
  },
  {
    title: 'Account & Privacy',
    items: [
      { icon: Shield, label: 'Privacy Settings', sub: 'Control your data', toggle: false },
      { icon: Settings, label: 'Integrations', sub: 'Connect apps & devices', toggle: false },
      { icon: HelpCircle, label: 'Help & Support', sub: '24/7 AIOS support', toggle: false },
      { icon: LogOut, label: 'Sign Out', sub: '', toggle: false, danger: true },
    ]
  }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');
  const [editMode, setEditMode] = useState(false);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({ 'Smart Notifications': true, 'Dark Mode': false });

  const xpForNext = 2500;
  const currentXP = 1840;
  const xpPct = (currentXP / xpForNext) * 100;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-5">

      {/* Profile Header Card */}
      <div className="bg-[#17202E] rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="relative h-28 overflow-hidden">
          <ImageWithFallback src={RUNNING_IMG} alt="Cover" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, #17202E)' }} />
          <button className="absolute top-3 right-3 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <Camera size={14} className="text-white" />
          </button>
        </div>

        {/* Profile info */}
        <div className="px-5 pb-5 -mt-8 relative z-10">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <ImageWithFallback src={PROFILE_IMG} alt="Alex" className="w-20 h-20 rounded-2xl object-cover border-4 border-[#17202E]" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#14B8A6] rounded-lg flex items-center justify-center">
                <Camera size={12} className="text-[#17202E]" />
              </button>
            </div>
            <div className="flex gap-2 mb-1">
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                style={{ fontSize: '12px', fontWeight: 600 }}
              >
                <Edit3 size={13} /> Edit
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 style={{ fontSize: '22px', fontWeight: 700 }} className="text-white">Alex Johnson</h2>
                <div className="px-2 py-0.5 bg-[#14B8A6]/20 rounded-lg border border-[#14B8A6]/30">
                  <span style={{ fontSize: '10px', fontWeight: 700 }} className="text-[#14B8A6]">PRO</span>
                </div>
              </div>
              <p style={{ fontSize: '13px' }} className="text-white/50 mt-0.5">@alexj · New York, NY</p>
              <p style={{ fontSize: '13px' }} className="text-white/70 mt-2">Health enthusiast 💪 · Building better habits daily · AIOS power user 🤖</p>
            </div>
          </div>

          {/* Level + XP */}
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-[#F4C430]" />
                <span style={{ fontSize: '12px', fontWeight: 700 }} className="text-white">Level 7 · Wellness Champion</span>
              </div>
              <span style={{ fontSize: '11px' }} className="text-white/40">{currentXP}/{xpForNext} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0F766E] rounded-full" style={{ width: `${xpPct}%` }} />
            </div>
            <p style={{ fontSize: '10px' }} className="text-white/30 mt-1">{xpForNext - currentXP} XP to Level 8</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Followers', value: '126' },
              { label: 'Following', value: '48' },
              { label: 'Streak', value: '5 🔥' },
              { label: 'Points', value: '4,280' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p style={{ fontSize: '17px', fontWeight: 700 }} className="text-white">{s.value}</p>
                <p style={{ fontSize: '10px' }} className="text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['overview', 'achievements', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl capitalize transition-all border ${
              activeTab === tab
                ? 'bg-[#17202E] text-white border-[#17202E]'
                : 'bg-white text-[#666] border-[#14B8A6]/30 hover:border-[#14B8A6]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400 }}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'achievements' ? '🏆 Achievements' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Weekly Summary */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">This Week's Summary</h3>
              <span style={{ fontSize: '12px' }} className="text-[#888]">Apr 1–7</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {weeklyStats.map(s => (
                <div key={s.label} className="bg-[#EEF3F8] rounded-xl p-3 text-center">
                  <span className="text-xl">{s.icon}</span>
                  <p style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#17202E] mt-1">{s.value}</p>
                  <p style={{ fontSize: '10px' }} className="text-[#888]">{s.label}</p>
                  <p style={{ fontSize: '10px', fontWeight: 600 }} className={`mt-0.5 ${s.change.startsWith('+') ? 'text-green-500' : 'text-red-400'}`}>
                    {s.change} vs last week
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Life Score */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-4">🧠 AIOS Life Score</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg width={112} height={112} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={56} cy={56} r={46} fill="none" stroke="#f0f0f0" strokeWidth={10} />
                  <circle cx={56} cy={56} r={46} fill="none" stroke="#14B8A6" strokeWidth={10}
                    strokeDasharray={`${2 * Math.PI * 46}`}
                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - 0.78)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p style={{ fontSize: '28px', fontWeight: 700 }} className="text-[#17202E]">78</p>
                  <p style={{ fontSize: '10px' }} className="text-[#888]">/ 100</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[
                  { label: 'Health', score: 82, color: '#14B8A6' },
                  { label: 'Productivity', score: 75, color: '#2563EB' },
                  { label: 'Finance', score: 68, color: '#F97316' },
                  { label: 'Social', score: 88, color: '#C77DFF' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span style={{ fontSize: '12px' }} className="text-[#888] w-24 shrink-0">{s.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#333] w-7 text-right">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Highlights */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-3">Recent Highlights</h3>
            <div className="space-y-2.5">
              {[
                { icon: '🏃', text: 'Completed 5 workouts this week', time: 'This week', color: '#14B8A6' },
                { icon: '💧', text: 'Stayed hydrated 6 out of 7 days', time: 'This week', color: '#2563EB' },
                { icon: '💰', text: 'Saved $660 this month', time: 'April', color: '#0F766E' },
                { icon: '🧘', text: '15-day meditation streak active', time: 'Ongoing', color: '#C77DFF' },
                { icon: '🍎', text: 'Hit protein goal 5 days in a row', time: 'This week', color: '#F97316' },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-[#EEF3F8] rounded-xl transition-colors">
                  <span className="text-xl">{h.icon}</span>
                  <p style={{ fontSize: '13px' }} className="text-[#333] flex-1">{h.text}</p>
                  <span style={{ fontSize: '10px', fontWeight: 600 }} className="text-[#888] whitespace-nowrap">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Badges & Achievements</h3>
              <span style={{ fontSize: '13px' }} className="text-[#888]">4/8 earned</span>
            </div>
            <p style={{ fontSize: '12px' }} className="text-[#888] mb-4">Keep building habits to unlock more!</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map(b => (
                <div
                  key={b.name}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    b.earned
                      ? 'bg-[#E0F7F3] border-[#14B8A6]'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <span className="text-3xl">{b.emoji}</span>
                  <p style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#17202E] mt-2">{b.name}</p>
                  <p style={{ fontSize: '10px' }} className="text-[#888] mt-0.5">{b.desc}</p>
                  {b.earned && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <CheckCircle size={11} className="text-[#0F766E]" />
                      <span style={{ fontSize: '9px', fontWeight: 700 }} className="text-[#0F766E]">EARNED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Challenges Completion */}
          <div className="bg-[#17202E] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#14B8A6] flex items-center justify-center">
                <Trophy size={20} className="text-[#17202E]" />
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 700 }} className="text-white">Hall of Fame</p>
                <p style={{ fontSize: '12px' }} className="text-white/50">Your top lifetime achievements</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Steps', value: '1.2M', emoji: '👟' },
                { label: 'Workouts Done', value: '124', emoji: '💪' },
                { label: 'Orders Made', value: '87', emoji: '🛍️' },
                { label: 'Streak Record', value: '23 days', emoji: '🔥' },
                { label: 'Meals Logged', value: '340', emoji: '🥗' },
                { label: 'Money Saved', value: '$2,450', emoji: '💰' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl">{s.emoji}</span>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 700 }} className="text-white">{s.value}</p>
                    <p style={{ fontSize: '10px' }} className="text-white/40">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Premium banner */}
          <div className="bg-[#17202E] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6] flex items-center justify-center shrink-0">
              <Crown size={18} className="text-[#17202E]" />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-white">AIOS Premium Active</p>
              <p style={{ fontSize: '12px' }} className="text-white/50">Unlimited AI requests · All features unlocked</p>
            </div>
            <button className="px-3 py-1.5 bg-[#14B8A6] text-[#17202E] rounded-lg hover:bg-[#0F766E] transition-colors" style={{ fontSize: '12px', fontWeight: 600 }}>
              Manage
            </button>
          </div>

          {settingsGroups.map(group => (
            <div key={group.title} className="bg-white rounded-2xl border border-[#14B8A6]/20 overflow-hidden">
              <div className="px-5 py-3 border-b border-[#EEF3F8]">
                <p style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#888] uppercase tracking-wide">{group.title}</p>
              </div>
              <div className="divide-y divide-[#EEF3F8]">
                {group.items.map(item => (
                  <div key={item.label} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-[#EEF3F8] transition-colors cursor-pointer ${(item as any).danger ? 'hover:bg-red-50' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${(item as any).danger ? 'bg-red-50' : 'bg-[#EEF3F8]'}`}>
                      <item.icon size={15} className={(item as any).danger ? 'text-red-500' : 'text-[#666]'} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: '13px', fontWeight: 600 }} className={(item as any).danger ? 'text-red-500' : 'text-[#17202E]'}>
                        {item.label}
                      </p>
                      {item.sub && <p style={{ fontSize: '11px' }} className="text-[#888]">{item.sub}</p>}
                    </div>
                    {item.toggle ? (
                      <button
                        onClick={() => setToggleStates(prev => ({ ...prev, [item.label]: !prev[item.label] }))}
                        className={`w-11 h-6 rounded-full transition-all relative ${toggleStates[item.label] ? 'bg-[#14B8A6]' : 'bg-gray-200'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${toggleStates[item.label] ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    ) : (
                      !(item as any).danger && <ChevronRight size={16} className="text-[#ccc]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* App version */}
          <div className="text-center py-2">
            <p style={{ fontSize: '11px' }} className="text-[#ccc]">AIOS v2.0.1 · Made with ❤️ · April 2026</p>
          </div>
        </div>
      )}
    </div>
  );
}
