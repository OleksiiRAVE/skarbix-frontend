import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Bell, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardSkeleton } from '@/components/skeletons';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { fetchDebts, createDebt, markDebtPaid } from '@/lib/mock-api/api';
import type { Debt } from '@/types';

type TabKey = 'owed_to_me' | 'i_owe' | 'settled';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'owed_to_me', label: 'People Owe Me' },
  { key: 'i_owe', label: 'I Owe People' },
  { key: 'settled', label: 'Settled' },
];

const statusColors: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: Clock },
  overdue: { bg: 'bg-red-500/10', text: 'text-red-500', icon: Bell },
  paid: { bg: 'bg-green-500/10', text: 'text-green-500', icon: CheckCircle },
};

const avatarColors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'];

export default function DebtsPage() {
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('owed_to_me');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<Debt | null>(null);
  const [formData, setFormData] = useState({
    personName: '', amount: '', direction: 'owed_to_me' as 'owed_to_me' | 'i_owe',
    dueDate: '', notes: '',
  });

  useEffect(() => {
    fetchDebts().then((d) => { setDebts(d); setLoading(false); });
  }, []);

  const filteredDebts = debts.filter((d) => {
    if (activeTab === 'settled') return d.status === 'paid';
    if (activeTab === 'owed_to_me') return d.direction === 'owed_to_me' && d.status !== 'paid';
    return d.direction === 'i_owe' && d.status !== 'paid';
  });

  const handleCreate = async () => {
    await createDebt({
      personName: formData.personName,
      amount: parseFloat(formData.amount),
      direction: formData.direction,
      dueDate: formData.dueDate || undefined,
      notes: formData.notes,
    });
    const updated = await fetchDebts();
    setDebts(updated);
    toast.success('Debt added successfully');
    setModalOpen(false);
    setFormData({ personName: '', amount: '', direction: 'owed_to_me', dueDate: '', notes: '' });
  };

  const handleMarkPaid = async () => {
    if (!confirmModal) return;
    await markDebtPaid(confirmModal.id);
    const updated = await fetchDebts();
    setDebts(updated);
    toast.success(`${confirmModal.personName}'s debt marked as paid`);
    setConfirmModal(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)]">Debts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)] tracking-tight">Debts</h1>
          <p className="text-[var(--sk-text-secondary)] mt-1 text-sm">Track money owed between you and others</p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="h-9 sm:h-10 bg-black hover:bg-black/90 text-white rounded-full px-3 sm:px-5 text-xs sm:text-sm self-start"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
          <span className="hidden sm:inline">Add Debt</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 bg-[var(--sk-card)] rounded-full p-1 w-fit border border-[var(--sk-border)] shadow-sm overflow-x-auto scrollbar-hide"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
              activeTab === tab.key ? 'text-white' : 'text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]'
            }`}
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="debtTab"
                className="absolute inset-0 bg-[#8B5CF6] rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Debt Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredDebts.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center py-12 sm:py-16 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--sk-border-light)] flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--sk-text-secondary)]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)] mb-1">No debts here</h3>
              <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">All caught up! Add a debt to track it.</p>
            </div>
          ) : (
            filteredDebts.map((debt, i) => {
              const statusConfig = statusColors[debt.status] || statusColors.pending;
              const StatusIcon = statusConfig.icon;
              const colorIndex = debt.personName.charCodeAt(0) % avatarColors.length;
              const avatarColor = avatarColors[colorIndex];
              const initials = debt.personName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--sk-text)] truncate">{debt.personName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <StatusIcon className={`w-3 h-3 ${statusConfig.text}`} />
                        <span className={`text-[11px] sm:text-xs font-medium capitalize ${statusConfig.text}`}>{debt.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 sm:mb-3">
                    <p className={`text-xl sm:text-2xl font-bold tabular-nums ${
                      debt.direction === 'owed_to_me' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {debt.direction === 'owed_to_me' ? '+' : '-'}{formatCurrency(debt.amount)}
                    </p>
                  </div>

                  {debt.dueDate && debt.status !== 'paid' && (
                    <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)] mb-2">
                      Due: {formatDate(debt.dueDate)}
                    </p>
                  )}

                  {debt.notes && (
                    <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)] mb-2 sm:mb-3 line-clamp-2">{debt.notes}</p>
                  )}

                  {debt.status !== 'paid' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 sm:h-9 rounded-full border-[var(--sk-border)] text-[11px] sm:text-xs"
                      >
                        <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1" />
                        Remind
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setConfirmModal(debt)}
                        className="flex-1 h-8 sm:h-9 bg-green-500 hover:bg-green-600 text-white rounded-full text-[11px] sm:text-xs"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1" />
                        Mark Paid
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Debt Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[20px] sm:rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)]">
          <div className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-[var(--sk-border)]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold">Add Debt</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Person Name</Label>
              <Input
                placeholder="e.g. Sasha Petrov"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--sk-text-secondary)]">₴</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-10 sm:h-11 pl-8 rounded-xl border-[var(--sk-border)]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Direction</Label>
              <div className="flex rounded-xl border border-[var(--sk-border)] overflow-hidden h-10 sm:h-11">
                <button
                  onClick={() => setFormData({ ...formData, direction: 'owed_to_me' })}
                  className={`flex-1 text-xs sm:text-sm font-medium transition-colors ${
                    formData.direction === 'owed_to_me' ? 'bg-[#8B5CF6] text-white' : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]'
                  }`}
                >
                  They owe me
                </button>
                <button
                  onClick={() => setFormData({ ...formData, direction: 'i_owe' })}
                  className={`flex-1 text-xs sm:text-sm font-medium transition-colors ${
                    formData.direction === 'i_owe' ? 'bg-[#8B5CF6] text-white' : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]'
                  }`}
                >
                  I owe them
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Notes</Label>
              <Textarea
                placeholder="Add notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="rounded-xl border-[var(--sk-border)] min-h-[50px] sm:min-h-[60px] resize-none"
              />
            </div>
          </div>
          <div className="p-5 sm:p-6 pt-0 flex gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 h-10 sm:h-11 rounded-full border-[var(--sk-border)] text-xs sm:text-sm">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.personName || !formData.amount}
              className="flex-1 h-10 sm:h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-xs sm:text-sm"
            >
              Add Debt
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mark Paid Confirm */}
      <Dialog open={!!confirmModal} onOpenChange={() => setConfirmModal(null)}>
        <DialogContent className="sm:max-w-[360px] rounded-[20px] sm:rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)]">
          <div className="p-5 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)] mb-1">Mark as Paid?</h3>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mb-5 sm:mb-6">
              This will mark the debt with {confirmModal?.personName} as settled.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setConfirmModal(null)} className="flex-1 h-10 sm:h-11 rounded-full border-[var(--sk-border)] text-xs sm:text-sm">
                Cancel
              </Button>
              <Button onClick={handleMarkPaid} className="flex-1 h-10 sm:h-11 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs sm:text-sm">
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
