import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { formatCurrencyShort } from '@/lib/utils/format';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info, LineChart as LineChartIcon } from 'lucide-react';import type { CashFlowData } from '@/types';
import type { TooltipProps } from 'recharts';

function CashFlowTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--sk-card)] border border-[var(--sk-border)] rounded-xl px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-[var(--sk-text-secondary)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--sk-text)]">
        ₴{Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

type TabKey = 'income' | 'expense' | 'savings';

const tabColors: Record<TabKey, string> = {
  income: '#8B5CF6',
  expense: '#F59E0B',
  savings: '#10B981',
};

const tabGradients: Record<TabKey, [string, string]> = {
  income: ['#8B5CF6', 'rgba(139,92,246,0.05)'],
  expense: ['#F59E0B', 'rgba(245,158,11,0.05)'],
  savings: ['#10B981', 'rgba(16,185,129,0.05)'],
};

interface CashFlowChartProps {
  data: CashFlowData[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('income');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'income', label: t('dashboard.income') },
    { key: 'expense', label: t('dashboard.expense') },
    { key: 'savings', label: t('dashboard.savings') },
  ];

  const total = data.reduce((sum, d) => sum + d[activeTab], 0);
  const hasData = data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[var(--sk-text)]">{t('dashboard.cashFlow')}</h3>
            <UITooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded-full text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[260px] text-xs">
                {t('dashboard.cashFlowTooltip')}
              </TooltipContent>
            </UITooltip>
          </div>
          <p className="text-[28px] font-bold text-[var(--sk-text)] tabular-nums mt-1">
            ₴{formatCurrencyShort(total)}
          </p>
        </div>
        <div className="flex gap-1 bg-[var(--sk-border-light)] rounded-full p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
                activeTab === tab.key ? 'text-white' : 'text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]'
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="cashflowTab"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: tabColors[tab.key] }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tabGradients[activeTab][0]} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={tabGradients[activeTab][1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--sk-border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--sk-text-secondary)' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--sk-text-secondary)' }} tickFormatter={(v) => `₴${formatCurrencyShort(v)}`} dx={-5} />
              <Tooltip content={<CashFlowTooltip />} />
              <ReferenceLine x="Jul" stroke="#F59E0B" strokeWidth={2} strokeDasharray="0" />
              <Area type="monotone" dataKey={activeTab} stroke={tabGradients[activeTab][0]} strokeWidth={2.5} fill={`url(#grad-${activeTab})`} dot={false} activeDot={{ r: 5, fill: tabGradients[activeTab][0], stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[260px] rounded-2xl border border-dashed border-[var(--sk-border)] bg-[var(--sk-border-light)]/50 flex flex-col items-center justify-center text-center px-6">
          <LineChartIcon className="w-8 h-8 text-[var(--sk-text-secondary)] mb-3" />
          <p className="text-sm font-semibold text-[var(--sk-text)]">{t('dashboard.noChartData')}</p>
          <p className="text-xs text-[var(--sk-text-secondary)] mt-1 max-w-[260px]">{t('dashboard.noChartDataSubtitle')}</p>
        </div>
      )}
    </motion.div>
  );
}
