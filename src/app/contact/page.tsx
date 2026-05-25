import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@skarbix.app',
    description: 'We reply within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Kyiv, Ukraine',
    description: 'Remote-first team',
  },
  {
    icon: Clock,
    title: 'Response Time',
    value: 'Mon–Fri, 9AM–6PM EET',
    description: 'Weekend support available',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--sk-text)] tracking-tight">Contact Us</h1>
        <p className="text-[var(--sk-text-secondary)] mt-2 text-sm sm:text-base">Have a question or feedback? We&apos;d love to hear from you.</p>
      </motion.div>

      {/* Info Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {contactInfo.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-4 sm:p-5 text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
              </div>
              <p className="text-sm font-semibold text-[var(--sk-text)] mb-0.5">{item.title}</p>
              <p className="text-sm text-[#8B5CF6] font-medium mb-1">{item.value}</p>
              <p className="text-xs text-[var(--sk-text-secondary)]">{item.description}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--sk-text)] mb-2">Message Sent!</h3>
              <p className="text-sm text-[var(--sk-text-secondary)]">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
                <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Send a Message</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[var(--sk-text-secondary)]">Full Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[var(--sk-text-secondary)]">Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[var(--sk-text-secondary)]">Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="What is this about?"
                  required
                  className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[var(--sk-text-secondary)]">Message</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us more details..."
                  required
                  className="min-h-[100px] sm:min-h-[120px] rounded-xl border-[var(--sk-border)] text-sm resize-none"
                />
              </div>
              <Button type="submit" className="h-10 sm:h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium px-6 sm:px-8">
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Send Message
              </Button>
            </form>
          )}
        </motion.div>

        {/* Side Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-3 sm:space-y-4"
        >
          <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-4 sm:p-5">
            <h4 className="text-sm font-semibold text-[var(--sk-text)] mb-3">Frequently Asked</h4>
            <div className="space-y-2">
              {[
                { q: 'How do I reset my password?', a: 'Go to Settings → Security and click "Update Password".' },
                { q: 'Can I export my data?', a: 'Yes! Visit Settings → Data Export to download CSV or PDF reports.' },
                { q: 'How does AI categorization work?', a: 'Our AI analyzes merchant names and automatically assigns categories. You can always edit them manually.' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-[var(--sk-border-light)] rounded-xl">
                  <p className="text-xs sm:text-sm font-medium text-[var(--sk-text)] mb-1">{item.q}</p>
                  <p className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#8B5CF6]/5 rounded-[16px] sm:rounded-[20px] border border-[#8B5CF6]/15 p-4 sm:p-5">
            <h4 className="text-sm font-semibold text-[var(--sk-text)] mb-2">Need faster help?</h4>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mb-3">
              Try our AI Assistant for instant answers to common questions about your finances.
            </p>
            <a
              href="#/ai-assistant"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#8B5CF6] hover:underline"
            >
              Open AI Assistant →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
