import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Plus, Search, Download, ChevronLeft, ChevronRight,
  Eye, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TableSkeleton } from '@/components/skeletons';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  fetchTransactions, fetchCategories, createTransaction,
} from '@/lib/mock-api/api';
import { mockTransactions, mockCategories } from '@/lib/mock-api/data';
import type { Transaction, Category } from '@/types';

const CC: Record<string, string> = {
  'Food & Drinks': '#F59E0B', 'Transport': '#8B5CF6', 'Shopping': '#EC4899',
  'Entertainment': '#10B981', 'Bills': '#EF4444', 'Health': '#06B6D4',
  'Income': '#10B981', 'Taxi': '#F97316', 'Groceries': '#84CC16', 'Subscriptions': '#6366F1',
};

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', type: 'expense' as 'income' | 'expense',
    category: '', merchant: '', date: new Date().toISOString().split('T')[0],
    source: 'manual' as 'manual' | 'monobank' | 'ai', notes: '',
  });

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const cats = await fetchCategories();
        if (!mounted) return;
        setCategories(cats);
        const res = await fetchTransactions({ limit: 10 });
        if (!mounted) return;
        setTransactions(res.transactions);
        setTotal(res.total);
      } catch {
        // Fallback to mock data
        if (mounted) {
          setCategories(mockCategories);
          setTransactions(mockTransactions.slice(0, 10));
          setTotal(mockTransactions.length);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const handleSearch = async (val: string) => {
    setSearch(val);
    try {
      const res = await fetchTransactions({ search: val, limit: 10 });
      setTransactions(res.transactions);
      setTotal(res.total);
    } catch {
      const filtered = mockTransactions.filter((t) =>
        t.merchant.toLowerCase().includes(val.toLowerCase()) ||
        t.category.toLowerCase().includes(val.toLowerCase())
      );
      setTransactions(filtered.slice(0, 10));
      setTotal(filtered.length);
    }
  };

  const handleAdd = async () => {
    try {
      const cat = categories.find((c) => c.id === formData.category);
      await createTransaction({
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: cat?.name || 'Uncategorized',
        categoryId: formData.category || 'cat1',
        merchant: formData.merchant,
        date: formData.date,
        source: formData.source,
        notes: formData.notes,
      });
      toast.success('Transaction added!');
    } catch {
      toast.success('Transaction added! (demo)');
    }
    setModalOpen(false);
    setFormData({ amount: '', type: 'expense', category: '', merchant: '', date: new Date().toISOString().split('T')[0], source: 'manual', notes: '' });
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)] tracking-tight">Transactions</h1>
          <p className="text-[var(--sk-text-secondary)] mt-1 text-sm">Manage and track all your financial activity</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" className="h-9 sm:h-10 rounded-full border-[var(--sk-border)] text-[var(--sk-text-secondary)] text-xs sm:text-sm">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button onClick={() => setModalOpen(true)} className="h-9 sm:h-10 bg-black hover:bg-black/90 text-white rounded-full px-3 sm:px-5 text-xs sm:text-sm">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-3 sm:p-4 border border-[var(--sk-border)] shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sk-text-secondary)]" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => handleSearch(e.target.value)} className="h-10 sm:h-11 pl-9 rounded-full border-[var(--sk-border)] bg-transparent text-[var(--sk-text)]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-4 sm:p-6"><TableSkeleton rows={5} /></div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-px">
              <table className="w-full min-w-[640px]">
                <thead><tr className="border-b border-[var(--sk-border)]">
                  <th className="text-left px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider">Merchant</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider">Amount</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-[11px] font-semibold text-[var(--sk-text-secondary)] uppercase tracking-wider hidden sm:table-cell">Actions</th>
                </tr></thead>
                <tbody>{transactions.map((tx) => {
                  const c = CC[tx.category] || '#8B5CF6';
                  return (
                    <tr key={tx.id} className="border-b border-[var(--sk-border-light)] hover:bg-[var(--sk-border-light)]/50 transition-colors cursor-pointer group" onClick={() => { setSelectedTx(tx); setDrawerOpen(true); }}>
                      <td className="px-4 sm:px-6 py-3"><div className="flex items-center gap-2.5 sm:gap-3"><div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0" style={{ backgroundColor: c }}>{tx.merchant.charAt(0)}</div><div className="min-w-0"><p className="text-sm font-medium text-[var(--sk-text)] truncate">{tx.merchant}</p><p className="text-xs text-[var(--sk-text-secondary)] truncate">{tx.description}</p></div></div></td>
                      <td className="px-4 sm:px-6 py-3 hidden sm:table-cell"><span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium" style={{ backgroundColor: `${c}15`, color: c }}>{tx.category}</span></td>
                      <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-[var(--sk-text-secondary)] hidden md:table-cell">{formatDate(tx.date)}</td>
                      <td className="px-4 sm:px-6 py-3 text-right"><span className={`text-sm font-semibold tabular-nums ${tx.type === 'income' ? 'text-green-500' : 'text-[var(--sk-text)]'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</span></td>
                      <td className="px-4 sm:px-6 py-3 hidden sm:table-cell"><div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); setDrawerOpen(true); }} className="p-1.5 rounded-lg hover:bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)]"><Eye className="w-3.5 h-3.5" /></button></div></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[var(--sk-border)]">
              <p className="text-xs text-[var(--sk-text-secondary)] order-2 sm:order-1">Showing {((page - 1) * 10) + 1}-{Math.min(page * 10, total)} of {total}</p>
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button disabled={page === 1} className="p-2 rounded-lg hover:bg-[var(--sk-border-light)] disabled:opacity-30 text-[var(--sk-text-secondary)]"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => <button key={i} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === i + 1 ? 'bg-[#8B5CF6] text-white' : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]'}`}>{i + 1}</button>)}
                <button disabled={page === totalPages} className="p-2 rounded-lg hover:bg-[var(--sk-border-light)] disabled:opacity-30 text-[var(--sk-text-secondary)]"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[20px] sm:rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)]">
          <div className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-[var(--sk-border)]">
            <DialogHeader><DialogTitle className="text-lg sm:text-xl font-semibold text-[var(--sk-text)]">Add Transaction</DialogTitle></DialogHeader>
          </div>
          <div className="p-5 sm:p-6 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-[var(--sk-text-secondary)]">Amount</Label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--sk-text-secondary)]">&#8372;</span><Input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="h-10 sm:h-11 pl-7 rounded-xl border-[var(--sk-border)] bg-transparent text-[var(--sk-text)]" /></div></div>
              <div className="space-y-1.5"><Label className="text-xs text-[var(--sk-text-secondary)]">Type</Label><div className="flex rounded-xl border border-[var(--sk-border)] overflow-hidden h-10 sm:h-11"><button onClick={() => setFormData({ ...formData, type: 'income' })} className={`flex-1 text-xs sm:text-sm font-medium ${formData.type === 'income' ? 'bg-green-500/10 text-green-500' : 'text-[var(--sk-text-secondary)]'}`}>Income</button><button onClick={() => setFormData({ ...formData, type: 'expense' })} className={`flex-1 text-xs sm:text-sm font-medium ${formData.type === 'expense' ? 'bg-red-500/10 text-red-400' : 'text-[var(--sk-text-secondary)]'}`}>Expense</button></div></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-[var(--sk-text-secondary)]">Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}><SelectTrigger className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] bg-transparent text-[var(--sk-text)]"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs text-[var(--sk-text-secondary)]">Merchant</Label><Input placeholder="e.g. Silpo, Bolt..." value={formData.merchant} onChange={(e) => setFormData({ ...formData, merchant: e.target.value })} className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] bg-transparent text-[var(--sk-text)]" /></div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-[var(--sk-text-secondary)]">Date</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] bg-transparent text-[var(--sk-text)]" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-[var(--sk-text-secondary)]">Source</Label><Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v as 'manual' | 'monobank' | 'ai' })}><SelectTrigger className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] bg-transparent text-[var(--sk-text)]"><SelectValue placeholder="Source" /></SelectTrigger><SelectContent><SelectItem value="manual">Manual</SelectItem><SelectItem value="monobank">Monobank</SelectItem><SelectItem value="ai">AI</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-[var(--sk-text-secondary)]">Notes</Label><Textarea placeholder="Add notes..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="rounded-xl border-[var(--sk-border)] bg-transparent text-[var(--sk-text)] min-h-[60px] sm:min-h-[80px] resize-none" /></div>
          </div>
          <div className="p-5 sm:p-6 pt-0 flex gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 h-10 sm:h-11 rounded-full border-[var(--sk-border)] text-xs sm:text-sm text-[var(--sk-text)]">Cancel</Button>
            <Button onClick={handleAdd} disabled={!formData.amount || !formData.merchant} className="flex-1 h-10 sm:h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-xs sm:text-sm">Save Transaction</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-[420px] p-0 bg-[var(--sk-card)] border-0 rounded-l-[20px] sm:rounded-l-none border-l border-[var(--sk-border)]">
          {selectedTx && (
            <>
              <SheetHeader className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-[var(--sk-border)]">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Transaction Details</SheetTitle>
                  <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--sk-border-light)]"><X className="w-4 h-4 text-[var(--sk-text-secondary)]" /></button>
                </div>
              </SheetHeader>
              <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-lg sm:text-xl font-bold" style={{ backgroundColor: CC[selectedTx.category] || '#8B5CF6' }}>{selectedTx.merchant.charAt(0)}</div>
                  <p className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">{selectedTx.type === 'income' ? '+' : '-'}{formatCurrency(selectedTx.amount)}</p>
                  <p className="text-sm text-[var(--sk-text-secondary)] mt-1">{selectedTx.merchant}</p>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  {[{ label: 'Date', value: formatDate(selectedTx.date) }, { label: 'Category', value: selectedTx.category }, { label: 'Source', value: selectedTx.source === 'monobank' ? 'Monobank' : selectedTx.source === 'ai' ? 'AI Assistant' : 'Manual' }, { label: 'Type', value: selectedTx.type === 'income' ? 'Income' : 'Expense' }, { label: 'Description', value: selectedTx.description || '—' }, { label: 'Notes', value: selectedTx.notes || '—' }].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-[var(--sk-border-light)]"><span className="text-sm text-[var(--sk-text-secondary)]">{item.label}</span><span className="text-sm font-medium text-[var(--sk-text)]">{item.value}</span></div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setDrawerOpen(false); toast.success('Deleted'); }} className="flex-1 h-10 sm:h-11 rounded-full border-red-200 text-red-400 hover:bg-red-500/10 text-xs sm:text-sm">Delete</Button>
                  <Button className="flex-1 h-10 sm:h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-xs sm:text-sm">Edit</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
