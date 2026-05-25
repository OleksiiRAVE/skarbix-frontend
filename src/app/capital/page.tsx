import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, Wallet } from 'lucide-react';
import { CardSkeleton, ChartSkeleton } from '@/components/skeletons';
import { formatCurrency } from '@/lib/utils/format';
import { fetchCapital } from '@/lib/mock-api/api';
import type { CapitalData } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CapitalPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CapitalData | null>(null);

  useEffect(() => {
    fetchCapital().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Capital</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  const chartData = data?.history || [];
  const totalAssets = data?.totalAssets || 0;
  const totalLiabilities = data?.totalLiabilities || 0;
  const netWorth = totalAssets - totalLiabilities;
  const changePercent = data?.changePercent || 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">Capital</h1>
        <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">Track your net worth over time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Net Worth', value: netWorth, icon: Wallet, color: '#8B5CF6' },
          { label: 'Total Assets', value: totalAssets, icon: TrendingUp, color: '#10B981' },
          { label: 'Liabilities', value: totalLiabilities, icon: TrendingDown, color: '#EF4444' },
          { label: 'Change', value: changePercent, icon: ArrowUpRight, color: changePercent >= 0 ? '#10B981' : '#EF4444', isPercent: true },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--sk-card)] rounded-[14px] sm:rounded-[16px] p-3 sm:p-4 border border-[var(--sk-border)] shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)]">{stat.label}</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-[var(--sk-text)]">
                {stat.isPercent ? `${stat.value >= 0 ? '+' : ''}${stat.value.toFixed(2)}%` : formatCurrency(stat.value)}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-4">Net Worth History</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--sk-border)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--sk-text-secondary)' }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--sk-text-secondary)' }} tickFormatter={(v) => `₴${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'var(--sk-card)', border: '1px solid var(--sk-border)', borderRadius: '12px' }}
              formatter={(v: number) => [`₴${v.toLocaleString()}`]}
              labelStyle={{ color: 'var(--sk-text-secondary)' }}
            />
            <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#capGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Allocation */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-4">Asset Allocation</h3>
        <div className="space-y-3">
          {[
            { name: 'Cash & Deposits', value: 45000, color: '#8B5CF6' },
            { name: 'Investments', value: 32000, color: '#3B82F6' },
            { name: 'Real Estate', value: 28000, color: '#10B981' },
            { name: 'Crypto', value: 8500, color: '#F59E0B' },
            { name: 'Other', value: 3200, color: '#6B7280' },
          ].map((asset) => {
            const pct = (asset.value / totalAssets) * 100;
            return (
              <div key={asset.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: asset.color }} />
                <span className="text-sm text-[var(--sk-text)] flex-1">{asset.name}</span>
                <span className="text-sm font-medium text-[var(--sk-text)]">{formatCurrency(asset.value)}</span>
                <span className="text-xs text-[var(--sk-text-secondary)] w-10 text-right">{pct.toFixed(1)}%</span>
                <div className="w-16 sm:w-24 h-1.5 bg-[var(--sk-border-light)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: asset.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
