import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Plus, Search, Download, ChevronLeft, ChevronRight,
  Eye, X, SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TableSkeleton } from '@/components/skeletons';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { TransactionFilterSheet, type FilterState } from '@/components/transactions/TransactionFilterSheet';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { fetchTransactions } from '@/lib/mock-api/api';
import { mockTransactions } from '@/lib/mock-api/data';
import type { Transaction } from '@/types';

const CC: Record<string, string> = {
  'Food & Drinks': '#F59E0B', 'Transport': '#8B5CF6', 'Shopping': '#EC4899',
  'Entertainment': '#10B981', 'Bills': '#EF4444', 'Health': '#06B6D4',
  'Income': '#10B981', 'Taxi': '#F97316', 'Groceries': '#84CC16', 'Subscriptions': '#6366F1',
};

const defaultFilters: FilterState = {
  type: 'all',
  accounts: [],
  categories: [],
  amountMin: '',
  amountMax: '',
  dateFrom: '',
  dateTo: '',
};

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const res = await fetchTransactions({ limit: 10 });
        if (!mounted) return;
        setTransactions(res.transactions);
      } catch {
        if (mounted) {
          setTransactions(mockTransactions.slice(0, 10));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const handleSearch = async (val: string) => {
    setSearch(val);
    try {
      const res = await fetchTransactions({ search: val, limit: 10 });
      setTransactions(res.transactions);
    } catch {
      const filtered = mockTransactions.filter((t) =>
        t.merchant.toLowerCase().includes(val.toLowerCase()) ||
        t.category.toLowerCase().includes(val.toLowerCase())
      );
      setTransactions(filtered.slice(0, 10));
    }
  };

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (tx) =>
          tx.merchant.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q)
      );
    }

    // Type
    if (filters.type !== 'all') {
      data = data.filter((tx) => tx.type === filters.type);
    }

    // Accounts
    if (filters.accounts.length > 0) {
      data = data.filter((tx) => tx.accountId && filters.accounts.includes(tx.accountId));
    }

    // Categories
    if (filters.categories.length > 0) {
      data = data.filter((tx) => filters.categories.includes(tx.categoryId));
    }

    // Amount
    if (filters.amountMin) {
      const min = parseFloat(filters.amountMin);
      data = data.filter((tx) => tx.amount >= min);
    }
    if (filters.amountMax) {
      const max = parseFloat(filters.amountMax);
      data = data.filter((tx) => tx.amount <= max);
    }

    // Date range
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      data = data.filter((tx) => new Date(tx.date).getTime() >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo).getTime();
      data = data.filter((tx) => new Date(tx.date).getTime() <= to);
    }

    return data;
  }, [transactions, search, filters]);

  const filteredTotal = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / 10));

  const activeFilterCount = [
    filters.type !== 'all',
    filters.accounts.length > 0,
    filters.categories.length > 0,
    filters.amountMin || filters.amountMax,
    filters.dateFrom || filters.dateTo,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)] tracking-tight">{t('transactions.title')}</h1>
          <p className="text-[var(--sk-text-secondary)] mt-1 text-sm">{t('transactions.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" className="h-9 sm:h-10 rounded-full border-[var(--sk-border)] text-[var(--sk-text-secondary)] text-xs sm:text-sm">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">{t('transactions.exportCsv')}</span>
            <span className="sm:hidden">{t('transactions.export')}</span>
          </Button>
          <Button onClick={() => setModalOpen(true)} className="h-9 sm:h-10 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full px-3 sm:px-5 text-xs sm:text-sm">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">{t('transactions.addTransaction')}</span>
            <span className="sm:hidden">{t('transactions.add')}</span>
          </Button>
        </div>
      </motion.div>

      {/* Search + Filter */}
      <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-3 sm:p-4 border border-[var(--sk-border)] shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sk-text-secondary)]" />
            <Input placeholder={t('transactions.searchPlaceholder')} value={search} onChange={(e) => handleSearch(e.target.value)} className="h-10 sm:h-11 pl-9 rounded-full border-[var(--sk-border)] bg-transparent text-[var(--sk-text)]" />
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="relative flex items-center gap-1.5 h-10 sm:h-11 px-3 sm:px-4 rounded-full border border-[var(--sk-border)] text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all text-xs sm:text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{t('filter.title')}</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#8B5CF6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-4 sm:p-6"><TableSkeleton rows={5} /></div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-px">
              <table className="w-full min-w-[640px]">
                <thead><tr className="border-b border-[var(--sk-border)]">
                  <th className="text-left px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider">{t('transactions.merchant')}</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider hidden sm:table-cell">{t('transactions.category')}</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider hidden md:table-cell">{t('transactions.date')}</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider">{t('transactions.amount')}</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider hidden sm:table-cell">{t('transactions.actions')}</th>
                </tr></thead>
                <tbody>{filteredTransactions.map((tx) => {
                  const c = CC[tx.category] || '#8B5CF6';
                  return (
                    <tr key={tx.id} className="border-b border-[var(--sk-border-light)] hover:bg-[var(--sk-border-light)]/50 transition-colors cursor-pointer group" onClick={() => { setSelectedTx(tx); setDrawerOpen(true); }}>
                      <td className="px-4 sm:px-6 py-3"><div className="flex items-center gap-2.5 sm:gap-3"><div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0" style={{ backgroundColor: c }}>{tx.merchant.charAt(0)}</div><div className="min-w-0"><p className="text-sm font-medium text-[var(--sk-text)] truncate">{tx.merchant}</p><p className="text-xs text-[var(--sk-text-secondary)] truncate">{tx.description}</p></div></div></td>
                      <td className="px-4 sm:px-6 py-3 hidden sm:table-cell"><span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium" style={{ backgroundColor: `${c}15`, color: c }}>{tx.category}</span></td>
                      <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-[var(--sk-text-secondary)] hidden md:table-cell">{formatDate(tx.date)}</td>
                      <td className="px-4 sm:px-6 py-3 text-right"><span className={`text-sm font-semibold tabular-nums ${tx.type === 'income' ? 'text-green-500' : 'text-[var(--sk-text)]'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</span></td>
                      <td className="px-4 sm:px-6 py-3 hidden sm:table-cell"><div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); setDrawerOpen(true); }} className="p-1.5 rounded-lg hover:bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)]"><Eye className="w-3.5 h-3.5" /></button></div></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[var(--sk-border)]">
              <p className="text-xs text-[var(--sk-text-secondary)] order-2 sm:order-1">{t('transactions.showing', { from: ((page - 1) * 10) + 1, to: Math.min(page * 10, filteredTotal), total: filteredTotal })}</p>
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button disabled={page === 1} className="p-2 rounded-lg hover:bg-[var(--sk-border-light)] disabled:opacity-30 text-[var(--sk-text-secondary)]"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => <button key={i} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === i + 1 ? 'bg-[#8B5CF6] text-white' : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]'}`}>{i + 1}</button>)}
                <button disabled={page === totalPages} className="p-2 rounded-lg hover:bg-[var(--sk-border-light)] disabled:opacity-30 text-[var(--sk-text-secondary)]"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddTransactionModal open={modalOpen} onOpenChange={setModalOpen} />

      <TransactionFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      {/* Detail Sheet */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-[420px] p-0 bg-[var(--sk-card)] border-0 rounded-l-[20px] sm:rounded-l-none border-l border-[var(--sk-border)]">
          {selectedTx && (
            <>
              <SheetHeader className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-[var(--sk-border)]">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">{t('transactions.transactionDetails')}</SheetTitle>
                  <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--sk-border-light)]"><X className="w-4 h-4 text-[var(--sk-text-secondary)]" /></button>
                </div>
              </SheetHeader>
              <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-lg sm:text-xl font-bold" style={{ backgroundColor: CC[selectedTx.category] || '#8B5CF6' }}>{selectedTx.merchant.charAt(0)}</div>
                  <p className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">{selectedTx.type === 'income' ? '+' : '-'}{formatCurrency(selectedTx.amount)}</p>
                  <p className="text-sm text-[var(--sk-text-secondary)] mt-1">{selectedTx.merchant}</p>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  {[{ label: t('transactions.date'), value: formatDate(selectedTx.date) }, { label: t('transactions.category'), value: selectedTx.category }, { label: 'Source', value: selectedTx.source === 'monobank' ? t('transactions.sourceMonobank') : selectedTx.source === 'ai' ? t('transactions.sourceAI') : t('transactions.sourceManual') }, { label: 'Type', value: selectedTx.type === 'income' ? t('transactions.typeIncome') : t('transactions.typeExpense') }, { label: 'Description', value: selectedTx.description || '—' }, { label: 'Notes', value: selectedTx.notes || '—' }].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-[var(--sk-border-light)]"><span className="text-sm text-[var(--sk-text-secondary)]">{item.label}</span><span className="text-sm font-medium text-[var(--sk-text)]">{item.value}</span></div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setDrawerOpen(false); toast.success('Deleted'); }} className="flex-1 h-10 sm:h-11 rounded-full border-red-200 text-red-400 hover:bg-red-500/10 text-xs sm:text-sm">{t('transactions.delete')}</Button>
                  <Button className="flex-1 h-10 sm:h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-xs sm:text-sm">{t('transactions.edit')}</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
