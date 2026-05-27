import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Repeat, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/skeletons';
import { AddSubscriptionModal } from '@/components/subscriptions/AddSubscriptionModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  deleteSubscription,
  fetchAccounts,
  fetchCategories,
  fetchSubscriptions,
} from '@/lib/mock-api/api';
import { formatCurrency } from '@/lib/utils/format';
import type { Account, Category, Subscription } from '@/types';

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Subscription[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSubscription, setEditSubscription] = useState<Subscription | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);

  const loadData = async () => {
    const [subs, accs, cats] = await Promise.all([
      fetchSubscriptions(),
      fetchAccounts(),
      fetchCategories(),
    ]);
    setItems(subs);
    setAccounts(accs);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSubscriptions(), fetchAccounts(), fetchCategories()]).then(([subs, accs, cats]) => {
      if (cancelled) return;
      setItems(subs);
      setAccounts(accs);
      setCategories(cats);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalMonthly = items.reduce((sum, item) => {
    if (item.period === 'weekly') return sum + item.amount * 4.345;
    if (item.period === 'yearly') return sum + item.amount / 12;
    return sum + item.amount;
  }, 0);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubscription(deleteTarget.id);
      toast.success('Subscription deleted');
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete subscription');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-[var(--sk-text)]">Subscriptions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((item) => <CardSkeleton key={item} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">Subscriptions</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">{items.length} active subscriptions</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="h-9 sm:h-10 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full px-3 sm:px-5 text-xs sm:text-sm w-fit">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
          Add Subscription
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">Monthly total</p>
            <p className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">{formatCurrency(totalMonthly)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">Yearly total</p>
            <p className="text-lg sm:text-xl font-semibold text-[var(--sk-text)]">{formatCurrency(totalMonthly * 12)}</p>
          </div>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-[280px] rounded-[20px] border border-dashed border-[var(--sk-border)] bg-[var(--sk-card)] flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-4">
            <Repeat className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">No subscriptions yet</h2>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-1 max-w-[360px]">Track recurring payments like Netflix, Spotify, hosting, tools and mobile plans.</p>
          <Button onClick={() => setModalOpen(true)} className="mt-5 h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium px-5">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Subscription
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {items.map((sub, i) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-[var(--sk-card)] rounded-[14px] sm:rounded-[16px] p-3 sm:p-4 border border-[var(--sk-border)] shadow-sm flex items-center gap-3 sm:gap-4 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sub.color || '#8B5CF6'}15`, color: sub.color || '#8B5CF6' }}>
                <Icon icon={sub.icon || 'lucide:repeat'} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--sk-text)] truncate">{sub.name}</p>
                <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)]">Next: {sub.nextPaymentOn}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[var(--sk-text)]">{formatCurrency(sub.amount)}</p>
                <p className="text-[10px] sm:text-xs text-[var(--sk-text-secondary)] capitalize">/{sub.period}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditSubscription(sub); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)]"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteTarget(sub)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--sk-text-secondary)] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddSubscriptionModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditSubscription(null);
        }}
        onSuccess={loadData}
        subscription={editSubscription}
        accounts={accounts}
        categories={categories}
      />
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[var(--sk-card)] text-[var(--sk-text)] border-[var(--sk-border)] rounded-[20px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscription?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--sk-text-secondary)]">
              This will remove {deleteTarget?.name} from active subscriptions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-[var(--sk-border)] text-[var(--sk-text)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-full bg-red-500 text-white hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
