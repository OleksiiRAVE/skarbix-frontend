import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  Bell, Moon, Sun, ChevronDown, LogOut, User, Settings,
  Palette, Clock, TrendingUp, TrendingDown, Menu, Wallet, Tags,
  AlertCircle, Repeat, BarChart3, PiggyBank, Sparkles, History,
} from 'lucide-react';
import { useAppStore } from '@/store';
import type { Notification } from '@/types';
import { formatRelativeTime } from '@/lib/utils/format';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/mock-api/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/lib/auth/AuthProvider';

// Circular flag SVGs with clipPath
function FlagUA({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <defs>
        <clipPath id="clipUA"><circle cx="12" cy="12" r="11" /></clipPath>
      </defs>
      <g clipPath="url(#clipUA)">
        <rect x="0" y="0" width="24" height="12" fill="#0057B8" />
        <rect x="0" y="12" width="24" height="12" fill="#FFDD00" />
      </g>
      <circle cx="12" cy="12" r="11" fill="none" stroke="var(--sk-border)" strokeWidth="1" />
    </svg>
  );
}

function FlagGB({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <defs>
        <clipPath id="clipGB"><circle cx="12" cy="12" r="11" /></clipPath>
      </defs>
      <g clipPath="url(#clipGB)">
        <rect x="0" y="0" width="24" height="24" fill="#012169" />
        <path d="M12 0v24M0 12h24" stroke="white" strokeWidth="4" />
        <path d="M0 0l24 24M24 0L0 24" stroke="white" strokeWidth="3" />
        <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="2.5" />
        <path d="M0 0l24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.5" />
      </g>
      <circle cx="12" cy="12" r="11" fill="none" stroke="var(--sk-border)" strokeWidth="1" />
    </svg>
  );
}

const exchangeRates = [
  { pair: 'USD/UAH', flag: '$', buy: 41.25, sell: 41.85, trend: 'up' as const },
  { pair: 'EUR/UAH', flag: '€', buy: 44.80, sell: 45.65, trend: 'down' as const },
];

export function TopBar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const theme = useAppStore((s) => s.theme);
  const language = useAppStore((s) => s.language);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const user = useAppStore((s) => s.user);
  const [langOpen, setLangOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = user?.name || 'Account';
  const displayEmail = user?.email || 'Signed in';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    let active = true;
    const load = () => {
      void fetchNotifications()
        .then((items) => { if (active) setNotifications(items); })
        .catch(() => { if (active) setNotifications([]); });
    };
    load();
    const interval = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  const pageTitleKey = useMemo(() => {
    const map: Record<string, string> = {
      '/dashboard': 'dashboard.title',
      '/transactions': 'transactions.title',
      '/accounts': 'sidebar.accounts',
      '/categories': 'sidebar.categories',
      '/debts': 'debts.title',
      '/subscriptions': 'sidebar.subscriptions',
      '/analytics': 'sidebar.analytics',
      '/capital': 'sidebar.capital',
      '/calendar': 'sidebar.calendar',
      '/budgets': 'sidebar.budget',
      '/goals': 'sidebar.goals',
      '/ai-assistant': 'sidebar.aiAssistant',
      '/payments': 'payments.title',
      '/history': 'history.title',
      '/settings': 'sidebar.settings',
    };
    return map[location.pathname] || 'dashboard.title';
  }, [location.pathname]);

  const handleLangChange = (lang: 'uk' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const goToSettingsSection = (section: 'profile' | 'security' | 'appearance') => {
    navigate(`/settings?section=${section}`);
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markNotificationRead(notification.id);
    setNotifications((current) => current.map((item) => (
      item.id === notification.id ? { ...item, read: true } : item
    )));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const mobileLinks = [
    { label: 'sidebar.accounts', path: '/accounts', icon: Wallet },
    { label: 'sidebar.categories', path: '/categories', icon: Tags },
    { label: 'sidebar.debts', path: '/debts', icon: AlertCircle },
    { label: 'sidebar.subscriptions', path: '/subscriptions', icon: Repeat },
    { label: 'sidebar.analytics', path: '/analytics', icon: BarChart3 },
    { label: 'sidebar.budget', path: '/budgets', icon: PiggyBank },
    { label: 'sidebar.aiAssistant', path: '/ai-assistant', icon: Sparkles },
    { label: 'history.title', path: '/history', icon: History },
  ];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-5 lg:px-8 border-b"
      style={{
        backgroundColor: 'var(--sk-card)',
        borderColor: 'var(--sk-border)',
      }}
    >
      {/* Left: Page title area */}
      <div className="flex items-center gap-2 min-w-0">
        <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <PopoverTrigger asChild>
            <button className="lg:hidden p-2 -ml-1 rounded-xl text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]" aria-label="Open navigation">
              <Menu className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[calc(100vw-24px)] max-w-sm p-2 rounded-[16px] border shadow-lg"
            style={{ backgroundColor: 'var(--sk-card)', borderColor: 'var(--sk-border)' }}
            align="start"
          >
            <div className="grid grid-cols-2 gap-1">
              {mobileLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm text-left text-[var(--sk-text)] hover:bg-[var(--sk-border-light)]"
                >
                  <item.icon className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="truncate">{t(item.label)}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <h1 className="text-sm sm:text-base font-semibold text-[var(--sk-text)] truncate">
          {t(pageTitleKey)}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-0 sm:gap-2 flex-shrink-0">
        {/* Exchange Rates */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 mr-1">
          {exchangeRates.map((rate) => (
            <div key={rate.pair} className="flex items-center gap-1.5 text-xs">
              <span className="text-[var(--sk-text-secondary)] font-medium">{rate.flag}</span>
              <div className="flex flex-col leading-none">
                <span className="text-[var(--sk-text)] font-semibold text-[11px]">{rate.sell.toFixed(2)}</span>
              </div>
              {rate.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-[var(--sk-border)]" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all"
          title={t('topbar.theme')}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Language Switcher */}
        <Popover open={langOpen} onOpenChange={setLangOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-1 p-2 rounded-xl text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all"
              title={t('topbar.language')}
            >
              {language === 'uk' ? <FlagUA className="w-4 h-4" /> : <FlagGB className="w-4 h-4" />}
              <span className="text-xs font-medium hidden sm:inline">{language === 'uk' ? 'UA' : 'EN'}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-40 p-1.5 rounded-[14px] border shadow-lg"
            style={{ backgroundColor: 'var(--sk-card)', borderColor: 'var(--sk-border)' }}
            align="end"
          >
            <button
              onClick={() => handleLangChange('uk')}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all ${
                language === 'uk' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] font-medium' : 'text-[var(--sk-text)] hover:bg-[var(--sk-border-light)]'
              }`}
            >
              <FlagUA className="w-4 h-4" />
              {t('languages.uk')}
            </button>
            <button
              onClick={() => handleLangChange('en')}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all ${
                language === 'en' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] font-medium' : 'text-[var(--sk-text)] hover:bg-[var(--sk-border-light)]'
              }`}
            >
              <FlagGB className="w-4 h-4" />
              {t('languages.en')}
            </button>
          </PopoverContent>
        </Popover>

        {/* Notifications */}
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <button
              className="p-2 rounded-xl text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all"
              title={t('topbar.notifications')}
            >
              <span className="relative inline-block">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[calc(100vw-24px)] sm:w-80 p-0 rounded-[16px] border shadow-lg overflow-hidden"
            style={{ backgroundColor: 'var(--sk-card)', borderColor: 'var(--sk-border)' }}
            align="end"
          >
            <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--sk-border)' }}>
              <h3 className="font-semibold text-sm text-[var(--sk-text)]">{t('topbar.notifications')}</h3>
              <button onClick={handleMarkAllRead} className="text-xs text-[#8B5CF6] hover:underline">{t('topbar.markAllRead')}</button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-4 py-8 text-center text-xs text-[var(--sk-text-secondary)]">No new notifications</p>
              )}
              {notifications.slice(0, 8).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className="flex gap-3 p-3 w-full text-left transition-colors hover:bg-[var(--sk-border-light)]"
                  style={!n.read ? { backgroundColor: 'rgba(139,92,246,0.04)', borderLeft: '3px solid #8B5CF6' } : {}}
                >
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--sk-text)] truncate">{n.title}</p>
                    <p className="text-xs text-[var(--sk-text-secondary)] line-clamp-2">{n.message}</p>
                    <p className="text-[11px] text-[var(--sk-text-secondary)] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-[#8B5CF6] rounded-full flex-shrink-0 mt-1" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 pl-1 pr-1 sm:pr-2 py-1 rounded-xl hover:bg-[var(--sk-border-light)] transition-all">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                {initial}
              </div>
              <span className="text-xs sm:text-sm font-medium text-[var(--sk-text)] hidden sm:block">
                {displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--sk-text-secondary)] hidden sm:block" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-52 p-1.5 rounded-[14px] border shadow-lg"
            style={{ backgroundColor: 'var(--sk-card)', borderColor: 'var(--sk-border)' }}
            align="end"
          >
            <div className="p-2.5 border-b mb-1" style={{ borderColor: 'var(--sk-border)' }}>
              <p className="font-semibold text-sm text-[var(--sk-text)]">{displayName}</p>
              <p className="text-xs text-[var(--sk-text-secondary)]">{displayEmail}</p>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => goToSettingsSection('profile')}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all"
              >
                <User className="w-4 h-4 text-[var(--sk-text-secondary)]" />
                {t('topbar.profile')}
              </button>
              <button
                onClick={() => goToSettingsSection('security')}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all"
              >
                <Settings className="w-4 h-4 text-[var(--sk-text-secondary)]" />
                {t('topbar.settings')}
              </button>
              <button
                onClick={() => goToSettingsSection('appearance')}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all"
              >
                <Palette className="w-4 h-4 text-[var(--sk-text-secondary)]" />
                {t('topbar.appearance')}
              </button>
              <div className="border-t my-1" style={{ borderColor: 'var(--sk-border)' }} />
              <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" />
                {t('topbar.logout')}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.header>
  );
}
