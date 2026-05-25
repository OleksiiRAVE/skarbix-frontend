import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AIInsightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="relative overflow-hidden bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm"
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#8B5CF6]/15 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-2xl opacity-40" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--sk-text)]">AI Insight</h3>
        </div>

        {/* Message */}
        <p className="text-[15px] text-[var(--sk-text-secondary)] leading-relaxed mb-4">
          You spent <span className="font-semibold text-[var(--sk-text)]">23% more</span> on restaurants this week. Your food budget is at 84.5% with 6 days remaining. Want to set a limit?
        </p>

        {/* CTA */}
        <Button
          className="h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium px-5 transition-all active:scale-[0.98]"
        >
          Create budget
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </motion.div>
  );
}
