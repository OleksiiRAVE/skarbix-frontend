import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';

export function BankCard() {
  const user = useAppStore((s) => s.user);
  const cardHolder = user?.name || 'Skarbix User';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-[16px] sm:rounded-[20px] p-4 sm:p-6"
      style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #EC4899 100%)',
      }}
    >
      {/* Animated shine */}
      <div className="absolute inset-0 overflow-hidden rounded-[16px] sm:rounded-[20px]">
        <motion.div
          className="absolute -inset-[200%]"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)',
          }}
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
        />
      </div>

      {/* Holographic overlay */}
      <div className="absolute inset-0 rounded-[16px] sm:rounded-[20px] opacity-30"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
            <path d="M5.5 5.5l2.5 2.5M16 16l2.5 2.5M5.5 18.5l2.5-2.5M16 8l2.5-2.5" />
          </svg>
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] text-white/80 uppercase bg-white/10 px-2 py-1 rounded-md">
            CARD
          </span>
        </div>

        {/* Chip */}
        <div className="mb-4 sm:mb-6">
          <div className="w-9 h-7 sm:w-11 sm:h-8 rounded-md bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 border border-yellow-600/20 rounded-md" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-yellow-600/30" />
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-yellow-600/30" />
          </div>
        </div>

        {/* Card Number */}
        <p className="text-[15px] sm:text-[17px] font-medium tracking-[0.12em] text-white mb-4 sm:mb-5 font-mono">
          4253 5432 3521 3090
        </p>

        {/* Bottom info */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] sm:text-[10px] font-medium tracking-[0.1em] text-white/60 uppercase mb-0.5">
              Card Holder
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase">
              {cardHolder}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] sm:text-[10px] font-medium tracking-[0.1em] text-white/60 uppercase mb-0.5">
              Expires
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-white">
              09/28
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex gap-2 mt-4 sm:mt-6">
        <Button className="flex-1 h-9 sm:h-10 bg-black text-white hover:bg-black/90 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-[0.98]">
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
          Transfer
        </Button>
        <Button variant="outline" className="flex-1 h-9 sm:h-10 bg-white/15 text-white border-white/20 hover:bg-white/25 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-[0.98]">
          <ArrowDownLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
          Request
        </Button>
        <Button variant="outline" className="w-9 h-9 sm:w-10 sm:h-10 p-0 bg-white/15 text-white border-white/20 hover:bg-white/25 rounded-full transition-all active:scale-[0.98]">
          <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
