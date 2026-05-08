import { useState } from 'react';
import {
  Activity,
  Check,
  Droplets,
  Flame,
  Heart,
  Moon,
  Play,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAiosApp } from '../state/AiosAppContext';
import { formatCompactNumber } from '../lib/formatters';

function Ring({
  value,
  goal,
  label,
  accent,
}: {
  value: number;
  goal: number;
  label: string;
  accent: string;
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / goal, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[84px] w-[84px]">
        <svg width={84} height={84} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={42} cy={42} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={8} />
          <circle
            cx={42}
            cy={42}
            r={radius}
            fill="none"
            stroke={accent}
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
            {Math.round(pct * 100)}%
          </p>
        </div>
      </div>
      <div className="text-center">
        <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
          {value}
        </p>
        <p style={{ fontSize: '10px' }} className="text-[#888]">
          {label}
        </p>
        <p style={{ fontSize: '10px' }} className="text-[#bbb]">
          of {goal}
        </p>
      </div>
    </div>
  );
}

export default function AIOSHealth() {
  const {
    caloriesConsumed,
    completeMeal,
    health,
    healthScore,
    logWater,
    meals,
    toggleWorkout,
    workouts,
  } = useAiosApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'nutrition' | 'sleep'>('overview');

  const rings = [
    { label: 'Steps', value: health.stepsToday, goal: health.stepGoal, accent: '#C2DBC4' },
    { label: 'Calories', value: health.caloriesBurned, goal: health.calorieGoal, accent: '#F4A261' },
    { label: 'Water', value: health.waterGlasses, goal: health.waterGoal, accent: '#7BA7DC' },
    { label: 'Sleep', value: Number(health.sleepHours.toFixed(1)), goal: health.sleepGoal, accent: '#C77DFF' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#222222]">
            Health & Fitness
          </h1>
          <p style={{ fontSize: '13px' }} className="text-[#888]">
            Health score {healthScore.toFixed(0)}/100 • Resting HR {health.restingHeartRate} BPM
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#222222] px-4 py-2 text-white">
          <Heart size={15} className="text-[#C2DBC4]" />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{health.averageHeartRate} BPM avg</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {(['overview', 'workout', 'nutrition', 'sleep'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl border px-4 py-2 capitalize transition-all ${
              activeTab === tab
                ? 'border-[#222222] bg-[#222222] text-white'
                : 'border-[#C2DBC4]/30 bg-white text-[#666] hover:border-[#C2DBC4]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 700 : 500 }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                Today Activity
              </h2>
              <span style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#7BAF80]">
                On track
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6 justify-items-center sm:grid-cols-4">
              {rings.map((ring) => (
                <Ring key={ring.label} {...ring} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                  Weekly Steps
                </h2>
                <p style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#7BAF80]">
                  {formatCompactNumber(
                    health.weeklySteps.reduce((sum, point) => sum + point.steps, 0),
                  )}{' '}
                  total
                </p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={health.weeklySteps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #E8F3E9' }}
                    formatter={(value: number) => [`${value.toLocaleString()} steps`, 'Steps']}
                  />
                  <Bar dataKey="steps" fill="#C2DBC4" radius={[6, 6, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                  Heart Rate
                </h2>
                <span style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#F4A261]">
                  Avg {health.averageHeartRate} BPM
                </span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={health.heartRateSeries}>
                  <defs>
                    <linearGradient id="heart-rate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4A261" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F4A261" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #fde8d8' }}
                    formatter={(value: number) => [`${value} BPM`, 'Heart rate']}
                  />
                  <Area type="monotone" dataKey="bpm" stroke="#F4A261" fill="url(#heart-rate)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'workout' ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#222222] p-5 text-white">
            <p
              style={{ fontSize: '11px', fontWeight: 700 }}
              className="mb-1 uppercase tracking-wide text-[#C2DBC4]"
            >
              AI recommendation
            </p>
            <p style={{ fontSize: '14px' }}>
              Based on your current energy, a moderate upper-body session followed by yoga is the smartest move today.
            </p>
          </div>

          <div className="space-y-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                  workout.completed ? 'border-[#C2DBC4]' : 'border-[#C2DBC4]/20 hover:border-[#C2DBC4]'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <ImageWithFallback
                    src={workout.imageUrl}
                    alt={workout.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3
                      style={{ fontSize: '14px', fontWeight: 700 }}
                      className={workout.completed ? 'text-[#888]' : 'text-[#222222]'}
                    >
                      {workout.name}
                    </h3>
                    <p style={{ fontSize: '11px' }} className="mt-1 text-[#888]">
                      {workout.durationLabel} • {workout.calories} kcal • {workout.intensity}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWorkout(workout.id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      workout.completed
                        ? 'bg-[#7BAF80] text-white'
                        : 'bg-[#222222] text-white hover:bg-[#333333]'
                    }`}
                  >
                    {workout.completed ? <Check size={16} /> : <Play size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === 'nutrition' ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                Calorie Tracker
              </h2>
              <span style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#7BAF80]">
                Goal 2,000 kcal
              </span>
            </div>
            <div className="mb-4 flex items-center gap-6">
              <div className="text-center">
                <p style={{ fontSize: '28px', fontWeight: 700 }} className="text-[#222222]">
                  {caloriesConsumed}
                </p>
                <p style={{ fontSize: '12px' }} className="text-[#888]">
                  Consumed
                </p>
              </div>
              <div className="flex-1">
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#C2DBC4]"
                    style={{ width: `${Math.min((caloriesConsumed / 2000) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between">
                  <span style={{ fontSize: '11px' }} className="text-[#888]">
                    {Math.round((caloriesConsumed / 2000) * 100)}%
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700 }} className="text-[#7BAF80]">
                    {Math.max(2000 - caloriesConsumed, 0)} remaining
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Protein', value: 85, goal: 120, accent: '#F4A261' },
                { label: 'Carbs', value: 165, goal: 250, accent: '#C2DBC4' },
                { label: 'Fat', value: 48, goal: 65, accent: '#C77DFF' },
              ].map((macro) => (
                <div key={macro.label} className="rounded-xl bg-[#F5FAF5] p-3">
                  <p style={{ fontSize: '16px', fontWeight: 700 }} className="text-[#222222]">
                    {macro.value}g
                  </p>
                  <p style={{ fontSize: '11px' }} className="text-[#888]">
                    {macro.label}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`,
                        backgroundColor: macro.accent,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="mb-4 text-[#222222]">
              Meal Plan
            </h2>
            <div className="space-y-3">
              {meals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => completeMeal(meal.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                    meal.completed ? 'bg-[#E8F3E9]' : 'bg-[#F5FAF5] hover:bg-[#EEF6EE]'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      meal.completed ? 'bg-[#C2DBC4]' : 'bg-white'
                    }`}
                  >
                    {meal.source === 'order' ? (
                      <Flame size={16} className={meal.completed ? 'text-[#222222]' : 'text-[#888]'} />
                    ) : (
                      <Activity size={16} className={meal.completed ? 'text-[#222222]' : 'text-[#888]'} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                      {meal.meal}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">
                      {meal.items}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#666]">
                      {meal.timeLabel} • {meal.calories} kcal
                    </p>
                  </div>
                  {meal.completed ? <Check size={16} className="text-[#7BAF80]" /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                Water Intake
              </h2>
              <span style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#7BA7DC]">
                {health.waterGlasses}/{health.waterGoal} glasses
              </span>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {Array.from({ length: health.waterGoal }).map((_, index) => (
                <div
                  key={`glass-${index}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    index < health.waterGlasses ? 'bg-[#7BA7DC]/20' : 'bg-gray-100 opacity-40'
                  }`}
                >
                  <Droplets size={16} className={index < health.waterGlasses ? 'text-[#5a87bd]' : 'text-[#999]'} />
                </div>
              ))}
            </div>
            <button
              onClick={() => logWater(1)}
              className="w-full rounded-xl border border-[#7BA7DC]/30 bg-[#7BA7DC]/10 py-2.5 text-[#5a87bd] transition-colors hover:bg-[#7BA7DC]/20"
              style={{ fontSize: '13px', fontWeight: 700 }}
            >
              Log one glass
            </button>
          </div>
        </div>
      ) : null}

      {activeTab === 'sleep' ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#222222] p-6 text-white">
            <p
              style={{ fontSize: '11px', fontWeight: 700 }}
              className="mb-1 uppercase tracking-wide text-[#C2DBC4]"
            >
              Last night sleep
            </p>
            <h2 style={{ fontSize: '42px', fontWeight: 700, lineHeight: '1' }}>
              {health.sleepHours}h
            </h2>
            <p style={{ fontSize: '13px' }} className="mt-2 text-white/60">
              Goal is {health.sleepGoal}h. You are close, but a slightly earlier wind-down would help.
            </p>
          </div>

          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="mb-4 text-[#222222]">
              Sleep Quality
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Duration', value: 92, accent: '#C2DBC4' },
                { label: 'Consistency', value: 78, accent: '#7BA7DC' },
                { label: 'Deep Sleep', value: 85, accent: '#C77DFF' },
                { label: 'Interruptions', value: 90, accent: '#F4A261' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl bg-[#F5FAF5] p-3">
                  <p style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
                    {metric.value}
                  </p>
                  <p style={{ fontSize: '11px' }} className="text-[#888]">
                    {metric.label}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${metric.value}%`, backgroundColor: metric.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="mb-3 text-[#222222]">
              AIOS sleep tips
            </h2>
            <div className="space-y-3">
              {[
                'Avoid screens 30 minutes before bed to protect REM sleep.',
                'Keep the room cool and quiet for deeper sleep cycles.',
                'Skip caffeine after 2 PM when tomorrow is high focus.',
                'Use a short stretch or breathing reset before lights out.',
              ].map((tip) => (
                <div key={tip} className="rounded-xl bg-[#F5FAF5] p-3">
                  <p style={{ fontSize: '13px' }} className="text-[#555]">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
