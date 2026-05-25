import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, CreditCard, User, RefreshCw } from 'lucide-react';

const sections = [
  {
    icon: CheckCircle,
    title: 'Acceptance of Terms',
    content: `By accessing or using Skarbix, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and others who access or use the service.`,
  },
  {
    icon: User,
    title: 'Account Registration',
    content: `To use certain features of Skarbix, you must register for an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are responsible for safeguarding your password and for all activities that occur under your account.`,
  },
  {
    icon: CreditCard,
    title: 'Financial Data & Bank Connections',
    content: `Skarbix allows you to connect your Monobank account to sync transaction data. You authorize us to access and process this data solely for the purpose of providing our services. We do not store your banking credentials. You may disconnect your bank account at any time through the Settings page.`,
  },
  {
    icon: FileText,
    title: 'User Content',
    content: `You retain ownership of any content you submit to Skarbix, including custom categories, notes, and budget settings. By submitting content, you grant us a license to use, store, and process it for the purpose of operating and improving our services.`,
  },
  {
    icon: AlertTriangle,
    title: 'Prohibited Activities',
    content: `You agree not to: (1) use Skarbix for any illegal purpose, (2) attempt to gain unauthorized access to our systems, (3) interfere with other users' accounts, (4) transmit any malware or harmful code, (5) use automated systems to access the service without permission, or (6) reverse engineer any part of the application.`,
  },
  {
    icon: RefreshCw,
    title: 'Modifications to Service',
    content: `We reserve the right to modify or discontinue Skarbix (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the service.`,
  },
];

export default function TermsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#8B5CF6]" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--sk-text)] tracking-tight">Terms of Service</h1>
        <p className="text-[var(--sk-text-secondary)] mt-2 text-sm sm:text-base">Last updated: May 2025</p>
      </motion.div>

      {/* Intro */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6">
        <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Skarbix personal finance management application and any related services (collectively, the &ldquo;Service&rdquo;). Please read these Terms carefully before using Skarbix.
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

      {/* Governing Law */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)] mb-2 sm:mb-3">Governing Law</h3>
        <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">
          These Terms shall be governed by and construed in accordance with the laws of Ukraine, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of Kyiv, Ukraine.
        </p>
      </motion.div>
    </div>
  );
}
