import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { TransactionOverviewChart } from '@/components/dashboard/TransactionOverviewChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { DashboardSkeleton } from '@/components/skeletons';
import { useAppStore } from '@/store';
import {
  fetchAccounts,
  fetchTransactions,
  fetchCashFlow,
  fetchTransactionOverview,
} from '@/lib/mock-api/api';
import type { Account, Transaction, CashFlowData, TransactionOverviewData } from '@/types';

const getGreetingText = (t: (key: string) => string): string => {
  const hour = new Date().getHours();
  if (hour < 6) return t('dashboard.greetingNight');
  if (hour < 12) return t('dashboard.greetingMorning');
  if (hour < 18) return t('dashboard.greetingAfternoon');
  return t('dashboard.greetingEvening');
};

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const user = useAppStore((s) => s.user);
  const userName = user?.name?.split(' ')[0] || 'there';
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowData[]>([]);
  const [txOverview, setTxOverview] = useState<TransactionOverviewData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [accRes, txRes, cfRes, toRes] = await Promise.all([
          fetchAccounts(),
          fetchTransactions({ limit: 10 }),
          fetchCashFlow(),
          fetchTransactionOverview(),
        ]);
        setAccounts(accRes);
        setTransactions(txRes.transactions);
        setCashFlow(cfRes);
        setTxOverview(toRes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    load();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const primaryAccount = accounts.find((a) => a.type === 'card') || accounts[0];
  const balance = primaryAccount?.balance || 0;
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 key={i18n.language} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--sk-text)] tracking-tight">
            {getGreetingText(t)}, {userName} 👋
          </h1>
          <p className="text-[var(--sk-text-secondary)] mt-1.5 text-sm sm:text-[15px]">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => setModalOpen(true)} className="h-9 sm:h-10 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full text-xs sm:text-sm font-medium px-3 sm:px-5 transition-all active:scale-[0.98]">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">{t('dashboard.newTransaction')}</span>
            <span className="sm:hidden">{t('dashboard.newTransaction')}</span>
          </Button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <BalanceCard
            balance={balance}
            change={0}
            changeAmount={0}
            income={income}
            incomeChange={0}
            incomeChangeAmount={0}
            expense={expense}
            expenseChange={0}
            expenseChangeAmount={0}
          />
          <CashFlowChart data={cashFlow} />
        </div>

        <TransactionOverviewChart data={txOverview} />

        <RecentActivity transactions={transactions} />
      </div>

      <AddTransactionModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
