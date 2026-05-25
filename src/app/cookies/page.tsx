import { motion } from 'framer-motion';
import { Cookie, Settings, XCircle, Clock } from 'lucide-react';

const cookieTypes = [
  {
    icon: Cookie,
    title: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.',
    examples: ['Session authentication', 'CSRF protection', 'Security tokens'],
    required: true,
  },
  {
    icon: Settings,
    title: 'Functional Cookies',
    description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
    examples: ['Theme preferences', 'Language settings', 'User preferences'],
    required: false,
  },
  {
    icon: Cookie,
    title: 'Analytics Cookies',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service.',
    examples: ['Page views', 'Feature usage', 'Error tracking'],
    required: false,
  },
];

export default function CookiesPage() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">
          <Cookie className="w-6 h-6 sm:w-7 sm:h-7 text-[#8B5CF6]" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--sk-text)] tracking-tight">Cookie Policy</h1>
        <p className="text-[var(--sk-text-secondary)] mt-2 text-sm sm:text-base">Last updated: May 2025</p>
      </motion.div>

      {/* Intro */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6">
        <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">
          Skarbix uses cookies and similar technologies to improve your browsing experience, analyze site traffic, and understand where our visitors come from. This policy explains what cookies are, how we use them, and your choices regarding their use.
        </p>
      </motion.div>

      {/* What Are Cookies */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8B5CF6]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">What Are Cookies?</h3>
        </div>
        <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">
          Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies can be &ldquo;persistent&rdquo; (remain on your device until they expire or you delete them) or &ldquo;session&rdquo; cookies (deleted when you close your browser).
        </p>
      </motion.div>

      {/* Cookie Types */}
      <div className="space-y-3 sm:space-y-4">
        {cookieTypes.map((type, i) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">{type.title}</h3>
                </div>
                {type.required ? (
                  <span className="text-[10px] sm:text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] px-2.5 py-1 rounded-full">Required</span>
                ) : (
                  <span className="text-[10px] sm:text-xs font-medium bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)] px-2.5 py-1 rounded-full">Optional</span>
                )}
              </div>
              <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed mb-3">{type.description}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {type.examples.map((ex) => (
                  <span key={ex} className="text-[10px] sm:text-xs bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)] px-2.5 py-1 rounded-full">
                    {ex}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Duration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8B5CF6]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Cookie Duration</h3>
        </div>
        <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">
          Session cookies expire when you close your browser. Persistent cookies remain on your device for up to 12 months or until you delete them. You can clear cookies at any time through your browser settings.
        </p>
      </motion.div>

      {/* How to Disable */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-red-500" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Managing Cookies</h3>
        </div>
        <p className="text-sm sm:text-[15px] text-[var(--sk-text-secondary)] leading-relaxed">
          Most web browsers allow you to control cookies through their settings. You can usually find these settings in the &ldquo;Options&rdquo; or &ldquo;Preferences&rdquo; menu of your browser. Please note that disabling certain cookies may affect the functionality of Skarbix.
        </p>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center py-4">
        <p className="text-sm text-[var(--sk-text-secondary)]">
          Questions about cookies? Contact us at{' '}
          <a href="mailto:privacy@skarbix.app" className="text-[#8B5CF6] hover:underline font-medium">privacy@skarbix.app</a>
        </p>
      </motion.div>
    </div>
  );
}
