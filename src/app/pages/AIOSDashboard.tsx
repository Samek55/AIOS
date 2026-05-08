import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CheckSquare,
  Clock,
  Droplets,
  Flame,
  Heart,
  MapPin,
  Moon,
  ShoppingBag,
  Sparkles,
  Sun,
  Wallet,
  Zap,
} from 'lucide-react';
import { useAiosApp } from '../state/AiosAppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { formatCompactNumber, formatCurrency, titleCase } from '../lib/formatters';

const moodOptions = [
  { value: 'tired', label: 'Low energy' },
  { value: 'stressed', label: 'Stressed' },
  { value: 'focused', label: 'Focused' },
  { value: 'good', label: 'Good' },
  { value: 'energized', label: 'Energized' },
] as const;

export default function AIOSDashboard() {
  const navigate = useNavigate();
  const {
    activeOrder,
    addCartItem,
    cartCount,
    dashboardInsights,
    executeAssistantAction,
    health,
    healthScore,
    mood,
    notifications,
    productivityScore,
    profile,
    quickProducts,
    recentOrders,
    savings,
    savingsRate,
    setMood,
    tasks,
    todayLabel,
  } = useAiosApp();
  const [insightIndex, setInsightIndex] = useState(0);

  const insight = dashboardInsights[insightIndex] ?? dashboardInsights[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetingIcon = hour < 12 ? Sun : hour < 17 ? Activity : Moon;
  const GreetingIcon = greetingIcon;

  const nextTasks = tasks.filter((task) => !task.completed).slice(0, 4);

  const stats = [
    {
      label: 'Steps Today',
      value: formatCompactNumber(health.stepsToday),
      detail: `${health.stepsToday}/${health.stepGoal}`,
      icon: Activity,
      accent: '#14B8A6',
      progress: Math.min((health.stepsToday / health.stepGoal) * 100, 100),
    },
    {
      label: 'Hydration',
      value: `${health.waterGlasses}/${health.waterGoal}`,
      detail: 'Glasses',
      icon: Droplets,
      accent: '#2563EB',
      progress: Math.min((health.waterGlasses / health.waterGoal) * 100, 100),
    },
    {
      label: 'Productivity',
      value: `${productivityScore}%`,
      detail: 'Routine score',
      icon: CheckSquare,
      accent: '#F97316',
      progress: productivityScore,
    },
    {
      label: 'Monthly Savings',
      value: formatCurrency(savings),
      detail: `${savingsRate}% saved`,
      icon: Wallet,
      accent: '#0F766E',
      progress: Math.min(savingsRate, 100),
    },
  ];

  const handleInsightAction = () => {
    if (!insight) {
      return;
    }
    const result = executeAssistantAction(insight.action);
    if (result.navigateTo) {
      navigate(result.navigateTo);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 lg:p-6">
      <div className="relative overflow-hidden rounded-3xl p-6 shadow-xl shadow-[#17202E]/10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #17202E 0%, #0F766E 58%, #F97316 140%)',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#99F6E4]">
              <GreetingIcon size={16} />
              <p style={{ fontSize: '13px' }}>{greeting}</p>
            </div>
            <h1
              style={{ fontSize: '28px', fontWeight: 700, lineHeight: '1.1' }}
              className="max-w-2xl text-white"
            >
              {profile.firstName}, your day is under control.
            </h1>
            <p style={{ fontSize: '13px' }} className="mt-2 text-white/60">
              {todayLabel} • Health score {healthScore.toFixed(0)}/100 • Mood {titleCase(mood)}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/ai-assistant')}
              className="flex items-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-2 text-white shadow-lg shadow-[#14B8A6]/25 transition-colors hover:bg-[#0F766E]"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                <Zap size={15} />
                Ask AIOS
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                <ShoppingBag size={15} />
                Order Nearby
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-white/70">
                <Sun size={14} className="text-yellow-400" />
                <span style={{ fontSize: '13px' }}>28 C • Clear</span>
              </div>
              <div className="mt-1 flex items-center justify-end gap-1 text-[#99F6E4]">
                <MapPin size={12} />
                <span style={{ fontSize: '12px' }}>
                  {profile.city}, {profile.state}
                </span>
              </div>
              <p style={{ fontSize: '11px' }} className="mt-2 text-white/40">
                {cartCount} items currently in cart
              </p>
            </div>
            <ImageWithFallback
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-14 w-14 rounded-full border-2 border-[#14B8A6] object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm shadow-[#17202E]/5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${stat.accent}20` }}
              >
                <stat.icon size={18} style={{ color: stat.accent }} />
              </div>
              <span style={{ fontSize: '11px' }} className="text-[#888]">
                {stat.detail}
              </span>
            </div>
            <p style={{ fontSize: '20px', fontWeight: 700 }} className="text-[#17202E]">
              {stat.value}
            </p>
            <p style={{ fontSize: '12px' }} className="text-[#888]">
              {stat.label}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${stat.progress}%`, backgroundColor: stat.accent }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-[#D8E1EA] bg-[#17202E] p-4 shadow-lg shadow-[#17202E]/10">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6]">
          <Brain size={20} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              style={{ fontSize: '11px', fontWeight: 700 }}
              className="uppercase tracking-wide text-[#99F6E4]"
            >
              AIOS Insight
            </span>
            <span style={{ fontSize: '11px' }} className="text-white/40">
              {insightIndex + 1}/{dashboardInsights.length}
            </span>
          </div>
          <p style={{ fontSize: '14px' }} className="text-white/90">
            {insight?.text}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setInsightIndex((current) => (current + 1) % dashboardInsights.length)}
            className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={handleInsightAction}
            className="rounded-lg bg-[#14B8A6] px-3 py-2 text-white transition-colors hover:bg-[#0F766E]"
            style={{ fontSize: '12px', fontWeight: 600 }}
          >
            {insight?.actionLabel}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#D8E1EA] bg-white p-5 shadow-sm shadow-[#17202E]/5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 style={{ fontSize: '16px', fontWeight: 700 }} className="text-[#17202E]">
              What is next today
            </h2>
            <button
              onClick={() => navigate('/routine')}
              className="flex items-center gap-1 text-[#0F766E] transition-colors hover:text-[#17202E]"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {nextTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-[#D8E1EA] p-3 transition-colors hover:bg-[#EEF3F8]"
              >
                <div className="w-16 shrink-0 text-center">
                  <p style={{ fontSize: '11px' }} className="text-[#888]">
                    {task.timeLabel ?? 'Later'}
                  </p>
                </div>
                <div className="h-10 w-1 rounded-full bg-[#14B8A6]" />
                <div className="min-w-0 flex-1">
                  <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#17202E]">
                    {task.title}
                  </p>
                  <p style={{ fontSize: '11px' }} className="text-[#888]">
                    {titleCase(task.section)} • {task.tag}
                  </p>
                </div>
                <button
                  onClick={() => executeAssistantAction({ type: 'toggle_task', label: 'Done', taskId: task.id })}
                  className="rounded-lg bg-[#17202E] px-3 py-2 text-white transition-colors hover:bg-[#0F766E]"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                >
                  Done
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#D8E1EA] bg-white p-5 shadow-sm shadow-[#17202E]/5">
            <div className="mb-3 flex items-center justify-between">
              <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">
                Mood Mode
              </h2>
              <Heart size={15} className="text-[#E11D48]" />
            </div>
            <div className="space-y-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-all ${
                    mood === option.value
                      ? 'border-[#14B8A6] bg-[#E0F7F3]'
                      : 'border-[#D8E1EA] bg-[#EEF3F8] hover:border-[#14B8A6]'
                  }`}
                >
                  <span style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#17202E]">
                    {option.label}
                  </span>
                  <span style={{ fontSize: '11px' }} className="text-[#888]">
                    {mood === option.value ? 'Active' : 'Use'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8E1EA] bg-white p-5 shadow-sm shadow-[#17202E]/5">
            <div className="mb-3 flex items-center justify-between">
              <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">
                Smart Alerts
              </h2>
              <Bell size={15} className="text-[#F97316]" />
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="rounded-xl bg-[#EEF3F8] p-3">
                  <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#17202E]">
                    {notification.title}
                  </p>
                  <p style={{ fontSize: '11px' }} className="mt-1 text-[#666]">
                    {notification.body}
                  </p>
                  <p style={{ fontSize: '10px' }} className="mt-1 text-[#aaa]">
                    {notification.timeLabel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#D8E1EA] bg-white p-5 shadow-sm shadow-[#17202E]/5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }} className="text-[#17202E]">
                Quick Order Nearby
              </h2>
              <p style={{ fontSize: '12px' }} className="text-[#888]">
                Personalized picks from your nearby favorites
              </p>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="flex items-center gap-1 text-[#0F766E] transition-colors hover:text-[#17202E]"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              Marketplace
              <ArrowRight size={14} />
            </button>
          </div>

          {activeOrder ? (
            <div className="mb-4 rounded-xl border border-[#14B8A6]/30 bg-[#E0F7F3] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14B8A6]">
                  <Clock size={16} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#17202E]">
                    {activeOrder.vendorName} is on the way
                  </p>
                  <p style={{ fontSize: '11px' }} className="text-[#666]">
                    {activeOrder.etaLabel} • {titleCase(activeOrder.status)}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[#0F766E]"
                  style={{ width: `${activeOrder.progressPct}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickProducts.map(({ product, vendor }) => (
              <div
                key={product.id}
                className="group flex items-center gap-3 rounded-xl border border-[#D8E1EA] p-3 transition-all hover:border-[#14B8A6] hover:bg-[#EEF3F8]"
              >
                <ImageWithFallback
                  src={product.imageUrl ?? vendor.imageUrl}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p style={{ fontSize: '13px', fontWeight: 600 }} className="truncate text-[#17202E]">
                    {product.name}
                  </p>
                  <p style={{ fontSize: '11px' }} className="truncate text-[#888]">
                    {vendor.name} • {vendor.etaLabel}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 700 }} className="mt-1 text-[#17202E]">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <button
                  onClick={() => addCartItem(product.id)}
                  className="rounded-lg bg-[#17202E] px-3 py-2 text-white transition-all group-hover:bg-[#14B8A6] group-hover:text-white"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8E1EA] bg-white p-5 shadow-sm shadow-[#17202E]/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">
              Recap Snapshot
            </h2>
            <Flame size={15} className="text-[#F97316]" />
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-[#EEF3F8] p-3">
              <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#17202E]">
                Health
              </p>
              <p style={{ fontSize: '11px' }} className="mt-1 text-[#666]">
                {health.stepsToday} steps, {health.waterGlasses} glasses, {health.sleepHours}h sleep.
              </p>
            </div>
            <div className="rounded-xl bg-[#EEF3F8] p-3">
              <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#17202E]">
                Productivity
              </p>
              <p style={{ fontSize: '11px' }} className="mt-1 text-[#666]">
                {productivityScore}% score with {nextTasks.length} tasks still open.
              </p>
            </div>
            <div className="rounded-xl bg-[#EEF3F8] p-3">
              <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#17202E]">
                Commerce
              </p>
              <p style={{ fontSize: '11px' }} className="mt-1 text-[#666]">
                {recentOrders.length} recent orders, live cart ready, and marketplace synced.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17202E] px-4 py-3 text-white transition-colors hover:bg-[#0F766E]"
            style={{ fontSize: '13px', fontWeight: 600 }}
          >
            <Sparkles size={15} />
            Ask for a full day summary
          </button>
        </div>
      </div>
    </div>
  );
}
