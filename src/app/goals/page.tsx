import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Plane, Home, GraduationCap, Car, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format';

const goals = [
  { id: '1', name: 'Vacation to Bali', icon: Plane, color: '#06B6D4', target: 80000, current: 45200, deadline: '2025-09-01' },
  { id: '2', name: 'New Apartment Deposit', icon: Home, color: '#8B5CF6', target: 300000, current: 185000, deadline: '2026-01-01' },
  { id: '3', name: 'MBA Tuition', icon: GraduationCap, color: '#10B981', target: 250000, current: 62000, deadline: '2026-06-01' },
  { id: '4', name: 'New Car', icon: Car, color: '#F59E0B', target: 450000, current: 120000, deadline: '2026-12-01' },
  { id: '5', name: 'iPhone 16 Pro', icon: Smartphone, color: '#EF4444', target: 52000, current: 48000, deadline: '2025-07-01' },
];

export default function GoalsPage() {
  const [items] = useState(goals);
  const totalTarget = items.reduce((s, g) => s + g.target, 0);
  const totalCurrent = items.reduce((s, g) => s + g.current, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">Goals</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">{items.length} active savings goals</p>
        </div>
        <Button onClick={() => toast.info('Coming soon!')} className="h-10 bg-[#0F0F0F] hover:bg-[#1F1F1F] text-white rounded-full text-sm font-medium px-4 w-fit">
          <Plus className="w-4 h-4 mr-1.5" /> Add Goal
        </Button>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">Total saved towards goals</p>
            <p className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">{formatCurrency(totalCurrent)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">Total target</p>
            <p className="text-lg font-semibold text-[var(--sk-text)]">{formatCurrency(totalTarget)}</p>
          </div>
        </div>
        <div className="h-3 bg-[var(--sk-border-light)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalCurrent / totalTarget) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-[#8B5CF6]"
          />
        </div>
        <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)] mt-2 text-right">{((totalCurrent / totalTarget) * 100).toFixed(1)}% of total goals</p>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {items.map((goal, i) => {
          const Icon = goal.icon;
          const pct = (goal.current / goal.target) * 100;
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-[var(--sk-border)] shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${goal.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: goal.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--sk-text)]">{goal.name}</p>
                  <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)]">Due {goal.deadline}</p>
                </div>
              </div>

              <div className="flex items-end justify-between mb-2">
                <span className="text-sm font-bold text-[var(--sk-text)]">{formatCurrency(goal.current)}</span>
                <span className="text-xs text-[var(--sk-text-secondary)]">of {formatCurrency(goal.target)}</span>
              </div>

              <div className="h-2.5 bg-[var(--sk-border-light)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: pct >= 100 ? '#10B981' : goal.color }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] sm:text-xs font-medium" style={{ color: goal.color }}>{pct.toFixed(0)}%</span>
                {pct >= 100 && <span className="text-[10px] font-medium bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Completed!</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
