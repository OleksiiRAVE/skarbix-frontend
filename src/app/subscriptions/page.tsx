import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Youtube, Music, Film, ShoppingBag, Cloud, BookOpen, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format';

const subscriptions = [
  { id: '1', name: 'Netflix', icon: Film, color: '#E50914', cost: 149, period: 'monthly', nextDate: '2025-06-15', category: 'entertainment' },
  { id: '2', name: 'Spotify', icon: Music, color: '#1DB954', cost: 89, period: 'monthly', nextDate: '2025-06-08', category: 'entertainment' },
  { id: '3', name: 'YouTube Premium', icon: Youtube, color: '#FF0000', cost: 119, period: 'monthly', nextDate: '2025-06-22', category: 'entertainment' },
  { id: '4', name: 'Apple iCloud', icon: Cloud, color: '#007AFF', cost: 69, period: 'monthly', nextDate: '2025-06-01', category: 'utilities' },
  { id: '5', name: 'Amazon Prime', icon: ShoppingBag, color: '#FF9900', cost: 199, period: 'monthly', nextDate: '2025-06-18', category: 'shopping' },
  { id: '6', name: 'Kindle Unlimited', icon: BookOpen, color: '#1A9FFF', cost: 119, period: 'monthly', nextDate: '2025-06-10', category: 'education' },
  { id: '7', name: 'Internet Provider', icon: Wifi, color: '#6366F1', cost: 250, period: 'monthly', nextDate: '2025-06-05', category: 'utilities' },
];

export default function SubscriptionsPage() {
  const [items] = useState(subscriptions);
  const totalMonthly = items.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">Subscriptions</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">{items.length} active subscriptions</p>
        </div>
        <Button onClick={() => toast.info('Coming soon!')} className="h-10 bg-[#0F0F0F] hover:bg-[#1F1F1F] text-white rounded-full text-sm font-medium px-4 w-fit">
          <Plus className="w-4 h-4 mr-1.5" /> Add Subscription
        </Button>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 border border-[var(--sk-border)] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">Monthly total</p>
            <p className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">{formatCurrency(totalMonthly)}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">Yearly total</p>
            <p className="text-lg sm:text-xl font-semibold text-[var(--sk-text)]">{formatCurrency(totalMonthly * 12)}</p>
          </div>
        </div>
      </motion.div>

      {/* Subscriptions List */}
      <div className="space-y-2 sm:space-y-3">
        {items.map((sub, i) => {
          const Icon = sub.icon;
          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[var(--sk-card)] rounded-[14px] sm:rounded-[16px] p-3 sm:p-4 border border-[var(--sk-border)] shadow-sm flex items-center gap-3 sm:gap-4"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sub.color}15` }}>
                <Icon className="w-5 h-5" style={{ color: sub.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--sk-text)]">{sub.name}</p>
                <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)] capitalize">{sub.category} &middot; Next: {sub.nextDate}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[var(--sk-text)]">{formatCurrency(sub.cost)}</p>
                <p className="text-[10px] sm:text-xs text-[var(--sk-text-secondary)] capitalize">/{sub.period}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
