import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { IconPicker } from '@/components/shared/IconPicker';
import {
  createCategory,
  fetchCategoryTemplates,
  updateCategory,
} from '@/lib/mock-api/api';
import type { Category, CategoryTemplate } from '@/types';

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  category?: Category | null;
}

const defaultForm = {
  name: '',
  kind: 'expense' as Category['kind'],
  color: '#8B5CF6',
  icon: 'lucide:tag',
};

const getDefaultForm = (category?: Category | null) => ({
  name: category?.name || '',
  kind: category?.kind || defaultForm.kind,
  color: category?.color || defaultForm.color,
  icon: category?.icon || defaultForm.icon,
});

export function AddCategoryModal({ open, onOpenChange, onSuccess, category }: AddCategoryModalProps) {
  const { t } = useTranslation();
  const isEdit = !!category;
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<CategoryTemplate[]>([]);
  const [form, setForm] = useState(getDefaultForm(category));

  useEffect(() => {
    if (!open) return;
    setForm(getDefaultForm(category));
    fetchCategoryTemplates().then(setTemplates).catch(() => setTemplates([]));
  }, [open, category]);

  const applyTemplate = (template: CategoryTemplate) => {
    setForm({
      name: template.name,
      kind: template.kind,
      color: template.color,
      icon: template.icon,
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error(t('addCategory.nameRequired'));
      return;
    }

    setSaving(true);
    try {
      if (isEdit && category) {
        await updateCategory(category.id, {
          name: form.name.trim(),
          kind: form.kind,
          color: form.color,
          icon: form.icon,
        });
      } else {
        await createCategory({
          name: form.name.trim(),
          kind: form.kind,
          color: form.color,
          icon: form.icon,
        });
      }
      toast.success(isEdit ? t('addCategory.toastUpdate') : t('addCategory.toastSuccess'));
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : t(isEdit ? 'addCategory.toastUpdateError' : 'addCategory.toastError');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)] bg-[var(--sk-card)]">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[var(--sk-text)] text-center">
            {isEdit ? t('addCategory.editTitle') : t('addCategory.title')}
          </DialogTitle>
        </div>

        <div className="px-6 sm:px-8 space-y-5 max-h-[64vh] overflow-y-auto">
          {!isEdit && templates.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addCategory.templates')}</Label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {templates.map((template) => (
                  <button
                    key={template.key}
                    onClick={() => applyTemplate(template)}
                    className="shrink-0 h-10 rounded-full border border-[var(--sk-border)] bg-[var(--sk-border-light)] hover:bg-[var(--sk-border)] px-3 flex items-center gap-2 text-xs text-[var(--sk-text)] transition-colors"
                  >
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${template.color}18`, color: template.color }}
                    >
                      <Icon icon={template.icon} className="w-3.5 h-3.5" />
                    </span>
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addCategory.name')}</Label>
            <Input
              placeholder={t('addCategory.namePlaceholder')}
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="h-12 rounded-2xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] px-4"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addCategory.kind')}</Label>
            <div className="h-11 rounded-full border border-[var(--sk-border)] bg-[var(--sk-border-light)] p-0.5 grid grid-cols-2">
              {(['expense', 'income'] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, kind }))}
                  className={`rounded-full text-sm font-semibold transition-all ${
                    form.kind === kind
                      ? kind === 'expense'
                        ? 'bg-red-500/10 text-red-500 shadow-sm'
                        : 'bg-emerald-500/10 text-emerald-600 shadow-sm'
                      : 'text-[var(--sk-text-secondary)]'
                  }`}
                >
                  {kind === 'income' ? t('addCategory.kindIncome') : t('addCategory.kindExpense')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addCategory.icon')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-12 w-full rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] flex items-center justify-center gap-2 text-[var(--sk-text)] hover:bg-[var(--sk-border)] transition-colors">
                    <Icon icon={form.icon} className="w-5 h-5" />
                    <span className="text-xs text-[var(--sk-text-secondary)]">{t('addCategory.change')}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-[var(--sk-card)] border-[var(--sk-border)] shadow-xl" align="start">
                  <IconPicker value={form.icon} onChange={(icon) => setForm((current) => ({ ...current, icon }))} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[var(--sk-text)]">{t('addCategory.color')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-12 w-full rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] flex items-center justify-center gap-2 text-[var(--sk-text)] hover:bg-[var(--sk-border)] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[var(--sk-border)]" style={{ backgroundColor: form.color }} />
                    <span className="text-xs text-[var(--sk-text-secondary)]">{form.color.toUpperCase()}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-3 bg-[var(--sk-card)] border-[var(--sk-border)] shadow-xl" align="end">
                  <ColorPicker value={form.color} onChange={(color) => setForm((current) => ({ ...current, color }))} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-border-light)] p-4 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${form.color}18`, color: form.color }}
            >
              <Icon icon={form.icon} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--sk-text)] truncate">{form.name || t('addCategory.previewName')}</p>
              <p className="text-xs text-[var(--sk-text-secondary)]">{form.kind === 'income' ? t('addCategory.kindIncome') : t('addCategory.kindExpense')}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-full border-[var(--sk-border)] text-sm font-medium text-[var(--sk-text)]"
          >
            {t('addCategory.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium"
          >
            {saving ? t('addCategory.adding') : (isEdit ? t('addCategory.save') : t('addCategory.add'))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
