import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Info, Pencil, Wallet } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/skeletons';
import { AddAccountModal } from '@/components/accounts/AddAccountModal';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils/format';
import { fetchAccounts } from '@/lib/mock-api/api';
import type { Account } from '@/types';

const typeColors: Record<string, string> = {
  cash: 'bg-blue-500/10 text-blue-500',
  checking: 'bg-blue-500/10 text-blue-500',
  card: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
  savings: 'bg-green-500/10 text-green-500',
  investment: 'bg-amber-500/10 text-amber-500',
  other: 'bg-slate-500/10 text-slate-500',
};

export default function AccountsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);

  const loadAccounts = async () => {
    const data = await fetchAccounts();
    setAccounts(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    fetchAccounts().then((data) => {
      if (cancelled) return;
      setAccounts(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEdit = (account: Account) => {
    setEditAccount(account);
    setModalOpen(true);
  };

  const handleModalChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditAccount(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--sk-text)]">{t('sidebar.accounts')}</h1>
        </div>
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">{t('sidebar.accounts')}</h1>
            <UITooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded-lg hover:bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)] transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[280px] text-xs">
                {t('dashboard.accountsTooltip')}
              </TooltipContent>
            </UITooltip>
          </div>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">
            {accounts.length} {t('accounts.count', { count: accounts.length })}
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="h-9 sm:h-10 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full px-3 sm:px-5 text-xs sm:text-sm"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
          <span className="hidden sm:inline">{t('addAccount.title')}</span>
          <span className="sm:hidden">{t('general.add')}</span>
        </Button>
      </div>

      {/* Total */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm"
      >
        <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mb-1">{t('dashboard.totalBalance')}</p>
        <p className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)]">{formatCurrency(totalBalance)}</p>
      </motion.div>

      {accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[280px] rounded-[20px] border border-dashed border-[var(--sk-border)] bg-[var(--sk-card)] flex flex-col items-center justify-center text-center px-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">{t('accounts.emptyTitle')}</h2>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-1 max-w-[360px]">
            {t('accounts.emptySubtitle')}
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            className="mt-5 h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium px-5"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('addAccount.title')}
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {accounts.map((account, i) => {
          const iconStyle = account.color
            ? { backgroundColor: `${account.color}18`, color: account.color }
            : undefined;
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-[var(--sk-border)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${account.color ? '' : typeColors[account.type] || 'bg-[var(--sk-border-light)]'}`}
                  style={iconStyle}
                >
                  <Icon icon={account.icon || 'lucide:wallet'} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--sk-text)] truncate">{account.name}</p>
                  <p className="text-xs text-[var(--sk-text-secondary)] capitalize">{account.type}</p>
                </div>
                <button
                  onClick={() => handleEdit(account)}
                  className="ml-auto h-8 w-8 rounded-lg flex shrink-0 items-center justify-center hover:bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)] transition-colors"
                  title={t('general.edit')}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[var(--sk-text)]">{formatCurrency(account.balance)}</p>
              {account.number && (
                <p className="text-[11px] text-[var(--sk-text-secondary)] mt-1">{account.number}</p>
              )}
            </motion.div>
          );
          })}
        </div>
      )}

      <AddAccountModal
        open={modalOpen}
        onOpenChange={handleModalChange}
        onSuccess={loadAccounts}
        account={editAccount}
      />
    </div>
  );
}
