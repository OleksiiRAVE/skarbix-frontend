import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface BalanceCardProps {
  balance: number;
  change: number;
  changeAmount: number;
}

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = null;
    startValueRef.current = 0;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValueRef.current + (value - startValueRef.current) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{formatCurrency(displayValue)}</>;
}

export function BalanceCard({ balance, change, changeAmount }: BalanceCardProps) {
  const [hidden, setHidden] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--sk-text-secondary)] font-medium">Total Balance</span>
        <button
          onClick={() => setHidden(!hidden)}
          className="p-1.5 rounded-lg hover:bg-[var(--sk-border-light)] transition-colors text-[var(--sk-text-secondary)]"
          aria-label={hidden ? 'Show balance' : 'Hide balance'}
        >
          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="mb-3">
        <span className="text-[32px] font-bold text-[var(--sk-text)] tabular-nums tracking-tight">
          {hidden ? '₴••••••' : <AnimatedCounter value={balance} />}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />
          +{change}%
        </span>
        <span className="text-xs text-[var(--sk-text-secondary)]">
          +{formatCurrency(changeAmount)} compared to last month
        </span>
      </div>
    </motion.div>
  );
}
