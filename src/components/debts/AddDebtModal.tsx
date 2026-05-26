import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { createDebt } from '@/lib/mock-api/api';

interface AddDebtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const getDefaultFormData = () => ({
  personName: '',
  amount: '',
  direction: 'owed_to_me' as 'owed_to_me' | 'i_owe',
  dueDate: '',
  notes: '',
});

export function AddDebtModal({ open, onOpenChange, onSuccess }: AddDebtModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(getDefaultFormData);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(getDefaultFormData());
    }
    onOpenChange(nextOpen);
  };

  const handleAdd = async () => {
    try {
      await createDebt({
        personName: formData.personName,
        amount: parseFloat(formData.amount),
        direction: formData.direction,
        dueDate: formData.dueDate || undefined,
        notes: formData.notes,
      });
      toast.success(t('addDebt.toastSuccess'));
    } catch {
      toast.success(t('addDebt.toastDemo'));
    }
    handleOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)] bg-[var(--sk-card)]">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[var(--sk-text)] text-center">
            {t('addDebt.title')}
          </DialogTitle>
        </div>

        <div className="px-6 sm:px-8 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Direction toggle */}
          <div className="flex rounded-full border border-[var(--sk-border)] overflow-hidden h-11">
            <button
              onClick={() => setFormData({ ...formData, direction: 'owed_to_me' })}
              className={`flex-1 text-sm font-medium transition-colors ${
                formData.direction === 'owed_to_me'
                  ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  : 'text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]'
              }`}
            >
              {t('addDebt.theyOweMe')}
            </button>
            <button
              onClick={() => setFormData({ ...formData, direction: 'i_owe' })}
              className={`flex-1 text-sm font-medium transition-colors ${
                formData.direction === 'i_owe'
                  ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  : 'text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]'
              }`}
            >
              {t('addDebt.iOweThem')}
            </button>
          </div>

          {/* Person Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addDebt.personName')}</Label>
            <Input
              placeholder={t('addDebt.personPlaceholder')}
              value={formData.personName}
              onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
              className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addDebt.amount')}</Label>
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

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addDebt.dueDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4 justify-start font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[var(--sk-text-secondary)]" />
                  {formData.dueDate ? format(new Date(formData.dueDate), 'dd.MM.yyyy') : t('addDebt.pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[var(--sk-card)] border-[var(--sk-border)]" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                  onSelect={(date) => date && setFormData({ ...formData, dueDate: format(date, 'yyyy-MM-dd') })}
                  initialFocus
                  className="min-w-[320px] [--cell-size:--spacing(10)]"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addDebt.notes')}</Label>
            <Textarea
              placeholder={t('addDebt.notesPlaceholder')}
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
            {t('addDebt.cancel')}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!formData.personName || !formData.amount}
            className="flex-1 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium"
          >
            {t('addDebt.add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
