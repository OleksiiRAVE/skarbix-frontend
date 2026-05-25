import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, CreditCard, Wallet, Shield, Bell, Sparkles } from 'lucide-react';

const categories = [
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'accounts', label: 'Accounts', icon: CreditCard },
  { id: 'transactions', label: 'Transactions', icon: Wallet },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
];

const faqs = [
  {
    category: 'general',
    question: 'What is Skarbix?',
    answer: 'Skarbix is an AI-powered personal finance assistant that helps you track expenses, manage budgets, analyze spending patterns, and stay on top of your financial health — all in one place.',
  },
  {
    category: 'general',
    question: 'Is Skarbix free to use?',
    answer: 'Yes! Skarbix core features are completely free — budgeting, expense tracking, analytics, and AI insights. We may introduce premium features in the future for advanced users.',
  },
  {
    category: 'accounts',
    question: 'How do I connect my Monobank account?',
    answer: 'Go to Settings → Connected Banks, enter your Monobank API token, and click Connect. Your transactions will sync automatically. You can get your API token from the Monobank app under Settings → API.',
  },
  {
    category: 'accounts',
    question: 'Is my banking data secure?',
    answer: 'Absolutely. We use bank-grade encryption (AES-256) for all data. Your Monobank token is encrypted and never stored in plain text. We never share your data with third parties.',
  },
  {
    category: 'transactions',
    question: 'How are transactions categorized?',
    answer: 'Skarbix uses AI to automatically categorize your transactions based on merchant names and descriptions. You can also manually edit categories or create custom ones.',
  },
  {
    category: 'transactions',
    question: 'Can I add transactions manually?',
    answer: 'Yes! Go to the Transactions page and click "Add Transaction". You can also use the AI Assistant — just type "I spent 250 UAH on coffee" and Skarbix will create the transaction for you.',
  },
  {
    category: 'security',
    question: 'How do I enable two-factor authentication?',
    answer: 'Navigate to Settings → Security and toggle on "Two-Factor Authentication". You\'ll need an authenticator app like Google Authenticator or Authy to set it up.',
  },
  {
    category: 'security',
    question: 'How can I delete my account?',
    answer: 'Go to Settings → scroll to the "Danger Zone" section at the bottom. Click "Delete Account" and confirm. All your data will be permanently removed. This action cannot be undone.',
  },
  {
    category: 'notifications',
    question: 'How do budget alerts work?',
    answer: 'When you approach 80% of any budget limit, Skarbix sends you a notification. You can customize this threshold or turn off alerts in Settings → Notifications.',
  },
  {
    category: 'notifications',
    question: 'Can I turn off marketing emails?',
    answer: 'Yes. Go to Settings → Notifications and toggle off "Marketing Emails". You will still receive important account and security notifications.',
  },
  {
    category: 'ai',
    question: 'What can the AI Assistant do?',
    answer: 'The AI Assistant can create transactions from natural language, analyze your spending patterns, suggest budgets, track debts, answer financial questions, and provide personalized financial insights.',
  },
  {
    category: 'ai',
    question: 'How does the AI understand my spending?',
    answer: 'Skarbix AI analyzes your transaction history, categories, and spending patterns to provide insights. All processing happens securely — your raw data is never sent to external AI services.',
  },
];

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = faqs.filter((f) => {
    const matchesCategory = f.category === activeCategory;
    const matchesSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--sk-text)] tracking-tight">Help Center</h1>
        <p className="text-[var(--sk-text-secondary)] mt-2 text-sm sm:text-base">Find answers to your questions</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sk-text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for answers..."
          className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-full border border-[var(--sk-border)] bg-[var(--sk-card)] text-sm text-[var(--sk-text)] placeholder:text-[var(--sk-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all"
        />
      </motion.div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-start sm:justify-center">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(0); }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-[var(--sk-card)] text-[var(--sk-text-secondary)] border border-[var(--sk-border)] hover:border-[var(--sk-text-secondary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {cat.label}
            </button>
          );
        })}
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2 sm:space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--sk-text-secondary)] text-sm">No results found for &quot;{search}&quot;</p>
          </div>
        )}
        {filtered.map((faq, i) => (
          <div
            key={i}
            className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left transition-colors hover:bg-[var(--sk-border-light)]/50"
            >
              <span className="text-sm sm:text-base font-medium text-[var(--sk-text)]">{faq.question}</span>
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[var(--sk-text-secondary)] flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 sm:px-5 pb-4 sm:pb-5"
              >
                <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Contact CTA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#8B5CF6]/5 rounded-[16px] sm:rounded-[20px] border border-[#8B5CF6]/15 p-5 sm:p-6 text-center">
        <p className="text-sm sm:text-base text-[var(--sk-text)] font-medium mb-1">Still have questions?</p>
        <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mb-3 sm:mb-4">Our team is happy to help you out.</p>
        <a
          href="#/contact"
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium transition-all"
        >
          Contact Us
        </a>
      </motion.div>
    </div>
  );
}
