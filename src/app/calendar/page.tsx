import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Receipt, TrendingUp } from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const events: Record<number, { type: string; title: string; amount?: number }[]> = {
  3: [{ type: 'expense', title: 'Rent payment', amount: -15000 }],
  5: [{ type: 'income', title: 'Salary', amount: 55000 }],
  8: [{ type: 'expense', title: 'Netflix subscription', amount: -149 }],
  12: [{ type: 'expense', title: 'Utilities', amount: -3200 }],
  15: [{ type: 'expense', title: 'Internet', amount: -250 }],
  18: [{ type: 'expense', title: 'Spotify', amount: -89 }],
  22: [{ type: 'expense', title: 'Car insurance', amount: -2400 }],
  25: [{ type: 'income', title: 'Freelance payment', amount: 12000 }],
  28: [{ type: 'expense', title: 'Phone bill', amount: -199 }],
};

export default function CalendarPage() {
  const [currentDate] = useState(new Date(2025, 4, 1)); // May 2025
  const today = 25;

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay: firstDay === 0 ? 6 : firstDay - 1, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">Calendar</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">Upcoming payments and income</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)]"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-semibold text-[var(--sk-text)] min-w-[100px] text-center">{monthNames[currentDate.getMonth()]} 2025</span>
          <button className="p-2 rounded-xl hover:bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)]"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-3 sm:p-5">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((d) => (
            <div key={d} className="text-center text-[10px] sm:text-xs font-medium text-[var(--sk-text-secondary)] py-2 uppercase tracking-wider">{d}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = events[day] || [];
            const isToday = day === today;
            return (
              <div
                key={day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-start pt-1 sm:pt-2 transition-all ${
                  isToday ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30' : 'hover:bg-[var(--sk-border-light)]'
                }`}
              >
                <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-[#8B5CF6]' : 'text-[var(--sk-text)]'}`}>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.map((e, ei) => (
                      <div key={ei} className={`w-1.5 h-1.5 rounded-full ${e.type === 'income' ? 'bg-green-500' : 'bg-red-400'}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] mb-3">Upcoming Events</h3>
        <div className="space-y-2">
          {Object.entries(events).slice(0, 5).map(([day, evs]) =>
            evs.map((e, i) => (
              <div key={`${day}-${i}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--sk-border-light)] transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${e.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  {e.type === 'income' ? <TrendingUp className="w-4 h-4 text-green-500" /> : <Receipt className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--sk-text)]">{e.title}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${e.amount && e.amount > 0 ? 'text-green-500' : 'text-[var(--sk-text)]'}`}>
                    {e.amount && e.amount > 0 ? '+' : ''}{e.amount?.toLocaleString()} UAH
                  </p>
                  <p className="text-[11px] text-[var(--sk-text-secondary)]">May {day}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
