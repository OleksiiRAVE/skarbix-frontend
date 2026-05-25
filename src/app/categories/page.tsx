import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, Car, Film, Utensils, Home, Zap, Heart, Briefcase, GraduationCap, Plane, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const categories = [
  { id: '1', name: 'Groceries', icon: ShoppingCart, color: '#10B981', spent: 12500, budget: 18000 },
  { id: '2', name: 'Transport', icon: Car, color: '#3B82F6', spent: 4200, budget: 6000 },
  { id: '3', name: 'Entertainment', icon: Film, color: '#8B5CF6', spent: 3100, budget: 5000 },
  { id: '4', name: 'Dining Out', icon: Utensils, color: '#F59E0B', spent: 5800, budget: 7000 },
  { id: '5', name: 'Housing', icon: Home, color: '#EF4444', spent: 15000, budget: 15000 },
  { id: '6', name: 'Utilities', icon: Zap, color: '#06B6D4', spent: 3200, budget: 4000 },
  { id: '7', name: 'Health', icon: Heart, color: '#EC4899', spent: 1800, budget: 3000 },
  { id: '8', name: 'Work', icon: Briefcase, color: '#6366F1', spent: 900, budget: 2000 },
  { id: '9', name: 'Education', icon: GraduationCap, color: '#14B8A6', spent: 2500, budget: 5000 },
  { id: '10', name: 'Travel', icon: Plane, color: '#F97316', spent: 0, budget: 8000 },
  { id: '11', name: 'Other', icon: MoreHorizontal, color: '#9CA3AF', spent: 1200, budget: 2000 },
];

export default function CategoriesPage() {
  const [items] = useState(categories);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">Categories</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">Manage your spending categories</p>
        </div>
        <Button onClick={() => toast.info('Coming soon!')} className="h-10 bg-[#0F0F0F] hover:bg-[#1F1F1F] text-white rounded-full text-sm font-medium px-4 w-fit">
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map((cat, i) => {
          const Icon = cat.icon;
          const percent = Math.min((cat.spent / cat.budget) * 100, 100);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-[var(--sk-border)] shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}18` }}>
                  <Icon className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--sk-text)]">{cat.name}</p>
                  <p className="text-xs text-[var(--sk-text-secondary)]">{cat.spent.toLocaleString()} / {cat.budget.toLocaleString()} UAH</p>
                </div>
              </div>
              <div className="h-2 bg-[var(--sk-border-light)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: percent > 90 ? '#EF4444' : cat.color }}
                />
              </div>
              <p className="text-[11px] text-[var(--sk-text-secondary)] mt-2">{percent.toFixed(0)}% used</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
