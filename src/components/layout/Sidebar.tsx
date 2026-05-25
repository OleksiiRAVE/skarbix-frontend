import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Receipt, Wallet, Tags, AlertCircle,
  Repeat, BarChart3, TrendingUp, CalendarDays, PiggyBank,
  Target, Sparkles, Hexagon, ChevronLeft, ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [{ label: 'sidebar.dashboard', path: '/', icon: LayoutDashboard }],
  },
  {
    label: 'sidebar.groupOperations',
    items: [
      { label: 'sidebar.transactions', path: '/transactions', icon: Receipt },
      { label: 'sidebar.accounts', path: '/accounts', icon: Wallet },
      { label: 'sidebar.categories', path: '/categories', icon: Tags },
      { label: 'sidebar.debts', path: '/debts', icon: AlertCircle },
      { label: 'sidebar.subscriptions', path: '/subscriptions', icon: Repeat },
    ],
  },
  {
    label: 'sidebar.groupAnalytics',
    items: [
      { label: 'sidebar.analytics', path: '/analytics', icon: BarChart3 },
      { label: 'sidebar.capital', path: '/capital', icon: TrendingUp },
      { label: 'sidebar.calendar', path: '/calendar', icon: CalendarDays },
    ],
  },
  {
    label: 'sidebar.groupPlanning',
    items: [
      { label: 'sidebar.budget', path: '/budgets', icon: PiggyBank },
      { label: 'sidebar.goals', path: '/goals', icon: Target },
      { label: 'sidebar.aiAssistant', path: '/ai-assistant', icon: Sparkles },
    ],
  },
];

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 68 : 232;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 border-r transition-[width] duration-300 ease-in-out"
        style={{
          width: sidebarWidth,
          backgroundColor: 'var(--sk-card)',
          borderColor: 'var(--sk-border)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-[60px] flex-shrink-0 transition-all duration-300"
          style={{ paddingLeft: collapsed ? 18 : 20, paddingRight: collapsed ? 18 : 20 }}
        >
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
              <Hexagon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span className="text-[#8B5CF6] font-semibold text-[15px] tracking-tight whitespace-nowrap">
                Skarbix
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-hide">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-5' : ''}>
              {/* Group label */}
              {group.label && !collapsed && (
                <div className="px-5 mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--sk-text-secondary)] opacity-50">
                    {t(group.label)}
                  </p>
                </div>
              )}
              {group.label && collapsed && (
                <div className="flex justify-center my-3">
                  <div className="w-8 h-px bg-[var(--sk-border)]" />
                </div>
              )}

              {/* Items */}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? t(item.label) : undefined}
                      className={`flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                        collapsed ? 'justify-center px-0 py-2.5 mx-2' : 'px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                          : 'text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)]'
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      {!collapsed && <span className="truncate">{t(item.label)}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="flex-shrink-0 p-2 border-t" style={{ borderColor: 'var(--sk-border)' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center rounded-xl text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-border-light)] transition-all duration-200 text-[12px] h-9 ${
              collapsed ? 'justify-center w-9 mx-auto' : 'justify-between px-3 w-full'
            }`}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex items-center justify-around px-1 py-1"
        style={{ backgroundColor: 'var(--sk-card)', borderColor: 'var(--sk-border)' }}
      >
        {[
          { label: 'sidebar.dashboard', path: '/', icon: LayoutDashboard },
          { label: 'sidebar.transactions', path: '/transactions', icon: Receipt },
          { label: 'sidebar.analytics', path: '/analytics', icon: BarChart3 },
          { label: 'sidebar.budget', path: '/budgets', icon: PiggyBank },
          { label: 'sidebar.aiAssistant', path: '/ai-assistant', icon: Sparkles },
        ].map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
                isActive ? 'text-[#8B5CF6]' : 'text-[var(--sk-text-secondary)]'
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium">{t(item.label)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
