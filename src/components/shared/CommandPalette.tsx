import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Search, LayoutDashboard, Receipt, BarChart3, PiggyBank, Users, Sparkles, CreditCard, History, Settings, LogOut } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: typeof LayoutDashboard;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const navItems: CommandItem[] = [
    { id: 'dash', label: 'Dashboard', shortcut: 'G D', icon: LayoutDashboard, action: () => { navigate('/'); setOpen(false); } },
    { id: 'tx', label: 'Transactions', shortcut: 'G T', icon: Receipt, action: () => { navigate('/transactions'); setOpen(false); } },
    { id: 'analytics', label: 'Analytics', shortcut: 'G A', icon: BarChart3, action: () => { navigate('/analytics'); setOpen(false); } },
    { id: 'budgets', label: 'Budgets', shortcut: 'G B', icon: PiggyBank, action: () => { navigate('/budgets'); setOpen(false); } },
    { id: 'debts', label: 'Debts', shortcut: 'G D', icon: Users, action: () => { navigate('/debts'); setOpen(false); } },
    { id: 'ai', label: 'AI Assistant', shortcut: 'G I', icon: Sparkles, action: () => { navigate('/ai-assistant'); setOpen(false); } },
    { id: 'payments', label: 'Payments', icon: CreditCard, action: () => { navigate('/payments'); setOpen(false); } },
    { id: 'history', label: 'History', icon: History, action: () => { navigate('/history'); setOpen(false); } },
    { id: 'settings', label: 'Settings', shortcut: 'G S', icon: Settings, action: () => { navigate('/settings'); setOpen(false); } },
    { id: 'logout', label: 'Logout', icon: LogOut, action: () => { navigate('/auth'); setOpen(false); } },
  ];

  const filtered = query.trim()
    ? navItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : navItems;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[selectedIndex]?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[520px] mx-4 bg-[var(--sk-card)] rounded-[20px] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--sk-border)]">
              <Search className="w-4.5 h-4.5 text-[var(--sk-text-secondary)] flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands..."
                className="flex-1 text-sm text-[var(--sk-text)] placeholder:text-[var(--sk-text-secondary)] bg-transparent outline-none"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-[var(--sk-text-secondary)] bg-[var(--sk-border-light)] rounded-md border border-[var(--sk-border)]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-[var(--sk-text-secondary)]">
                  No results found for "{query}"
                </div>
              ) : (
                <>
                  <div className="px-3 pb-1.5">
                    <span className="text-[10px] font-medium text-[var(--sk-text-secondary)] uppercase tracking-wider">Navigation</span>
                  </div>
                  {filtered.map((item, i) => {
                    const Icon = item.icon;
                    const isSelected = i === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-left transition-colors ${
                          isSelected ? 'bg-[#8B5CF6]/10' : 'hover:bg-[var(--sk-border-light)]'
                        }`}
                        style={{ width: 'calc(100% - 16px)' }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#8B5CF6]/15' : 'bg-[var(--sk-border-light)]'
                        }`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#8B5CF6]' : 'text-[var(--sk-text-secondary)]'}`} />
                        </div>
                        <span className={`flex-1 text-sm font-medium ${isSelected ? 'text-[#8B5CF6]' : 'text-[var(--sk-text)]'}`}>
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <div className="flex gap-1">
                            {item.shortcut.split(' ').map((key, j) => (
                              <kbd key={j} className="px-1.5 py-0.5 text-[10px] font-medium text-[var(--sk-text-secondary)] bg-[var(--sk-border-light)] rounded border border-[var(--sk-border)]">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-t border-[var(--sk-border)] text-[10px] text-[var(--sk-text-secondary)]">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-[var(--sk-border-light)] rounded border border-[var(--sk-border)] text-[9px]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-[var(--sk-border-light)] rounded border border-[var(--sk-border)] text-[9px]">↵</kbd>
                Select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
