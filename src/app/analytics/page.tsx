import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar,
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, Calendar } from 'lucide-react';
import { CardSkeleton, ChartSkeleton } from '@/components/skeletons';
import { formatCurrency } from '@/lib/utils/format';
import { fetchAnalytics } from '@/lib/mock-api/api';
import type { AnalyticsData } from '@/types';
import type { TooltipProps } from 'recharts';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--sk-card)] border border-[var(--sk-border)] rounded-xl px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-[var(--sk-text-secondary)] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          ₴{Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function LineTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--sk-card)] border border-[var(--sk-border)] rounded-xl px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-[var(--sk-text-secondary)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#8B5CF6]">₴{Number(payload[0].value).toLocaleString()}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)]">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <ChartSkeleton className="md:col-span-2" />
        </div>
      </div>
    );
  }

  const incomeVsExpense = data.monthLabels.map((m, i) => ({
    month: m,
    income: data.monthlyIncome[i],
    expense: data.monthlyExpense[i],
  }));

  const trendData = data.monthLabels.map((m, i) => ({
    month: m,
    savings: data.monthlySavings[i],
  }));
  const expenseChange = data.previousExpense > 0
    ? ((data.currentExpense - data.previousExpense) / data.previousExpense) * 100
    : 0;
  const topCategory = data.categoryBreakdown[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)] tracking-tight">Analytics</h1>
          <p className="text-[var(--sk-text-secondary)] mt-1 text-sm">Deep insights into your financial patterns</p>
        </div>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[var(--sk-text-secondary)] bg-[var(--sk-card)] rounded-full border border-[var(--sk-border)] hover:border-[var(--sk-border)] transition-all self-start">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          This Month
        </button>
      </motion.div>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm"
        >
          <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-3 sm:mb-4">Spending by Category</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    sm-inner-radius={45}
                    sm-outer-radius={70}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {data.categoryBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 sm:space-y-2.5 flex-1 w-full">
              {data.categoryBreakdown.length === 0 && (
                <p className="text-xs text-[var(--sk-text-secondary)] text-center sm:text-left">No expenses this month yet.</p>
              )}
              {data.categoryBreakdown.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-[var(--sk-text-secondary)] flex-1 truncate">{cat.name}</span>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--sk-text)] tabular-nums">{formatCurrency(cat.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly Savings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm md:col-span-2"
        >
          <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-3 sm:mb-4">Monthly Savings Trend</h3>
          <div className="h-[180px] sm:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--sk-border)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--sk-text-secondary)' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--sk-text-secondary)' }} tickFormatter={(v) => `₴${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<LineTooltip />} />
                <Line type="monotone" dataKey="savings" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#savingsGrad)" dot={false} activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Income vs Expense */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm"
      >
        <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-3 sm:mb-4">Income vs Expense</h3>
        <div className="h-[200px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpense} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--sk-border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--sk-text-secondary)' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--sk-text-secondary)' }} tickFormatter={(v) => `₴${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Merchants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm"
        >
          <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-3 sm:mb-4">Top Merchants</h3>
          <div className="space-y-0">
            {data.topMerchants.length === 0 && (
              <p className="text-sm text-[var(--sk-text-secondary)] py-8 text-center">No merchant data this month yet.</p>
            )}
            {data.topMerchants.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3 sm:gap-4 py-2.5 sm:py-3 border-b border-[var(--sk-border-light)] last:border-0">
                <span className="text-xs sm:text-sm font-bold text-[var(--sk-text-secondary)] w-4 sm:w-5">{i + 1}</span>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6] text-xs sm:text-sm font-bold">
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--sk-text)] truncate">{m.name}</p>
                  <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)]">{m.count} transactions</p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[var(--sk-text)] tabular-nums">{formatCurrency(m.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights + Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Insights */}
          <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm">
            <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-3 sm:mb-4">AI Insights</h3>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                {
                  icon: expenseChange > 0 ? TrendingUp : TrendingDown,
                  text: data.previousExpense > 0
                    ? `Expenses are ${Math.abs(expenseChange).toFixed(0)}% ${expenseChange > 0 ? 'higher' : 'lower'} than last month`
                    : 'Not enough previous-month data for comparison',
                  color: expenseChange > 0 ? 'text-amber-500' : 'text-green-500',
                  bg: expenseChange > 0 ? 'bg-amber-500/10' : 'bg-green-500/10',
                },
                {
                  icon: ArrowUpRight,
                  text: topCategory
                    ? `${topCategory.name} is your largest expense category at ${formatCurrency(topCategory.amount)}`
                    : 'Add expenses to see category insights',
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10',
                },
                {
                  icon: data.currentIncome >= data.currentExpense ? TrendingDown : TrendingUp,
                  text: `Current month balance: ${formatCurrency(data.currentIncome - data.currentExpense)}`,
                  color: data.currentIncome >= data.currentExpense ? 'text-green-500' : 'text-red-500',
                  bg: data.currentIncome >= data.currentExpense ? 'bg-green-500/10' : 'bg-red-500/10',
                },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 sm:gap-3">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${insight.bg} flex items-center justify-center flex-shrink-0`}>
                    <insight.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${insight.color}`} />
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
              <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)]">Financial Forecast</h3>
            </div>
            <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed mb-3 sm:mb-4">
              At your current pace, projected month-end savings are{' '}
              <span className={`font-bold ${data.projectedSavings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(data.projectedSavings)}
              </span>.
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--sk-text-secondary)]">Confidence</span>
                <span className="font-semibold text-[var(--sk-text)]">{data.dailySpending.length >= 7 ? 'High' : 'Early estimate'}</span>
              </div>
              <div className="h-2 bg-[var(--sk-border)] rounded-full overflow-hidden">
                <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: data.dailySpending.length >= 7 ? '80%' : '40%' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
