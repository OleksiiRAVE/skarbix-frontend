import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Landmark, CreditCard, PiggyBank, TrendingUp } from 'lucide-react';
import { CardSkeleton } from '@/components/skeletons';
import { formatCurrency } from '@/lib/utils/format';
import { fetchAccounts } from '@/lib/mock-api/api';
import type { Account } from '@/types';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  checking: Landmark,
  card: CreditCard,
  savings: PiggyBank,
  investment: TrendingUp,
};

const typeColors: Record<string, string> = {
  checking: 'bg-blue-500/10 text-blue-500',
  card: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
  savings: 'bg-green-500/10 text-green-500',
  investment: 'bg-amber-500/10 text-amber-500',
};

export default function AccountsPage() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetchAccounts().then((data) => {
      setAccounts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Accounts</h1></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">Accounts</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">{accounts.length} accounts connected</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F0F0F] hover:bg-[#1F1F1F] text-white rounded-full text-sm font-medium transition-all w-fit">
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      {/* Total */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm">
        <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mb-1">Total Balance</p>
        <p className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)]">{formatCurrency(totalBalance)}</p>
      </motion.div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {accounts.map((account, i) => {
          const Icon = typeIcons[account.type] || Wallet;
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-[var(--sk-border)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[account.type] || 'bg-[var(--sk-border-light)]'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--sk-text)] truncate">{account.name}</p>
                  <p className="text-xs text-[var(--sk-text-secondary)] capitalize">{account.type}</p>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[var(--sk-text)]">{formatCurrency(account.balance)}</p>
              <p className="text-[11px] text-[var(--sk-text-secondary)] mt-1">{account.number}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
