import { Link } from 'react-router';
import { Hexagon, Github, Twitter, Mail, Heart } from 'lucide-react';

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

export function Footer() {
  return (
    <footer className="border-t transition-colors duration-300" style={{ borderColor: 'var(--sk-border)', backgroundColor: 'var(--sk-card)' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2 mb-2 sm:mb-0">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center">
                <Hexagon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[#8B5CF6] font-semibold text-base tracking-tight">Skarbix</span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs" style={{ color: 'var(--sk-text-secondary)' }}>
              AI-powered personal finance assistant. Track expenses, manage budgets, and gain smart financial insights automatically.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--sk-border-light)', color: 'var(--sk-text-secondary)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#8B5CF6')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sk-text-secondary)')}>
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--sk-border-light)', color: 'var(--sk-text-secondary)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#8B5CF6')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sk-text-secondary)')}>
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--sk-border-light)', color: 'var(--sk-text-secondary)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#8B5CF6')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sk-text-secondary)')}>
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--sk-text)' }}>Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-xs sm:text-sm transition-colors hover:text-[#8B5CF6]" style={{ color: 'var(--sk-text-secondary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--sk-text)' }}>Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-xs sm:text-sm transition-colors hover:text-[#8B5CF6]" style={{ color: 'var(--sk-text-secondary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--sk-text)' }}>Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-xs sm:text-sm transition-colors hover:text-[#8B5CF6]" style={{ color: 'var(--sk-text-secondary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'var(--sk-border)' }}>
          <p className="text-[11px] sm:text-xs" style={{ color: 'var(--sk-text-secondary)' }}>
            &copy; {new Date().getFullYear()} Skarbix. All rights reserved.
          </p>
          <p className="text-[11px] sm:text-xs flex items-center gap-1" style={{ color: 'var(--sk-text-secondary)' }}>
            Made with <Heart className="w-3 h-3 text-red-400" /> in Ukraine
          </p>
        </div>
      </div>
    </footer>
  );
}
