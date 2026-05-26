import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';
import type { Transaction } from '@/types';

interface RecentActivityProps {
  transactions: Transaction[];
}

const categoryIconColors: Record<string, string> = {
  'Food & Drinks': '#F59E0B',
  'Transport': '#8B5CF6',
  'Shopping': '#EC4899',
  'Entertainment': '#10B981',
  'Bills': '#EF4444',
  'Health': '#06B6D4',
  'Income': '#10B981',
  'Taxi': '#F97316',
  'Groceries': '#84CC16',
  'Subscriptions': '#6366F1',
};

const categoryIcons: Record<string, string> = {
  'Stripe': 'S',
  'Cashback': 'C',
  'Amazon': 'a',
  'Silpo': 'S',
  'Bolt': 'B',
  'Uklon': 'U',
  'Rozetka': 'R',
  "McDonald's": 'M',
  'Spotify': 'S',
  'Netflix': 'N',
  'Nova Poshta': 'N',
  'Glovo': 'G',
  'Freelance': 'F',
  'Kyivstar': 'K',
  'Rent': 'R',
};

export function RecentActivity({ transactions }: RecentActivityProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm"
    >
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[var(--sk-text)]">{t('dashboard.recentActivity')}</h3>
      </div>

      {/* List */}
      <div className="space-y-0">
        {transactions.slice(0, 6).map((tx, i) => {
          const catColor = categoryIconColors[tx.category] || '#8B5CF6';
          const icon = categoryIcons[tx.merchant] || tx.merchant.charAt(0);
          const isIncome = tx.type === 'income';

          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
              className="flex items-center gap-3.5 py-3 border-b border-[var(--sk-border-light)] last:border-0 group cursor-pointer hover:bg-[var(--sk-border-light)]/50 -mx-3 px-3 rounded-xl transition-all duration-200"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
                style={{ backgroundColor: catColor }}
              >
                {icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-[var(--sk-text)] truncate">
                  {tx.merchant}
                </p>
                <p className="text-xs text-[var(--sk-text-secondary)]">
                  {tx.description || tx.category} · {formatRelativeTime(tx.date)}
                </p>
              </div>

              {/* Amount */}
              <span
                className={`text-[15px] font-semibold tabular-nums flex-shrink-0 ${
                  isIncome ? 'text-green-600' : 'text-[var(--sk-text)]'
                }`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <Link
        to="/transactions"
        className="flex items-center justify-center gap-2 mt-4 py-3 text-sm font-medium text-[var(--sk-text-secondary)] hover:text-[#8B5CF6] bg-[var(--sk-border-light)] rounded-xl transition-colors"
      >
        {t('dashboard.seeAllTransactions')}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}
