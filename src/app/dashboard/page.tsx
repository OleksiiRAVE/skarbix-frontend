import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BankCard } from '@/components/dashboard/BankCard';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { TransactionOverviewChart } from '@/components/dashboard/TransactionOverviewChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { DashboardSkeleton } from '@/components/skeletons';
import { getGreeting } from '@/lib/utils/format';
import {
  fetchAccounts,
  fetchTransactions,
  fetchCashFlow,
  fetchTransactionOverview,
} from '@/lib/mock-api/api';
import type { Account, Transaction, CashFlowData, TransactionOverviewData } from '@/types';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowData[]>([]);
  const [txOverview, setTxOverview] = useState<TransactionOverviewData[]>([]);

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
  const balance = primaryAccount?.balance || 124580.40;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--sk-text)] tracking-tight">
            {getGreeting()}, Artem 👋
          </h1>
          <p className="text-[var(--sk-text-secondary)] mt-1.5 text-sm sm:text-[15px]">
            Welcome to Skarbix. Here's your smart financial summary.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            to="/settings"
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] bg-[var(--sk-card)] rounded-full border border-[var(--sk-border)] hover:border-[var(--sk-border)] transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Manage Balance</span>
            <span className="sm:hidden">Balance</span>
          </Link>
          <Link to="/transactions">
            <Button className="h-9 sm:h-10 bg-black hover:bg-black/90 text-white rounded-full text-xs sm:text-sm font-medium px-3 sm:px-5 transition-all active:scale-[0.98]">
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">New Transaction</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Left Column - full width on mobile, 2/5 on desktop */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <BankCard />
          <BalanceCard balance={balance} change={4.51} changeAmount={4499} />
          <CashFlowChart data={cashFlow} />
        </div>

        {/* Right Column - full width on mobile, 3/5 on desktop */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <TransactionOverviewChart data={txOverview} />
          <RecentActivity transactions={transactions} />
          <AIInsightCard />
        </div>
      </div>
    </div>
  );
}
