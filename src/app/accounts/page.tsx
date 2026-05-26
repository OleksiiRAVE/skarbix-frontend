import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Building2, CircleDollarSign, CreditCard, Landmark, Plus, PiggyBank, TrendingUp, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/skeletons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils/format';
import { createAccount, fetchAccounts } from '@/lib/mock-api/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Account } from '@/types';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cash: Banknote,
  bank: Landmark,
  checking: Landmark,
  card: CreditCard,
  savings: PiggyBank,
  investment: TrendingUp,
  other: Wallet,
};

const typeColors: Record<string, string> = {
  cash: 'bg-blue-500/10 text-blue-500',
  bank: 'bg-blue-500/10 text-blue-500',
  checking: 'bg-blue-500/10 text-blue-500',
  card: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
  savings: 'bg-green-500/10 text-green-500',
  investment: 'bg-amber-500/10 text-amber-500',
  other: 'bg-slate-500/10 text-slate-500',
};

const accountTypes: { value: Account['type']; label: string; icon: typeof Wallet }[] = [
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'bank', label: 'Bank', icon: Landmark },
  { value: 'savings', label: 'Savings', icon: PiggyBank },
  { value: 'investment', label: 'Investment', icon: TrendingUp },
  { value: 'other', label: 'Other', icon: Wallet },
];

const iconOptions = [
  { value: 'card', icon: CreditCard },
  { value: 'cash', icon: Banknote },
  { value: 'bank', icon: Landmark },
  { value: 'wallet', icon: Wallet },
  { value: 'savings', icon: PiggyBank },
  { value: 'capital', icon: CircleDollarSign },
  { value: 'business', icon: Building2 },
];

const colorOptions = ['#8B5CF6', '#2563EB', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#0F172A'];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  card: CreditCard,
  cash: Banknote,
  bank: Landmark,
  wallet: Wallet,
  savings: PiggyBank,
  capital: CircleDollarSign,
  business: Building2,
};

export default function AccountsPage() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: 'Primary Card',
    type: 'card' as Account['type'],
    balance: '',
    icon: 'card',
    color: '#8B5CF6',
  });

  useEffect(() => {
    fetchAccounts().then((data) => {
      setAccounts(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error('Account name is required');
      return;
    }

    setSaving(true);
    try {
      const account = await createAccount({
        name: form.name.trim(),
        type: form.type,
        balance: Number(form.balance || 0),
        icon: form.icon,
        color: form.color,
      });
      setAccounts((current) => [account, ...current]);
      setModalOpen(false);
      setForm({ name: 'Primary Card', type: 'card', balance: '', icon: 'card', color: '#8B5CF6' });
      toast.success('Account added');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not add account';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

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
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#0F0F0F] hover:bg-[#1F1F1F] text-white rounded-full text-sm font-medium transition-all w-fit">
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
          const Icon = iconMap[account.icon || ''] || typeIcons[account.type] || Wallet;
          const iconStyle = account.color ? { backgroundColor: `${account.color}18`, color: account.color } : undefined;
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-[var(--sk-border)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${account.color ? '' : typeColors[account.type] || 'bg-[var(--sk-border-light)]'}`} style={iconStyle}>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)]">
          <div className="p-6 border-b border-[var(--sk-border)]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add Account</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs text-[var(--sk-text-secondary)]">Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 rounded-xl border-[var(--sk-border)]" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[var(--sk-text-secondary)]">Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {accountTypes.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setForm((f) => ({ ...f, type: item.value, icon: item.value === 'bank' ? 'bank' : item.value }))}
                    className={`h-12 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      form.type === item.value ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'border-[var(--sk-border)] text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-[var(--sk-text-secondary)]">Icon</Label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setForm((f) => ({ ...f, icon: item.value }))}
                      className={`h-10 rounded-xl border flex items-center justify-center transition-all ${
                        form.icon === item.value ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'border-[var(--sk-border)] text-[var(--sk-text-secondary)]'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[var(--sk-text-secondary)]">Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setForm((f) => ({ ...f, color }))}
                      className={`h-10 rounded-xl border transition-all ${form.color === color ? 'border-[var(--sk-text)] scale-95' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[var(--sk-text-secondary)]">Starting Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--sk-text-secondary)]">₴</span>
                <Input type="number" min="0" step="0.01" value={form.balance} onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} placeholder="0.00" className="h-11 pl-8 rounded-xl border-[var(--sk-border)]" />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--sk-border)] p-4 flex items-center gap-3">
              {(() => {
                const PreviewIcon = iconMap[form.icon] || Wallet;
                return (
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${form.color}18`, color: form.color }}>
                    <PreviewIcon className="w-5 h-5" />
                  </div>
                );
              })()}
              <div className="min-w-0">
                <p className="font-semibold text-[var(--sk-text)] truncate">{form.name || 'New Account'}</p>
                <p className="text-xs text-[var(--sk-text-secondary)] capitalize">{form.type}</p>
              </div>
              <p className="ml-auto font-bold tabular-nums">{formatCurrency(Number(form.balance || 0))}</p>
            </div>

            <Button onClick={handleCreate} disabled={saving} className="w-full h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl">
              {saving ? 'Adding...' : 'Add Account'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
