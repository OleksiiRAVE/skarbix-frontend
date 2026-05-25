import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Hexagon, ArrowRight, Sparkles, Shield, Zap, BarChart3,
  Wallet, Globe, Github, Twitter, Mail, Heart,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Our AI analyzes your spending patterns and provides personalized recommendations to help you save more.',
    color: '#8B5CF6',
  },
  {
    icon: Wallet,
    title: 'Multi-Bank Support',
    description: 'Connect your Monobank and other Ukrainian banks. All your finances in one unified dashboard.',
    color: '#3B82F6',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Beautiful charts and detailed reports. Understand where your money goes with visual breakdowns.',
    color: '#10B981',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'AES-256 encryption, secure API tokens, and complete data privacy. Your finances stay yours.',
    color: '#EF4444',
  },
  {
    icon: Zap,
    title: 'Real-Time Sync',
    description: 'Transactions sync automatically. No manual entry needed — Skarbix handles it all.',
    color: '#F59E0B',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Fully localized in Ukrainian and English. Switch languages instantly from your profile.',
    color: '#06B6D4',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Transactions Tracked' },
  { value: '₴500M+', label: 'Assets Managed' },
  { value: '99.9%', label: 'Uptime' },
];

const footerLinks = {
  product: [
    { label: 'Dashboard', path: '/' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Budgets', path: '/budgets' },
    { label: 'AI Assistant', path: '/ai-assistant' },
  ],
  support: [
    { label: 'Help Center', path: '/help' },
    { label: 'Contact Us', path: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: 'var(--sk-card)', borderColor: 'var(--sk-border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center">
              <Hexagon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[#8B5CF6] font-semibold text-base tracking-tight">Skarbix</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] transition-colors hidden sm:block">Sign In</Link>
            <Link to="/auth">
              <Button className="h-9 bg-[#0F0F0F] hover:bg-[#1F1F1F] text-white rounded-full text-sm px-5">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs sm:text-sm font-medium mb-6">
              <Star className="w-3.5 h-3.5" /> AI-Powered Finance Assistant
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 sm:mb-6">
              Your Money,<br className="hidden sm:block" />
              <span className="text-[#8B5CF6]"> Smarter</span>
            </h1>
            <p className="text-sm sm:text-lg text-[var(--sk-text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
              Track expenses, manage budgets, and gain AI-powered financial insights. All your Ukrainian bank accounts in one beautiful dashboard.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/auth">
                <Button className="h-11 sm:h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm sm:text-base font-medium px-6 sm:px-8">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/help">
                <Button variant="outline" className="h-11 sm:h-12 rounded-full text-sm sm:text-base font-medium px-5 sm:px-6 border-[var(--sk-border)]">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 border-y" style={{ borderColor: 'var(--sk-border)', backgroundColor: 'var(--sk-card)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-[#8B5CF6]">{stat.value}</p>
              <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">Everything You Need</h2>
            <p className="text-sm sm:text-base text-[var(--sk-text-secondary)] max-w-lg mx-auto">
              Powerful features designed for modern Ukrainian finance management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}12` }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-[#8B5CF6]/5 rounded-[20px] sm:rounded-[28px] border border-[#8B5CF6]/15 p-8 sm:p-12"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">Ready to Take Control?</h2>
          <p className="text-sm sm:text-base text-[var(--sk-text-secondary)] mb-6 max-w-md mx-auto">
            Join thousands of Ukrainians who trust Skarbix to manage their finances smarter.
          </p>
          <Link to="/auth">
            <Button className="h-11 sm:h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm sm:text-base font-medium px-8">
              Start for Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--sk-border)', backgroundColor: 'var(--sk-card)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center">
                  <Hexagon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[#8B5CF6] font-semibold text-sm">Skarbix</span>
              </Link>
              <p className="text-xs text-[var(--sk-text-secondary)] leading-relaxed mb-4">
                AI-powered personal finance assistant built for Ukraine.
              </p>
              <div className="flex items-center gap-2">
                {[Github, Twitter, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-7 h-7 rounded-lg bg-[var(--sk-border-light)] flex items-center justify-center text-[var(--sk-text-secondary)] hover:text-[#8B5CF6] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sk-text)] mb-3">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((l) => (
                  <li key={l.label}><Link to={l.path} className="text-xs text-[var(--sk-text-secondary)] hover:text-[#8B5CF6] transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sk-text)] mb-3">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((l) => (
                  <li key={l.label}><Link to={l.path} className="text-xs text-[var(--sk-text-secondary)] hover:text-[#8B5CF6] transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sk-text)] mb-3">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((l) => (
                  <li key={l.label}><Link to={l.path} className="text-xs text-[var(--sk-text-secondary)] hover:text-[#8B5CF6] transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: 'var(--sk-border)' }}>
            <p className="text-[11px] text-[var(--sk-text-secondary)]">&copy; {new Date().getFullYear()} Skarbix. All rights reserved.</p>
            <p className="text-[11px] text-[var(--sk-text-secondary)] flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400" /> in Ukraine
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
