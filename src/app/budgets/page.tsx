import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Sparkles, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CardSkeleton } from '@/components/skeletons';
import { formatCurrency } from '@/lib/utils/format';
import { fetchBudgets, fetchCategories, createBudget } from '@/lib/mock-api/api';
import type { Budget, Category } from '@/types';

export default function BudgetsPage() {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ categoryId: '', amount: '', period: 'monthly' as 'monthly' | 'weekly' });

  useEffect(() => {
    Promise.all([fetchBudgets(), fetchCategories()]).then(([b, c]) => {
      setBudgets(b);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    const cat = categories.find((c) => c.id === formData.categoryId);
    await createBudget({
      categoryId: formData.categoryId,
      categoryName: cat?.name || 'Uncategorized',
      categoryColor: cat?.color || '#8B5CF6',
      amount: parseFloat(formData.amount),
      period: formData.period as 'monthly' | 'weekly',
      alertThreshold: 80,
    });
    const updated = await fetchBudgets();
    setBudgets(updated);
    toast.success('Budget created successfully');
    setModalOpen(false);
    setFormData({ categoryId: '', amount: '', period: 'monthly' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)]">Budgets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)] tracking-tight">Budgets</h1>
          <p className="text-[var(--sk-text-secondary)] mt-1 text-sm">Track and manage your spending limits</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 self-start">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[var(--sk-text-secondary)] bg-[var(--sk-card)] rounded-full border border-[var(--sk-border)] hover:border-[var(--sk-border)] transition-all">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">May 2025</span>
            <span className="sm:hidden">May</span>
          </button>
          <Button
            onClick={() => setModalOpen(true)}
            className="h-9 sm:h-10 bg-black hover:bg-black/90 text-white rounded-full px-3 sm:px-5 text-xs sm:text-sm"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Create Budget</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </motion.div>

      {/* AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-[var(--sk-border)] flex items-start sm:items-center gap-3 sm:gap-4 shadow-sm"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">
            Based on your spending, we suggest a <span className="font-semibold text-[var(--sk-text)]">₴5,000</span> monthly budget for Food.
          </p>
        </div>
        <Button className="h-8 sm:h-9 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-xs px-3 sm:px-4 flex-shrink-0">
          Apply
        </Button>
      </motion.div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {budgets.map((budget, i) => {
          const pct = Math.round((budget.spent / budget.amount) * 100);
          const isOver = pct > 100;
          const isWarning = pct >= budget.alertThreshold && pct <= 100;
          const barColor = isOver ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${budget.categoryColor}15` }}
                  >
                    <span className="text-xs sm:text-sm font-bold" style={{ color: budget.categoryColor }}>
                      {budget.categoryName.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--sk-text)] truncate">{budget.categoryName}</p>
                    <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)]">{budget.period}</p>
                  </div>
                </div>
                {(isOver || isWarning) && (
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${isOver ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    <AlertTriangle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isOver ? 'text-red-500' : 'text-amber-500'}`} />
                  </div>
                )}
              </div>

              <div className="mb-2">
                <span className="text-xl sm:text-2xl font-bold text-[var(--sk-text)] tabular-nums">{formatCurrency(budget.spent)}</span>
                <span className="text-xs sm:text-sm text-[var(--sk-text-secondary)] ml-1">/ {formatCurrency(budget.amount)}</span>
              </div>

              <div className="space-y-1.5">
                <div className="h-1.5 sm:h-2 bg-[var(--sk-border-light)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: barColor }}
                  />
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs">
                  <span style={{ color: barColor }} className="font-medium">{pct}% used</span>
                  <span className="text-[var(--sk-text-secondary)]">{formatCurrency(budget.amount - budget.spent)} left</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Budget Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[20px] sm:rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)]">
          <div className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-[var(--sk-border)]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold">Create Budget</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Category</Label>
              <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                <SelectTrigger className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c.type === 'custom' || ['Food & Drinks', 'Shopping', 'Transport', 'Entertainment', 'Bills'].includes(c.name)).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Budget Amount</Label>
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
              <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Period</Label>
              <div className="flex rounded-xl border border-[var(--sk-border)] overflow-hidden h-10 sm:h-11">
                <button
                  onClick={() => setFormData({ ...formData, period: 'monthly' })}
                  className={`flex-1 text-xs sm:text-sm font-medium transition-colors ${
                    formData.period === 'monthly' ? 'bg-[#8B5CF6] text-white' : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setFormData({ ...formData, period: 'weekly' })}
                  className={`flex-1 text-xs sm:text-sm font-medium transition-colors ${
                    formData.period === 'weekly' ? 'bg-[#8B5CF6] text-white' : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 pt-0 flex gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 h-10 sm:h-11 rounded-full border-[var(--sk-border)] text-xs sm:text-sm">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.categoryId || !formData.amount}
              className="flex-1 h-10 sm:h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-xs sm:text-sm"
            >
              Create Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
