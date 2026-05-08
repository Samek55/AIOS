import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft,
  ShoppingBag, Utensils, Dumbbell, Home, Car, Zap, Plus,
  Brain, ChevronRight, PiggyBank, Target, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const monthlyData = [
  { month: 'Nov', income: 5000, expenses: 3800 },
  { month: 'Dec', income: 5500, expenses: 4200 },
  { month: 'Jan', income: 5000, expenses: 3600 },
  { month: 'Feb', income: 5200, expenses: 3900 },
  { month: 'Mar', income: 5000, expenses: 4100 },
  { month: 'Apr', income: 5000, expenses: 1760 },
];

const spendingCategories = [
  { name: 'Food & Dining', value: 480, color: '#F97316', icon: Utensils, budget: 400, emoji: '🍔' },
  { name: 'Shopping', value: 320, color: '#C77DFF', icon: ShoppingBag, budget: 350, emoji: '🛍️' },
  { name: 'Fitness', value: 89, color: '#14B8A6', icon: Dumbbell, budget: 100, emoji: '💪' },
  { name: 'Housing', value: 600, color: '#2563EB', icon: Home, budget: 600, emoji: '🏠' },
  { name: 'Transport', value: 180, color: '#F4C430', icon: Car, budget: 200, emoji: '🚗' },
  { name: 'Utilities', value: 91, color: '#888888', icon: Zap, budget: 120, emoji: '⚡' },
];

const transactions = [
  { id: 1, name: 'Pizza Palace', category: 'Food', amount: -14.50, date: 'Today, 7:30 PM', emoji: '🍕', type: 'expense' },
  { id: 2, name: 'Salary Deposit', category: 'Income', amount: +5000, date: 'Apr 1, 9:00 AM', emoji: '💰', type: 'income' },
  { id: 3, name: 'Urban Outfitters', category: 'Shopping', amount: -89.99, date: 'Apr 4, 2:15 PM', emoji: '👕', type: 'expense' },
  { id: 4, name: 'Green Kitchen', category: 'Food', amount: -12.99, date: 'Apr 4, 12:30 PM', emoji: '🥗', type: 'expense' },
  { id: 5, name: 'Gym Membership', category: 'Fitness', amount: -49, date: 'Apr 3, 8:00 AM', emoji: '🏋️', type: 'expense' },
  { id: 6, name: 'Freelance Payment', category: 'Income', amount: +850, date: 'Apr 2, 3:00 PM', emoji: '💻', type: 'income' },
  { id: 7, name: 'Uber Ride', category: 'Transport', amount: -18.50, date: 'Apr 2, 10:30 AM', emoji: '🚗', type: 'expense' },
  { id: 8, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'Apr 1, 12:00 AM', emoji: '🎬', type: 'expense' },
];

const COLORS = spendingCategories.map(c => c.color);

export default function Finance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'budgets' | 'transactions' | 'savings'>('overview');
  const [showAddGoal, setShowAddGoal] = useState(false);

  const totalExpenses = spendingCategories.reduce((sum, c) => sum + c.value, 0);
  const totalIncome = 5000 + 850;
  const savings = totalIncome - totalExpenses;
  const savingsRate = Math.round((savings / totalIncome) * 100);

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#17202E]">Finance</h1>
        <p style={{ fontSize: '13px' }} className="text-[#888]">April 2026 · Smart Money Management</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 bg-[#17202E] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#14B8A6] flex items-center justify-center">
              <Wallet size={17} className="text-[#17202E]" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#14B8A6] uppercase tracking-wide">Net Balance</span>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 700 }} className="text-white">${(totalIncome - totalExpenses).toLocaleString()}</p>
          <p style={{ fontSize: '12px' }} className="text-white/50 mt-1">Available this month</p>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
            <TrendingUp size={13} className="text-[#14B8A6]" />
            <span style={{ fontSize: '12px' }} className="text-white/60">Savings rate: <span className="text-[#14B8A6] font-semibold">{savingsRate}%</span></span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#14B8A6]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <ArrowDownLeft size={17} className="text-green-600" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700 }} className="text-green-600">+${totalIncome.toLocaleString()}</span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#17202E]">Total Income</p>
          <p style={{ fontSize: '12px' }} className="text-[#888]">Salary + Freelance</p>
          <div className="mt-3 flex items-center gap-1 text-green-500">
            <TrendingUp size={12} />
            <span style={{ fontSize: '11px' }}>+17% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#14B8A6]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <ArrowUpRight size={17} className="text-red-500" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700 }} className="text-red-500">-${totalExpenses.toLocaleString()}</span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#17202E]">Total Expenses</p>
          <p style={{ fontSize: '12px' }} className="text-[#888]">6 categories</p>
          <div className="mt-3 flex items-center gap-1 text-red-400">
            <TrendingUp size={12} />
            <span style={{ fontSize: '11px' }}>+8% vs last month</span>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-[#E0F7F3] rounded-2xl p-4 flex items-start gap-3 border border-[#14B8A6]/30">
        <div className="w-9 h-9 rounded-xl bg-[#14B8A6] flex items-center justify-center shrink-0 mt-0.5">
          <Brain size={17} className="text-[#17202E]" />
        </div>
        <div className="flex-1">
          <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#0F766E] uppercase tracking-wide mb-1">AIOS Finance Insight</p>
          <p style={{ fontSize: '13px' }} className="text-[#333] leading-relaxed">
            🍔 You overspent $80 on Food this month. Cooking at home just 3 times a week could save you <strong>$120/month</strong> — that's $1,440/year!
            Your savings rate improved to <strong>{savingsRate}%</strong> this month. Target is 30%.
          </p>
        </div>
        <AlertCircle size={16} className="text-[#0F766E] shrink-0 mt-1" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {(['overview', 'budgets', 'transactions', 'savings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize whitespace-nowrap transition-all border ${
              activeTab === tab
                ? 'bg-[#17202E] text-white border-[#17202E]'
                : 'bg-white text-[#666] border-[#14B8A6]/30 hover:border-[#14B8A6]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400 }}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'budgets' ? '🎯 Budgets' : tab === 'transactions' ? '📋 Transactions' : '🐷 Savings'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Monthly Income vs Expenses Chart */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-4">Income vs Expenses (6 months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #E0F7F3' }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="income" stroke="#0F766E" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#F97316" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Spending Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-4">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={spendingCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {spendingCategories.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #E0F7F3' }}
                    formatter={(v: number) => [`$${v}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-4">Category Details</h3>
              <div className="space-y-2.5">
                {spendingCategories.map(cat => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <span className="text-lg shrink-0">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p style={{ fontSize: '12px', fontWeight: 500 }} className="text-[#333]">{cat.name}</p>
                        <p style={{ fontSize: '12px', fontWeight: 600 }} className={`${cat.value > cat.budget ? 'text-red-500' : 'text-[#17202E]'}`}>
                          ${cat.value}
                        </p>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min((cat.value / cat.budget) * 100, 100)}%`,
                            backgroundColor: cat.value > cat.budget ? '#E63946' : cat.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUDGETS TAB */}
      {activeTab === 'budgets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Monthly Budgets</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#17202E] text-white rounded-xl hover:bg-[#333] transition-colors" style={{ fontSize: '12px', fontWeight: 600 }}>
              <Plus size={13} /> Add Budget
            </button>
          </div>
          {spendingCategories.map(cat => {
            const pct = (cat.value / cat.budget) * 100;
            const over = cat.value > cat.budget;
            return (
              <div key={cat.name} className="bg-white rounded-2xl border border-[#14B8A6]/20 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                    <cat.icon size={18} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#17202E]">{cat.name}</p>
                      <div className="flex items-center gap-1">
                        {over && <AlertCircle size={13} className="text-red-500" />}
                        <span style={{ fontSize: '13px', fontWeight: 700 }} className={over ? 'text-red-500' : 'text-[#17202E]'}>
                          ${cat.value} <span style={{ fontWeight: 400 }} className="text-[#888]">/ ${cat.budget}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: over ? '#E63946' : pct > 80 ? '#F97316' : cat.color,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span style={{ fontSize: '11px' }} className={over ? 'text-red-400' : pct > 80 ? 'text-[#F97316]' : 'text-[#888]'}>
                    {over ? `⚠️ Over by $${cat.value - cat.budget}` : `$${cat.budget - cat.value} remaining`}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#888]">{Math.round(pct)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Recent Transactions</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#EEF3F8] border border-[#14B8A6]/30 rounded-xl text-[#666] hover:bg-[#E0F7F3] transition-colors" style={{ fontSize: '12px' }}>
              Filter
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 overflow-hidden divide-y divide-[#EEF3F8]">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-4 hover:bg-[#EEF3F8] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3F8] flex items-center justify-center text-xl shrink-0">
                  {t.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#17202E]">{t.name}</p>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '11px' }} className="text-[#888]">{t.category}</span>
                    <span style={{ fontSize: '11px' }} className="text-[#ccc]">·</span>
                    <span style={{ fontSize: '11px' }} className="text-[#bbb]">{t.date}</span>
                  </div>
                </div>
                <span
                  style={{ fontSize: '15px', fontWeight: 700 }}
                  className={t.type === 'income' ? 'text-green-600' : 'text-[#17202E]'}
                >
                  {t.type === 'income' ? '+' : ''}{t.type === 'income' ? '' : '-'}${Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVINGS TAB */}
      {activeTab === 'savings' && (
        <div className="space-y-4">
          <div className="bg-[#17202E] rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14B8A6] flex items-center justify-center">
                  <PiggyBank size={20} className="text-[#17202E]" />
                </div>
                <div>
                  <p style={{ fontSize: '12px' }} className="text-white/50">Total Savings</p>
                  <p style={{ fontSize: '26px', fontWeight: 700 }} className="text-white">$12,450</p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ fontSize: '11px' }} className="text-white/40">This month</p>
                <p style={{ fontSize: '16px', fontWeight: 700 }} className="text-[#14B8A6]">+${savings}</p>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#14B8A6] rounded-full" style={{ width: '62%' }} />
            </div>
            <p style={{ fontSize: '11px' }} className="text-white/40 mt-1">62% to $20,000 emergency fund goal</p>
          </div>

          {/* Saving Goals */}
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Savings Goals</h3>
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#17202E] text-white rounded-xl hover:bg-[#333] transition-colors"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              <Plus size={13} /> Add Goal
            </button>
          </div>

          {[
            { name: 'Emergency Fund', target: 20000, saved: 12450, emoji: '🛡️', color: '#14B8A6', deadline: 'Dec 2026' },
            { name: 'Europe Vacation', target: 5000, saved: 2800, emoji: '✈️', color: '#2563EB', deadline: 'Jul 2026' },
            { name: 'New MacBook Pro', target: 3500, saved: 1200, emoji: '💻', color: '#C77DFF', deadline: 'Sep 2026' },
            { name: 'Investment Portfolio', target: 10000, saved: 4500, emoji: '📈', color: '#F97316', deadline: 'Dec 2026' },
          ].map(goal => {
            const pct = (goal.saved / goal.target) * 100;
            return (
              <div key={goal.name} className="bg-white rounded-2xl border border-[#14B8A6]/20 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#17202E]">{goal.name}</p>
                      <p style={{ fontSize: '13px' }} className="text-[#888]">By {goal.deadline}</p>
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <p style={{ fontSize: '12px' }} className="text-[#888]">${goal.saved.toLocaleString()} saved</p>
                      <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#17202E]">${goal.target.toLocaleString()} goal</p>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
                </div>
                <p style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#888] mt-1">{Math.round(pct)}% complete</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
