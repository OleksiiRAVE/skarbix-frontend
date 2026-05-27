import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import {
  CreditCard, Banknote, Landmark, PiggyBank, TrendingUp, Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { IconPicker } from '@/components/shared/IconPicker';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { createAccount, updateAccount } from '@/lib/mock-api/api';
import { formatCurrency } from '@/lib/utils/format';
import type { Account } from '@/types';

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  account?: Account | null;
}

const typeOptions: { value: Account['type']; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'card', labelKey: 'addAccount.typeCard', icon: CreditCard },
  { value: 'cash', labelKey: 'addAccount.typeCash', icon: Banknote },
  { value: 'checking', labelKey: 'addAccount.typeChecking', icon: Landmark },
  { value: 'savings', labelKey: 'addAccount.typeSavings', icon: PiggyBank },
  { value: 'investment', labelKey: 'addAccount.typeInvestment', icon: TrendingUp },
  { value: 'other', labelKey: 'addAccount.typeOther', icon: Wallet },
];

const defaultIcon = 'lucide:credit-card';

const accountTemplates: Array<{
  name: string;
  type: Account['type'];
  icon: string;
  color: string;
}> = [
  { name: 'Primary Card', type: 'card', icon: 'lucide:credit-card', color: '#8B5CF6' },
  { name: 'Mono', type: 'card', icon: 'lucide:landmark', color: '#111827' },
  { name: 'Cash', type: 'cash', icon: 'lucide:banknote', color: '#10B981' },
  { name: 'Savings', type: 'savings', icon: 'lucide:piggy-bank', color: '#3B82F6' },
  { name: 'Investment', type: 'investment', icon: 'lucide:trending-up', color: '#F59E0B' },
];

const getDefaultForm = (account?: Account | null) => ({
  name: account?.name || '',
  type: account?.type || 'card' as Account['type'],
  balance: account?.balance ? String(account.balance) : '',
  color: account?.color || '#8B5CF6',
  icon: account?.icon || defaultIcon,
});

export function AddAccountModal({ open, onOpenChange, onSuccess, account }: AddAccountModalProps) {
  const { t } = useTranslation();
  const isEdit = !!account;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(getDefaultForm(account));

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(getDefaultForm(account));
    }
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    setForm(getDefaultForm(account));
  }, [account]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error(t('addAccount.nameRequired'));
      return;
    }

    setSaving(true);
    try {
      if (isEdit && account) {
        await updateAccount(account.id, {
          name: form.name.trim(),
          type: form.type,
          balance: Number(form.balance || 0),
          icon: form.icon,
          color: form.color,
        });
      } else {
        await createAccount({
          name: form.name.trim(),
          type: form.type,
          balance: Number(form.balance || 0),
          icon: form.icon,
          color: form.color,
        });
      }
      toast.success(isEdit ? t('addAccount.toastUpdate') : t('addAccount.toastSuccess'));
      handleOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : t(isEdit ? 'addAccount.toastUpdateError' : 'addAccount.toastError');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const applyTemplate = (template: typeof accountTemplates[number]) => {
    setForm((current) => ({
      ...current,
      name: template.name,
      type: template.type,
      icon: template.icon,
      color: template.color,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)] bg-[var(--sk-card)]">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[var(--sk-text)] text-center">
            {isEdit ? t('addAccount.editTitle') : t('addAccount.title')}
          </DialogTitle>
        </div>

        <div className="px-6 sm:px-8 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addAccount.name')}</Label>
            <Input
              placeholder={t('addAccount.namePlaceholder')}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addAccount.type')}</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v as Account['type'] }))}
            >
              <SelectTrigger className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 py-0 leading-none" style={{ width: '100%' }}>
                <SelectValue placeholder={t('addAccount.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {t(item.labelKey)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Balance */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addAccount.balance')}</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--sk-text-secondary)]">₴</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.balance}
                onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))}
                className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] pl-8 pr-4"
              />
            </div>
          </div>

          {/* Icon + Color row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Icon Popover */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addAccount.icon')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-12 w-full rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] flex items-center justify-center gap-2 text-[var(--sk-text)] hover:bg-[var(--sk-border)] transition-colors">
                    <Icon icon={form.icon} className="w-5 h-5" />
                    <span className="text-xs text-[var(--sk-text-secondary)]">{t('addAccount.change')}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-[var(--sk-card)] border-[var(--sk-border)] shadow-xl" align="start">
                  <IconPicker value={form.icon} onChange={(icon) => setForm((f) => ({ ...f, icon }))} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Color Popover */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addAccount.color')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-12 w-full rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] flex items-center justify-center gap-2 text-[var(--sk-text)] hover:bg-[var(--sk-border)] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[var(--sk-border)]" style={{ backgroundColor: form.color }} />
                    <span className="text-xs text-[var(--sk-text-secondary)]">{form.color.toUpperCase()}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-3 bg-[var(--sk-card)] border-[var(--sk-border)] shadow-xl" align="end">
                  <ColorPicker value={form.color} onChange={(color) => setForm((f) => ({ ...f, color }))} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] p-4 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${form.color}18`, color: form.color }}
            >
              <Icon icon={form.icon} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--sk-text)] truncate">{form.name || t('addAccount.previewName')}</p>
              <p className="text-xs text-[var(--sk-text-secondary)] capitalize">{t(`addAccount.type${form.type.charAt(0).toUpperCase() + form.type.slice(1)}`)}</p>
            </div>
            <p className="ml-auto font-bold tabular-nums text-[var(--sk-text)]">{formatCurrency(Number(form.balance || 0))}</p>
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addAccount.templates')}</Label>
              <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]">
                {accountTemplates.map((template) => (
                  <button
                    key={`${template.name}-${template.type}`}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="shrink-0 h-8 rounded-full border border-[var(--sk-border)] bg-[var(--sk-border-light)] hover:bg-[var(--sk-border)] px-2.5 flex items-center gap-1.5 text-[11px] text-[var(--sk-text)] transition-colors"
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${template.color}18`, color: template.color }}
                    >
                      <Icon icon={template.icon} className="w-3 h-3" />
                    </span>
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 pt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-full border-[var(--sk-border)] text-sm font-medium text-[var(--sk-text)]"
          >
            {t('addAccount.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium"
          >
            {saving ? (isEdit ? t('addAccount.saving') : t('addAccount.adding')) : (isEdit ? t('addAccount.save') : t('addAccount.add'))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
