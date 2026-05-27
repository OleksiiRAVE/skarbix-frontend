import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info, LineChart as LineChartIcon } from 'lucide-react';
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
  const { t } = useTranslation();
  const hasData = data.length > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-[var(--sk-text)]">{t('dashboard.transactionOverview')}</h3>
        <UITooltip>
          <TooltipTrigger asChild>
            <button className="p-1 rounded-full text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[280px] text-xs">
            {t('dashboard.transactionOverviewTooltip')}
          </TooltipContent>
        </UITooltip>
      </div>

      {hasData ? (
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
                  const today = new Date().getDate();
                  return d.getDate() === 1 || d.getDate() === today ? `${d.getDate()} May` : '';
                }}
                dy={8}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--sk-text-secondary)' }} tickFormatter={(v) => `₴${(v / 1000).toFixed(0)}k`} dx={-5} />
              <Tooltip content={<TxTooltip />} />
              <Line type="monotone" dataKey="current" stroke="#8B5CF6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="previous" stroke="#F59E0B" strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 4, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[240px] rounded-2xl border border-dashed border-[var(--sk-border)] bg-[var(--sk-border-light)]/50 flex flex-col items-center justify-center text-center px-6">
          <LineChartIcon className="w-8 h-8 text-[var(--sk-text-secondary)] mb-3" />
          <p className="text-sm font-semibold text-[var(--sk-text)]">{t('dashboard.noTransactionData')}</p>
          <p className="text-xs text-[var(--sk-text-secondary)] mt-1 max-w-[280px]">{t('dashboard.noTransactionDataSubtitle')}</p>
        </div>
      )}
    </motion.div>
  );
}
