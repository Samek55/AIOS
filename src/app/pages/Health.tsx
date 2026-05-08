import { useState } from 'react';
import type { ElementType } from 'react';
import { useNavigate } from 'react-router';
import {
  Heart, Flame, Droplets, Moon, TrendingUp, Activity,
  Award, ChevronRight, Play, Check, Dumbbell, Wind,
  Apple, Coffee, Utensils, Plus
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const FITNESS_IMG = 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const RUNNING_IMG = 'https://images.unsplash.com/photo-1773681823208-7f3657c0688f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const MEDITATION_IMG = 'https://images.unsplash.com/photo-1635545999375-057ee4013deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const SALAD_IMG = 'https://images.unsplash.com/photo-1576402187658-44ca7d2c2c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';

const weeklySteps = [
  { day: 'Mon', steps: 8200, goal: 10000 },
  { day: 'Tue', steps: 6500, goal: 10000 },
  { day: 'Wed', steps: 10200, goal: 10000 },
  { day: 'Thu', steps: 9100, goal: 10000 },
  { day: 'Fri', steps: 7800, goal: 10000 },
  { day: 'Sat', steps: 11500, goal: 10000 },
  { day: 'Sun', steps: 7842, goal: 10000 },
];

const heartRateData = [
  { time: '6AM', bpm: 62 }, { time: '8AM', bpm: 95 },
  { time: '10AM', bpm: 72 }, { time: '12PM', bpm: 78 },
  { time: '2PM', bpm: 68 }, { time: '4PM', bpm: 120 },
  { time: '6PM', bpm: 88 }, { time: '8PM', bpm: 65 },
];

const workouts = [
  { name: 'Morning Cardio Run', duration: '30 min', calories: 280, level: 'Moderate', img: RUNNING_IMG, done: true },
  { name: 'Upper Body Strength', duration: '45 min', calories: 320, level: 'Intense', img: FITNESS_IMG, done: false },
  { name: 'Evening Yoga', duration: '20 min', calories: 120, level: 'Easy', img: MEDITATION_IMG, done: false },
];

const mealPlan = [
  { meal: 'Breakfast', time: '8:00 AM', items: 'Oatmeal + Banana + Coffee', calories: 380, icon: Coffee, done: true },
  { meal: 'Morning Snack', time: '10:30 AM', items: 'Greek Yogurt + Mixed Nuts', calories: 210, icon: Apple, done: true },
  { meal: 'Lunch', time: '12:30 PM', items: 'Grilled Chicken Bowl + Salad', calories: 520, icon: Utensils, done: false },
  { meal: 'Afternoon Snack', time: '3:30 PM', items: 'Apple + Almond Butter', calories: 180, icon: Apple, done: false },
  { meal: 'Dinner', time: '7:00 PM', items: 'Salmon + Brown Rice + Veggies', calories: 580, icon: Utensils, done: false },
];

const waterGlasses = 8;
const drunkGlasses = 5;

interface Ring {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  icon: ElementType;
  size: number;
}

function ActivityRing({ ring }: { ring: Ring }) {
  const radius = ring.size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(ring.value / ring.goal, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: ring.size, height: ring.size }}>
        <svg width={ring.size} height={ring.size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={ring.size/2} cy={ring.size/2} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={8} />
          <circle
            cx={ring.size/2} cy={ring.size/2} r={radius}
            fill="none" stroke={ring.color} strokeWidth={8}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <ring.icon size={16} style={{ color: ring.color }} />
          <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#17202E] mt-0.5">{Math.round(pct * 100)}%</p>
        </div>
      </div>
      <div className="text-center">
        <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#17202E]">{ring.value.toLocaleString()}</p>
        <p style={{ fontSize: '10px' }} className="text-[#888]">{ring.label}</p>
        <p style={{ fontSize: '10px' }} className="text-[#bbb]">/ {ring.goal.toLocaleString()} {ring.unit}</p>
      </div>
    </div>
  );
}

export default function Health() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'nutrition' | 'sleep'>('overview');
  const [waterLogged, setWaterLogged] = useState(drunkGlasses);
  const [completedWorkouts, setCompletedWorkouts] = useState([0]);

  const rings: Ring[] = [
    { label: 'Steps', value: 7842, goal: 10000, unit: 'steps', color: '#14B8A6', icon: Activity, size: 90 },
    { label: 'Calories', value: 1450, goal: 2000, unit: 'kcal', color: '#F97316', icon: Flame, size: 90 },
    { label: 'Water', value: waterLogged, goal: 8, unit: 'glasses', color: '#2563EB', icon: Droplets, size: 90 },
    { label: 'Sleep', value: 7.3, goal: 8, unit: 'hrs', color: '#C77DFF', icon: Moon, size: 90 },
  ];

  const toggleWorkout = (i: number) => {
    setCompletedWorkouts(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#17202E]">Health & Fitness</h1>
          <p style={{ fontSize: '13px' }} className="text-[#888]">Sunday, April 5 · Health Score: <span className="text-[#0F766E] font-semibold">78 / 100</span></p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#17202E] rounded-xl">
          <Heart size={15} className="text-[#14B8A6]" />
          <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-white">72 BPM</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {(['overview', 'workout', 'nutrition', 'sleep'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap capitalize transition-all border ${
              activeTab === tab
                ? 'bg-[#17202E] text-white border-[#17202E]'
                : 'bg-white text-[#666] border-[#14B8A6]/30 hover:border-[#14B8A6]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400 }}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'workout' ? '💪 Workout' : tab === 'nutrition' ? '🥗 Nutrition' : '😴 Sleep'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Activity Rings */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Today's Activity</h3>
              <span style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#0F766E]">On Track 🎯</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
              {rings.map(ring => <ActivityRing key={ring.label} ring={ring} />)}
            </div>
          </div>

          {/* Weekly Steps Chart */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Weekly Steps</h3>
              <div className="text-right">
                <p style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#17202E]">63,882</p>
                <p style={{ fontSize: '11px' }} className="text-[#0F766E]">+12% vs last week ↑</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklySteps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #E0F7F3' }}
                  cursor={{ fill: '#EEF3F8' }}
                  formatter={(v: number) => [`${v.toLocaleString()} steps`, 'Steps']}
                />
                <Bar dataKey="steps" fill="#14B8A6" radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Heart Rate Chart */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Heart Rate Today</h3>
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-red-400 fill-red-400 animate-pulse" />
                <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#17202E]">Avg: 78 BPM</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={heartRateData}>
                <defs>
                  <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis domain={[55, 130]} hide />
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #fde8d8' }}
                  formatter={(v: number) => [`${v} BPM`, 'Heart Rate']}
                />
                <Area type="monotone" dataKey="bpm" stroke="#F97316" strokeWidth={2} fill="url(#heartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Health Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'BMI', value: '22.4', status: 'Normal', color: '#0F766E' },
              { label: 'Resting HR', value: '62 BPM', status: 'Excellent', color: '#14B8A6' },
              { label: 'Blood O₂', value: '98%', status: 'Great', color: '#2563EB' },
              { label: 'Stress Level', value: 'Low', status: 'Relaxed', color: '#F97316' },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-2xl border border-[#14B8A6]/20 p-4 text-center">
                <p style={{ fontSize: '20px', fontWeight: 700 }} className="text-[#17202E]">{m.value}</p>
                <p style={{ fontSize: '12px' }} className="text-[#888] mt-0.5">{m.label}</p>
                <span style={{ fontSize: '10px', fontWeight: 600, color: m.color }} className="mt-1 block">{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKOUT TAB */}
      {activeTab === 'workout' && (
        <div className="space-y-5">
          {/* AI Workout Suggestion */}
          <div className="bg-[#17202E] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#14B8A6] flex items-center justify-center shrink-0">
              <Dumbbell size={22} className="text-[#17202E]" />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#14B8A6] uppercase tracking-wide mb-1">AI Recommendation</p>
              <p style={{ fontSize: '14px' }} className="text-white">Based on yesterday's workout + your mood, try a <strong>moderate upper body + yoga</strong> session today 💪</p>
            </div>
          </div>

          {/* Today's Workout Plan */}
          <div className="space-y-3">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Today's Workout Plan</h3>
            {workouts.map((w, i) => (
              <div key={i} className={`bg-white rounded-2xl border overflow-hidden transition-all ${completedWorkouts.includes(i) ? 'border-[#14B8A6] opacity-75' : 'border-[#14B8A6]/20 hover:border-[#14B8A6]'}`}>
                <div className="flex items-center gap-4 p-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <ImageWithFallback src={w.img} alt={w.name} className="w-full h-full object-cover" />
                    {completedWorkouts.includes(i) && (
                      <div className="absolute inset-0 bg-[#0F766E]/80 flex items-center justify-center">
                        <Check size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 style={{ fontSize: '14px', fontWeight: 600 }} className={`text-[#17202E] ${completedWorkouts.includes(i) ? 'line-through opacity-50' : ''}`}>{w.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: '11px' }} className="text-[#888]">⏱ {w.duration}</span>
                      <span style={{ fontSize: '11px' }} className="text-[#888]">🔥 {w.calories} kcal</span>
                      <span style={{ fontSize: '10px', fontWeight: 600 }} className={`px-2 py-0.5 rounded-full ${
                        w.level === 'Easy' ? 'bg-green-100 text-green-600' :
                        w.level === 'Moderate' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>{w.level}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleWorkout(i)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      completedWorkouts.includes(i)
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-[#17202E] text-white hover:bg-[#14B8A6] hover:text-[#17202E]'
                    }`}
                  >
                    {completedWorkouts.includes(i) ? <Check size={16} /> : <Play size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Exercise Library */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-3">Exercise Library</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['🏋️ Strength', '🏃 Cardio', '🧘 Yoga', '🚴 Cycling', '🏊 Swimming', '⛹️ HIIT'].map(ex => (
                <button key={ex} className="py-3 px-4 bg-[#EEF3F8] rounded-xl border border-[#14B8A6]/20 hover:bg-[#E0F7F3] hover:border-[#14B8A6] transition-all text-center">
                  <p style={{ fontSize: '13px', fontWeight: 500 }} className="text-[#333]">{ex}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NUTRITION TAB */}
      {activeTab === 'nutrition' && (
        <div className="space-y-5">
          {/* Calorie Summary */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Calorie Tracker</h3>
              <span style={{ fontSize: '13px' }} className="text-[#888]">Goal: 2,000 kcal</span>
            </div>
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <p style={{ fontSize: '28px', fontWeight: 700 }} className="text-[#17202E]">1,450</p>
                <p style={{ fontSize: '12px' }} className="text-[#888]">Consumed</p>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#14B8A6] rounded-full" style={{ width: '72.5%' }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: '11px' }} className="text-[#888]">72.5%</span>
                  <span style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#0F766E]">550 remaining</span>
                </div>
              </div>
            </div>
            {/* Macro breakdown */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Protein', value: 85, goal: 120, color: '#F97316', unit: 'g' },
                { label: 'Carbs', value: 165, goal: 250, color: '#14B8A6', unit: 'g' },
                { label: 'Fat', value: 48, goal: 65, color: '#C77DFF', unit: 'g' },
              ].map(m => (
                <div key={m.label} className="bg-[#EEF3F8] rounded-xl p-3">
                  <p style={{ fontSize: '16px', fontWeight: 700 }} className="text-[#17202E]">{m.value}{m.unit}</p>
                  <p style={{ fontSize: '11px' }} className="text-[#888]">{m.label}</p>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(m.value / m.goal) * 100}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Plan */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Today's Meal Plan</h3>
              <ImageWithFallback src={SALAD_IMG} alt="Nutrition" className="w-10 h-10 rounded-xl object-cover" />
            </div>
            <div className="space-y-3">
              {mealPlan.map((meal, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${meal.done ? 'bg-[#E0F7F3]' : 'bg-[#EEF3F8] hover:bg-[#F0F8F0]'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meal.done ? 'bg-[#14B8A6]' : 'bg-white border border-[#14B8A6]/30'}`}>
                    <meal.icon size={16} className={meal.done ? 'text-[#17202E]' : 'text-[#888]'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#17202E]">{meal.meal}</p>
                    <p style={{ fontSize: '11px' }} className="text-[#888] truncate">{meal.items}</p>
                    <p style={{ fontSize: '11px' }} className="text-[#666]">{meal.time} · {meal.calories} kcal</p>
                  </div>
                  {meal.done
                    ? <Check size={16} className="text-[#0F766E] shrink-0" />
                    : <button className="text-[#bbb] hover:text-[#0F766E] transition-colors shrink-0"><Plus size={16} /></button>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Water tracker */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">💧 Water Intake</h3>
              <span style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#2563EB]">{waterLogged}/{waterGlasses} glasses</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {Array.from({ length: waterGlasses }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWaterLogged(i < waterLogged ? i : i + 1)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                    i < waterLogged ? 'bg-[#2563EB]/20 scale-105' : 'bg-gray-100 opacity-40 hover:opacity-70'
                  }`}
                >
                  💧
                </button>
              ))}
            </div>
            <p style={{ fontSize: '12px' }} className="text-[#888]">
              {waterLogged >= waterGlasses ? '🎉 Daily goal reached! Great hydration!' : `Drink ${waterGlasses - waterLogged} more glasses to hit your goal`}
            </p>
            <button
              onClick={() => setWaterLogged(prev => Math.min(prev + 1, waterGlasses))}
              className="mt-3 w-full py-2 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-xl text-[#5a87bd] hover:bg-[#2563EB]/20 transition-colors"
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              + Log a Glass of Water
            </button>
          </div>
        </div>
      )}

      {/* SLEEP TAB */}
      {activeTab === 'sleep' && (
        <div className="space-y-5">
          {/* Sleep summary */}
          <div className="bg-[#17202E] rounded-2xl p-6 text-white">
            <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#14B8A6] uppercase tracking-wide mb-1">Last Night's Sleep</p>
            <div className="flex items-end gap-3">
              <h2 style={{ fontSize: '42px', fontWeight: 700, lineHeight: '1' }} className="text-white">7h 20m</h2>
              <p style={{ fontSize: '14px' }} className="text-white/50 mb-1">/ 8h goal</p>
            </div>
            <p style={{ fontSize: '13px' }} className="text-white/60 mt-2">11:15 PM → 6:35 AM</p>
            <div className="grid grid-cols-3 gap-4 mt-5">
              {[
                { label: 'Deep Sleep', value: '2h 10m', color: '#2563EB' },
                { label: 'REM Sleep', value: '1h 45m', color: '#C77DFF' },
                { label: 'Light Sleep', value: '3h 25m', color: '#14B8A6' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: s.color }} />
                  <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-white">{s.value}</p>
                  <p style={{ fontSize: '10px' }} className="text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep quality */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-4">Sleep Quality Score</h3>
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24">
                <svg width={96} height={96} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={48} cy={48} r={40} fill="none" stroke="#f0f0f0" strokeWidth={10} />
                  <circle cx={48} cy={48} r={40} fill="none" stroke="#14B8A6" strokeWidth={10}
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * 0.15}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p style={{ fontSize: '22px', fontWeight: 700 }} className="text-[#17202E]">85</p>
                  <p style={{ fontSize: '9px' }} className="text-[#888]">/ 100</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[
                  { label: 'Duration', score: 92, color: '#14B8A6' },
                  { label: 'Consistency', score: 78, color: '#2563EB' },
                  { label: 'Deep Sleep %', score: 85, color: '#C77DFF' },
                  { label: 'Interruptions', score: 90, color: '#F97316' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span style={{ fontSize: '12px' }} className="text-[#888] w-28 shrink-0">{s.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#333] w-8 text-right">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sleep tips */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-3">🌙 Sleep Tips from AIOS</h3>
            {[
              '📵 Avoid screens 30 min before bed for better REM sleep',
              '🌡️ Keep your room at 65-68°F for optimal sleep quality',
              '🎵 Try brown noise or rain sounds tonight',
              '☕ No caffeine after 2 PM for deeper sleep',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-[#EEF3F8] last:border-0">
                <p style={{ fontSize: '13px' }} className="text-[#555] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}