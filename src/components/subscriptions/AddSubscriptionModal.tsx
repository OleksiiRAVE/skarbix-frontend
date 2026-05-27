import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { IconPicker } from '@/components/shared/IconPicker';
import { createSubscription, updateSubscription } from '@/lib/mock-api/api';
import type { Account, Category, Subscription } from '@/types';
import { useTranslation } from 'react-i18next';

interface AddSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  subscription?: Subscription | null;
  accounts: Account[];
  categories: Category[];
}

const getDefaultForm = (subscription?: Subscription | null, categories: Category[] = []) => ({
  name: subscription?.name || '',
  amount: subscription?.amount ? String(subscription.amount) : '',
  period: subscription?.period || 'monthly' as Subscription['period'],
  nextPaymentOn: subscription?.nextPaymentOn || new Date().toISOString().slice(0, 10),
  accountId: subscription?.accountId || '',
  categoryId: subscription?.categoryId || categories.find((category) => category.templateKey === 'subscriptions')?.id || '',
  color: subscription?.color || '#8B5CF6',
  icon: subscription?.icon || 'lucide:repeat',
  notes: subscription?.notes || '',
});

export function AddSubscriptionModal({
  open,
  onOpenChange,
  onSuccess,
  subscription,
  accounts,
  categories,
}: AddSubscriptionModalProps) {
  const { t } = useTranslation();
  const isEdit = !!subscription;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(getDefaultForm(subscription, categories));

  useEffect(() => {
    if (open) setForm(getDefaultForm(subscription, categories));
  }, [open, subscription, categories]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Subscription name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        amount: Number(form.amount || 0),
        period: form.period,
        nextPaymentOn: form.nextPaymentOn,
        accountId: form.accountId || undefined,
        categoryId: form.categoryId || undefined,
        color: form.color,
        icon: form.icon,
        notes: form.notes,
      };
      if (isEdit && subscription) {
        await updateSubscription(subscription.id, payload);
      } else {
        await createSubscription(payload);
      }
      toast.success(isEdit ? 'Subscription updated' : 'Subscription added');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save subscription');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryName = (category: Category) => (
    category.templateKey ? t(`systemCategories.${category.templateKey}`, { defaultValue: category.name }) : category.name
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)] bg-[var(--sk-card)]">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[var(--sk-text)] text-center">
            {isEdit ? 'Edit subscription' : 'Add subscription'}
          </DialogTitle>
        </div>

        <div className="px-6 sm:px-8 space-y-5 max-h-[64vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">Name</Label>
            <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Netflix, Spotify..." className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">Amount</Label>
              <Input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} placeholder="0.00" className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">Next payment</Label>
              <Input type="date" value={form.nextPaymentOn} onChange={(event) => setForm((current) => ({ ...current, nextPaymentOn: event.target.value }))} className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">Period</Label>
              <Select value={form.period} onValueChange={(value) => setForm((current) => ({ ...current, period: value as Subscription['period'] }))}>
                <SelectTrigger className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4" style={{ width: '100%' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">Account</Label>
              <Select value={form.accountId || 'none'} onValueChange={(value) => setForm((current) => ({ ...current, accountId: value === 'none' ? '' : value }))}>
                <SelectTrigger className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4" style={{ width: '100%' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No account</SelectItem>
                  {accounts.map((account) => <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">Category</Label>
            <Select value={form.categoryId || 'none'} onValueChange={(value) => setForm((current) => ({ ...current, categoryId: value === 'none' ? '' : value }))}>
              <SelectTrigger className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4" style={{ width: '100%' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((category) => <SelectItem key={category.id} value={category.id}>{getCategoryName(category)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-12 rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] flex items-center justify-center gap-2">
                  <Icon icon={form.icon} className="w-5 h-5" />
                  <span className="text-xs text-[var(--sk-text-secondary)]">Icon</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 bg-[var(--sk-card)] border-[var(--sk-border)] shadow-xl">
                <IconPicker value={form.icon} onChange={(icon) => setForm((current) => ({ ...current, icon }))} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-12 rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full" style={{ backgroundColor: form.color }} />
                  <span className="text-xs text-[var(--sk-text-secondary)]">{form.color.toUpperCase()}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-3 bg-[var(--sk-card)] border-[var(--sk-border)] shadow-xl">
                <ColorPicker value={form.color} onChange={(color) => setForm((current) => ({ ...current, color }))} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-4 flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-11 rounded-full border-[var(--sk-border)] text-sm font-medium text-[var(--sk-text)]">Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="flex-1 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium">
            {saving ? 'Saving...' : isEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
