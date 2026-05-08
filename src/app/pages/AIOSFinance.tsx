import { useState } from 'react';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Brain,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAiosApp } from '../state/AiosAppContext';
import { formatCurrency } from '../lib/formatters';

export default function AIOSFinance() {
  const {
    finance,
    financeInsight,
    monthlyIncomeTotal,
    savings,
    savingsRate,
    totalExpenses,
  } = useAiosApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'budgets' | 'transactions' | 'savings'>('overview');

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#17202E]">
          Finance
        </h1>
        <p style={{ fontSize: '13px' }} className="text-[#888]">
          Live spend, savings, and order-linked money tracking
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#17202E] p-5 text-white">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14B8A6]">
              <Wallet size={17} className="text-[#17202E]" />
            </div>
            <span
              style={{ fontSize: '11px', fontWeight: 700 }}
              className="uppercase tracking-wide text-[#14B8A6]"
            >
              Net balance
            </span>
          </div>
          <p style={{ fontSize: '30px', fontWeight: 700 }}>{formatCurrency(savings)}</p>
          <p style={{ fontSize: '12px' }} className="mt-1 text-white/50">
            Available after tracked spend
          </p>
          <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
            <TrendingUp size={13} className="text-[#14B8A6]" />
            <span style={{ fontSize: '12px' }} className="text-white/60">
              Savings rate {savingsRate}%
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#14B8A6]/20 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100">
              <ArrowDownLeft size={17} className="text-green-600" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }} className="text-green-600">
              {formatCurrency(monthlyIncomeTotal)}
            </span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#17202E]">
            Income
          </p>
          <p style={{ fontSize: '12px' }} className="text-[#888]">
            Salary plus side income
          </p>
        </div>

        <div className="rounded-2xl border border-[#14B8A6]/20 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <ArrowUpRight size={17} className="text-red-500" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }} className="text-red-500">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#17202E]">
            Expenses
          </p>
          <p style={{ fontSize: '12px' }} className="text-[#888]">
            Includes marketplace orders in real time
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[#14B8A6]/30 bg-[#E0F7F3] p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6]">
          <Brain size={17} className="text-[#17202E]" />
        </div>
        <div className="flex-1">
          <p
            style={{ fontSize: '12px', fontWeight: 700 }}
            className="mb-1 uppercase tracking-wide text-[#0F766E]"
          >
            AIOS finance insight
          </p>
          <p style={{ fontSize: '13px' }} className="text-[#333]">
            {financeInsight}
          </p>
        </div>
        <AlertCircle size={16} className="mt-1 text-[#0F766E]" />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {(['overview', 'budgets', 'transactions', 'savings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl border px-4 py-2 capitalize transition-all ${
              activeTab === tab
                ? 'border-[#17202E] bg-[#17202E] text-white'
                : 'border-[#14B8A6]/30 bg-white text-[#666] hover:border-[#14B8A6]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 700 : 500 }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#14B8A6]/20 bg-white p-5">
            <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="mb-4 text-[#17202E]">
              Income vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={finance.monthlySeries}>
                <defs>
                  <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#999' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #E0F7F3' }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Area type="monotone" dataKey="income" stroke="#0F766E" fill="url(#income-grad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#F97316" fill="url(#expense-grad)" strokeWidth={2} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#14B8A6]/20 bg-white p-5">
              <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="mb-4 text-[#17202E]">
                Spend by Category
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={finance.categories}
                    dataKey="spent"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {finance.categories.map((category) => (
                      <Cell key={category.id} fill={category.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '10px', border: '1px solid #E0F7F3' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-[#14B8A6]/20 bg-white p-5">
              <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="mb-4 text-[#17202E]">
                Category Detail
              </h2>
              <div className="space-y-3">
                {finance.categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-3">
                    <span style={{ fontSize: '14px', fontWeight: 700 }} className="w-6 text-center">
                      {category.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex justify-between">
                        <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#333]">
                          {category.name}
                        </p>
                        <p
                          style={{ fontSize: '12px', fontWeight: 700 }}
                          className={category.spent > category.budget ? 'text-red-500' : 'text-[#17202E]'}
                        >
                          {formatCurrency(category.spent)}
                        </p>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((category.spent / category.budget) * 100, 100)}%`,
                            backgroundColor:
                              category.spent > category.budget ? '#E63946' : category.color,
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
      ) : null}

      {activeTab === 'budgets' ? (
        <div className="space-y-4">
          {finance.categories.map((category) => {
            const pct = Math.round((category.spent / category.budget) * 100);
            const over = category.spent > category.budget;
            return (
              <div
                key={category.id}
                className="rounded-2xl border border-[#14B8A6]/20 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#17202E]">
                      {category.name}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">
                      Budget {formatCurrency(category.budget)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      style={{ fontSize: '14px', fontWeight: 700 }}
                      className={over ? 'text-red-500' : 'text-[#17202E]'}
                    >
                      {formatCurrency(category.spent)}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">
                      {pct}% used
                    </p>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: over ? '#E63946' : category.color,
                    }}
                  />
                </div>
                <p
                  style={{ fontSize: '11px', fontWeight: 600 }}
                  className={`mt-1 ${over ? 'text-red-400' : 'text-[#888]'}`}
                >
                  {over
                    ? `Over by ${formatCurrency(category.spent - category.budget)}`
                    : `${formatCurrency(category.budget - category.spent)} remaining`}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {activeTab === 'transactions' ? (
        <div className="overflow-hidden rounded-2xl border border-[#14B8A6]/20 bg-white">
          {finance.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 border-b border-[#EEF3F8] p-4 last:border-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3F8]">
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{transaction.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#17202E]">
                  {transaction.name}
                </p>
                <p style={{ fontSize: '11px' }} className="text-[#888]">
                  {transaction.categoryLabel} • {transaction.dateLabel}
                </p>
              </div>
              <span
                style={{ fontSize: '15px', fontWeight: 700 }}
                className={transaction.type === 'income' ? 'text-green-600' : 'text-[#17202E]'}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(Math.abs(transaction.amount))}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === 'savings' ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#17202E] p-5 text-white">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14B8A6]">
                <PiggyBank size={20} className="text-[#17202E]" />
              </div>
              <div>
                <p style={{ fontSize: '12px' }} className="text-white/50">
                  Saved this month
                </p>
                <p style={{ fontSize: '26px', fontWeight: 700 }}>{formatCurrency(savings)}</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#14B8A6]" style={{ width: `${Math.min(savingsRate, 100)}%` }} />
            </div>
            <p style={{ fontSize: '11px' }} className="mt-1 text-white/40">
              Savings rate {savingsRate}% of tracked income
            </p>
          </div>

          {finance.savingsGoals.map((goal) => {
            const pct = Math.round((goal.saved / goal.target) * 100);
            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-[#14B8A6]/20 bg-white p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${goal.color}25` }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{goal.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#17202E]">
                        {goal.name}
                      </p>
                      <p style={{ fontSize: '12px' }} className="text-[#888]">
                        {goal.deadlineLabel}
                      </p>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <p style={{ fontSize: '12px' }} className="text-[#888]">
                        {formatCurrency(goal.saved)} saved
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#17202E]">
                        {formatCurrency(goal.target)} goal
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: goal.color }}
                  />
                </div>
                <p style={{ fontSize: '11px', fontWeight: 700 }} className="mt-1 text-[#888]">
                  {pct}% complete
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
