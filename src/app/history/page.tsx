import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw, Wand2, Tag, AlertTriangle, CheckCircle, Settings,
} from 'lucide-react';
import { CardSkeleton } from '@/components/skeletons';
import { formatDate } from '@/lib/utils/format';
import { fetchHistory } from '@/lib/mock-api/api';
import type { HistoryEvent } from '@/types';

const eventConfig: Record<string, { icon: typeof RefreshCw; color: string; bg: string }> = {
  monobank_sync: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  ai_transaction: { icon: Wand2, color: 'text-purple-600', bg: 'bg-[#8B5CF6]/10' },
  category_edit: { icon: Tag, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  budget_exceeded: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-500/10' },
  debt_paid: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
  setting_change: { icon: Settings, color: 'text-gray-600', bg: 'bg-[var(--sk-border-light)]' },
};

const filterOptions = [
  { value: 'all', label: 'All Events' },
  { value: 'monobank_sync', label: 'Monobank' },
  { value: 'ai_transaction', label: 'AI' },
  { value: 'budget_exceeded', label: 'Budget' },
  { value: 'debt_paid', label: 'Debts' },
];

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory().then((e) => { setEvents(e); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--sk-text)]">History</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--sk-text)] tracking-tight">History</h1>
          <p className="text-[var(--sk-text-secondary)] mt-1">Timeline of important events</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3.5 py-2 text-xs font-medium rounded-full transition-all ${
                filter === opt.value
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-[var(--sk-card)] text-[var(--sk-text-secondary)] border border-[var(--sk-border)] hover:border-[var(--sk-text-secondary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-3">
        {filtered.map((event, i) => {
          const config = eventConfig[event.type] || eventConfig.setting_change;
          const Icon = config.icon;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[var(--sk-card)] rounded-[20px] p-5 border border-[var(--sk-border)] shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--sk-text)]">{event.title}</p>
                  <span className="text-xs text-[var(--sk-text-secondary)] flex-shrink-0">{formatDate(event.timestamp)}</span>
                </div>
                <p className="text-sm text-[var(--sk-text-secondary)] mt-0.5">{event.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
