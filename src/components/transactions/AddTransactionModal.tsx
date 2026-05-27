import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { fetchCategories, createTransaction, fetchAccounts } from '@/lib/mock-api/api';
import { mockCategories, mockAccounts } from '@/lib/mock-api/data';
import type { Category, Account } from '@/types';

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const getDefaultFormData = () => ({
  amount: '',
  type: 'expense' as 'income' | 'expense',
  account: '',
  category: '',
  merchant: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
});

export function AddTransactionModal({ open, onOpenChange, onSuccess }: AddTransactionModalProps) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState(getDefaultFormData);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    Promise.all([fetchCategories(), fetchAccounts()])
      .then(([cats, accs]) => {
        if (!mounted) return;
        setCategories(cats);
        setAccounts(accs);
      })
      .catch(() => {
        if (mounted) {
          setCategories(mockCategories);
          setAccounts(mockAccounts);
        }
      });
    return () => { mounted = false; };
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(getDefaultFormData());
    }
    onOpenChange(nextOpen);
  };

  const filteredCategories = categories.filter((category) => category.kind === formData.type);

  const setTransactionType = (type: 'income' | 'expense') => {
    setFormData((current) => ({
      ...current,
      type,
      category: categories.some((category) => category.id === current.category && category.kind === type)
        ? current.category
        : '',
    }));
  };

  const getCategoryName = (category: Category) => (
    category.templateKey ? t(`systemCategories.${category.templateKey}`, { defaultValue: category.name }) : category.name
  );

  const handleAdd = async () => {
    try {
      const cat = categories.find((c) => c.id === formData.category);
      await createTransaction({
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: cat?.name || 'Uncategorized',
        categoryId: formData.category || 'cat1',
        merchant: formData.merchant,
        date: formData.date,

        notes: formData.notes,
      });
      toast.success(t('addTransaction.toastSuccess'));
    } catch {
      toast.success(t('addTransaction.toastDemo'));
    }
    handleOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)] bg-[var(--sk-card)]">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[var(--sk-text)] text-center">
            {t('addTransaction.title')}
          </DialogTitle>
        </div>

        <div className="px-6 sm:px-8 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Type */}
          <div className="flex rounded-full border border-[var(--sk-border)] overflow-hidden h-11">
            <button
              onClick={() => setTransactionType('expense')}
              className={`flex-1 text-sm font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-500/10 text-red-400'
                  : 'text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]'
              }`}
            >
              {t('addTransaction.expense')}
            </button>
            <button
              onClick={() => setTransactionType('income')}
              className={`flex-1 text-sm font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]'
              }`}
            >
              {t('addTransaction.income')}
            </button>
          </div>

          {/* Account */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addTransaction.account')}</Label>
            <Select value={formData.account} onValueChange={(v) => setFormData({ ...formData, account: v })}>
              <SelectTrigger className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 py-0 leading-none" style={{ width: '100%' }}>
                <SelectValue placeholder={t('addTransaction.selectAccount')} />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date / Amount */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addTransaction.date')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 justify-start font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[var(--sk-text-secondary)]" />
                    {formData.date ? format(new Date(formData.date), 'dd.MM.yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[var(--sk-card)] border-[var(--sk-border)]" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={(date) => date && setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') })}
                    initialFocus
                    className="min-w-[320px] [--cell-size:--spacing(10)]"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addTransaction.amount')}</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--sk-text-secondary)]">₴</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] pl-8 pr-4"
                />
              </div>
            </div>
          </div>

          {/* Merchant */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addTransaction.description')}</Label>
            <Input
              placeholder={t('addTransaction.descriptionPlaceholder')}
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addTransaction.category')}</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 py-0 leading-none" style={{ width: '100%' }}>
                <SelectValue placeholder={t('addTransaction.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{getCategoryName(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addTransaction.notes')}</Label>
            <Textarea
              placeholder={t('addTransaction.notesPlaceholder')}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 min-h-[80px] resize-none"
            />
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-full border-[var(--sk-border)] text-sm font-medium text-[var(--sk-text)]"
          >
            {t('addTransaction.cancel')}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!formData.amount || !formData.merchant}
            className="flex-1 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium"
          >
            {t('addTransaction.add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
