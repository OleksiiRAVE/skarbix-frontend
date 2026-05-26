import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { SlidersHorizontal, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { mockAccounts, mockCategories } from '@/lib/mock-api/data';

export interface FilterState {
  type: 'all' | 'income' | 'expense';
  accounts: string[];
  categories: string[];
  amountMin: string;
  amountMax: string;
  dateFrom: string;
  dateTo: string;
}

interface TransactionFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}

const defaultFilters: FilterState = {
  type: 'all',
  accounts: [],
  categories: [],
  amountMin: '',
  amountMax: '',
  dateFrom: '',
  dateTo: '',
};

const expenseCategories = mockCategories.filter((c) => c.name !== 'Income');
const incomeCategories = mockCategories.filter((c) => c.name === 'Income');

export function TransactionFilterSheet({ open, onOpenChange, filters, onApply, onReset }: TransactionFilterSheetProps) {
  const { t } = useTranslation();
  const [local, setLocal] = useState<FilterState>(filters);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setLocal(filters);
    onOpenChange(nextOpen);
  };

  const toggleAccount = (id: string) => {
    setLocal((prev) => ({
      ...prev,
      accounts: prev.accounts.includes(id)
        ? prev.accounts.filter((a) => a !== id)
        : [...prev.accounts, id],
    }));
  };

  const toggleCategory = (id: string) => {
    setLocal((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const handleApply = () => {
    onApply(local);
    handleOpenChange(false);
  };

  const handleReset = () => {
    setLocal(defaultFilters);
    onReset();
  };

  const typeOptions: { key: FilterState['type']; label: string }[] = [
    { key: 'all', label: t('filter.all') },
    { key: 'expense', label: t('filter.expense') },
    { key: 'income', label: t('filter.income') },
  ];

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-[380px] p-0 bg-[var(--sk-card)] border-0 border-l border-[var(--sk-border)] flex flex-col">
        {/* Header */}
        <SheetHeader className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-[var(--sk-border)] flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--sk-text-secondary)]" />
            <SheetTitle className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">
              {t('filter.title')}
            </SheetTitle>
          </div>
          <button
            onClick={() => handleOpenChange(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--sk-border-light)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--sk-text-secondary)]" />
          </button>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Transaction Type */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--sk-text)] border-l-2 border-[#8B5CF6] pl-2">
              {t('transactions.type')}
            </h3>
            <div className="flex gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLocal((p) => ({ ...p, type: opt.key }))}
                  className={`flex-1 h-9 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                    local.type === opt.key
                      ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]'
                      : 'bg-transparent text-[var(--sk-text-secondary)] border-[var(--sk-border)] hover:text-[var(--sk-text)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accounts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--sk-text)] border-l-2 border-[#8B5CF6] pl-2">
              {t('filter.account')}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {mockAccounts.map((acc) => (
                <label
                  key={acc.id}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Checkbox
                    checked={local.accounts.includes(acc.id)}
                    onCheckedChange={() => toggleAccount(acc.id)}
                    className="size-4 rounded-[4px] border-[var(--sk-border)] data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                  />
                  <span className="text-xs text-[var(--sk-text)] truncate">{acc.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--sk-text)] border-l-2 border-[#8B5CF6] pl-2">
              {t('filter.categories')}
            </h3>

            {/* Expense categories */}
            <div className="rounded-2xl bg-[var(--sk-border-light)] p-3 space-y-2">
              <p className="text-xs text-[var(--sk-text-secondary)] font-medium">{t('filter.expenseCategories')}</p>
              <div className="space-y-2">
                {expenseCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={local.categories.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                      className="size-4 rounded-[4px] border-[var(--sk-border)] data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                    />
                    <span className="text-sm text-[var(--sk-text)]">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Income categories */}
            {incomeCategories.length > 0 && (
              <div className="rounded-2xl bg-[var(--sk-border-light)] p-3 space-y-2">
                <p className="text-xs text-[var(--sk-text-secondary)] font-medium">{t('filter.incomeCategories')}</p>
                <div className="space-y-2">
                  {incomeCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={local.categories.includes(cat.id)}
                        onCheckedChange={() => toggleCategory(cat.id)}
                        className="size-4 rounded-[4px] border-[var(--sk-border)] data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                      />
                      <span className="text-sm text-[var(--sk-text)]">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--sk-text)] border-l-2 border-[#8B5CF6] pl-2">
              {t('filter.amount')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-[var(--sk-text-secondary)]">{t('filter.from')}</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={local.amountMin}
                  onChange={(e) => setLocal((p) => ({ ...p, amountMin: e.target.value }))}
                  className="h-11 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[var(--sk-text-secondary)]">{t('filter.to')}</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={local.amountMax}
                  onChange={(e) => setLocal((p) => ({ ...p, amountMax: e.target.value }))}
                  className="h-11 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4"
                />
              </div>
            </div>
          </div>

          {/* Period */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--sk-text)] border-l-2 border-[#8B5CF6] pl-2">
              {t('filter.period')}
            </h3>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 flex-1 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 justify-start font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[var(--sk-text-secondary)]" />
                    {local.dateFrom ? format(new Date(local.dateFrom), 'dd.MM.yyyy') : t('filter.from')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[var(--sk-card)] border-[var(--sk-border)]" align="start">
                  <Calendar
                    mode="single"
                    selected={local.dateFrom ? new Date(local.dateFrom) : undefined}
                    onSelect={(date) => date && setLocal((p) => ({ ...p, dateFrom: format(date, 'yyyy-MM-dd') }))}
                    initialFocus
                    className="min-w-[320px] [--cell-size:--spacing(10)]"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 flex-1 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 justify-start font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[var(--sk-text-secondary)]" />
                    {local.dateTo ? format(new Date(local.dateTo), 'dd.MM.yyyy') : t('filter.to')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[var(--sk-card)] border-[var(--sk-border)]" align="start">
                  <Calendar
                    mode="single"
                    selected={local.dateTo ? new Date(local.dateTo) : undefined}
                    onSelect={(date) => date && setLocal((p) => ({ ...p, dateTo: format(date, 'yyyy-MM-dd') }))}
                    initialFocus
                    className="min-w-[320px] [--cell-size:--spacing(10)]"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {(local.dateFrom || local.dateTo) && (
              <button
                onClick={() => setLocal((p) => ({ ...p, dateFrom: '', dateTo: '' }))}
                className="text-xs text-[#8B5CF6] hover:underline"
              >
                {t('filter.clearPeriod')}
              </button>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="p-5 sm:p-6 border-t border-[var(--sk-border)] space-y-2">
          <Button
            onClick={handleApply}
            className="w-full h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium"
          >
            {t('filter.apply')}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full h-11 rounded-full border-[var(--sk-border)] text-sm font-medium text-[var(--sk-text)]"
          >
            {t('filter.resetChanges')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
