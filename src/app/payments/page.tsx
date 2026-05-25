import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Repeat, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const scheduledPayments = [
  { id: '1', name: 'Kyivstar Internet', amount: 299, date: '2025-06-01', status: 'upcoming', recurring: true },
  { id: '2', name: 'Apartment Rent', amount: 8500, date: '2025-06-01', status: 'upcoming', recurring: true },
  { id: '3', name: 'Spotify Premium', amount: 129, date: '2025-06-22', status: 'upcoming', recurring: true },
  { id: '4', name: 'Netflix', amount: 199, date: '2025-06-21', status: 'upcoming', recurring: true },
  { id: '5', name: 'Electricity Bill', amount: 450, date: '2025-05-28', status: 'paid', recurring: false },
];

export default function PaymentsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--sk-text)] tracking-tight">Payments</h1>
          <p className="text-[var(--sk-text-secondary)] mt-1">Scheduled and recurring payments</p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="h-10 bg-black hover:bg-black/90 text-white rounded-full px-5"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Payment
        </Button>
      </motion.div>

      {/* Upcoming */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm"
      >
        <h3 className="text-lg font-semibold text-[var(--sk-text)] mb-4">Upcoming Payments</h3>
        <div className="space-y-0">
          {scheduledPayments.filter((p) => p.status === 'upcoming').map((payment, i) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex items-center gap-4 py-3.5 border-b border-[var(--sk-border-light)] last:border-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                {payment.recurring ? (
                  <Repeat className="w-4 h-4 text-[#8B5CF6]" />
                ) : (
                  <Calendar className="w-4 h-4 text-[#8B5CF6]" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--sk-text)]">{payment.name}</p>
                <p className="text-xs text-[var(--sk-text-secondary)]">{payment.date} · {payment.recurring ? 'Monthly' : 'One-time'}</p>
              </div>
              <span className="text-sm font-semibold text-[var(--sk-text)] tabular-nums">₴{payment.amount.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Paid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--sk-card)] rounded-[20px] p-6 border border-[var(--sk-border)] shadow-sm"
      >
        <h3 className="text-lg font-semibold text-[var(--sk-text)] mb-4">Paid</h3>
        <div className="space-y-0">
          {scheduledPayments.filter((p) => p.status === 'paid').map((payment) => (
            <div
              key={payment.id}
              className="flex items-center gap-4 py-3.5 border-b border-[var(--sk-border-light)] last:border-0 opacity-60"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--sk-text)]">{payment.name}</p>
                <p className="text-xs text-[var(--sk-text-secondary)]">{payment.date}</p>
              </div>
              <span className="text-sm font-semibold text-[var(--sk-text)] tabular-nums">₴{payment.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[24px] p-0 overflow-hidden border-0">
          <div className="p-6 pb-4 border-b border-[var(--sk-border)]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add Payment</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--sk-text-secondary)]">Payment Name</Label>
              <Input placeholder="e.g. Internet Bill" className="h-11 rounded-xl border-[var(--sk-border)]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--sk-text-secondary)]">Amount</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--sk-text-secondary)]">₴</span>
                <Input type="number" placeholder="0.00" className="h-11 pl-8 rounded-xl border-[var(--sk-border)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-[var(--sk-text-secondary)]">Due Date</Label>
                <Input type="date" className="h-11 rounded-xl border-[var(--sk-border)]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[var(--sk-text-secondary)]">Frequency</Label>
                <Select>
                  <SelectTrigger className="h-11 rounded-xl border-[var(--sk-border)]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">One-time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0 flex gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 h-11 rounded-full border-[var(--sk-border)]">
              Cancel
            </Button>
            <Button className="flex-1 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full">
              Add Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
