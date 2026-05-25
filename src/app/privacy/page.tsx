import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Share2, UserX } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: 'Information We Collect',
    content: `We collect information that you provide directly to us, including your name, email address, and financial data such as transactions and budgets. When you connect your Monobank account, we collect transaction data through their API. We also collect usage data to improve our services.`,
  },
  {
    icon: Lock,
    title: 'How We Protect Your Data',
    content: `We implement bank-grade security measures including AES-256 encryption for all sensitive data. Your Monobank API token is encrypted and never stored in plain text. All data transfers use TLS 1.3 encryption. We regularly conduct security audits and penetration testing.`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `We use your information to provide and improve Skarbix services, including: transaction categorization, budget tracking, spending analytics, AI-powered insights, and personalized recommendations. We do not sell your personal data to third parties.`,
  },
  {
    icon: Database,
    title: 'Data Storage',
    content: `Your data is stored on secure servers located within the European Union. We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently removed within 30 days in accordance with GDPR requirements.`,
  },
  {
    icon: Share2,
    title: 'Third-Party Services',
    content: `We use Monobank API to sync your transaction data. We may use third-party analytics tools to understand app usage patterns. All third-party providers are vetted for security compliance and bound by data protection agreements.`,
  },
  {
    icon: UserX,
    title: 'Your Rights',
    content: `Under GDPR, you have the right to access, rectify, erase, and port your personal data. You can exercise these rights through your account settings or by contacting us at privacy@skarbix.app. You may also object to certain processing activities.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-[#8B5CF6]" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--sk-text)] tracking-tight">Privacy Policy</h1>
        <p className="text-[var(--sk-text-secondary)] mt-2 text-sm sm:text-base">Last updated: May 2025</p>
      </motion.div>

      {/* Intro */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6">
        <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">
          Skarbix (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our personal finance management application.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-3 sm:space-y-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8B5CF6]" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">{section.title}</h3>
              </div>
              <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">{section.content}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center py-4">
        <p className="text-sm text-[var(--sk-text-secondary)]">
          Questions about privacy? Contact us at{' '}
          <a href="mailto:privacy@skarbix.app" className="text-[#8B5CF6] hover:underline font-medium">privacy@skarbix.app</a>
        </p>
      </motion.div>
    </div>
  );
}
