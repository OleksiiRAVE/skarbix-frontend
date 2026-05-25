import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { TransactionOverviewData } from '@/types';
import type { TooltipProps } from 'recharts';

function TxTooltip({ active, payload, label }: TooltipProps<number, string>) {
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

interface TransactionOverviewChartProps {
  data: TransactionOverviewData[];
}

export function TransactionOverviewChart({ data }: TransactionOverviewChartProps) {
  const totalCurrent = data.reduce((sum, d) => sum + d.current, 0);
  const totalPrevious = data.reduce((sum, d) => sum + d.previous, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--sk-text)]">Transaction Overview</h3>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--sk-text-secondary)] bg-[var(--sk-border-light)] rounded-full hover:bg-[var(--sk-border-light)] transition-colors">
          Monthly
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--sk-border-light)] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span className="text-[11px] font-medium text-[var(--sk-text-secondary)] uppercase tracking-wide">Total Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[var(--sk-text)] tabular-nums">
              {formatCurrency(totalCurrent)}
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-semibold">
              +14.51%
            </span>
          </div>
        </div>
        <div className="bg-[var(--sk-border-light)] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-medium text-[var(--sk-text-secondary)] uppercase tracking-wide">Previous Period</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[var(--sk-text)] tabular-nums">
              {formatCurrency(totalPrevious)}
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-semibold">
              +8.22%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--sk-border)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--sk-text-secondary)' }}
              tickFormatter={(v) => {
                const d = new Date(v);
                return d.getDate() === 1 || d.getDate() === 15 || d.getDate() === 30
                  ? `${d.getDate()} May`
                  : '';
              }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--sk-text-secondary)' }}
              tickFormatter={(v) => `₴${(v / 1000).toFixed(0)}k`}
              dx={-5}
            />
            <Tooltip content={<TxTooltip />} />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
