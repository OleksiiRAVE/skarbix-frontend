import { Routes, Route, Navigate } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';

// Dashboard (app) pages
import DashboardPage from '@/app/dashboard/page';
import TransactionsPage from '@/app/transactions/page';
import AccountsPage from '@/app/accounts/page';
import CategoriesPage from '@/app/categories/page';
import DebtsPage from '@/app/debts/page';
import SubscriptionsPage from '@/app/subscriptions/page';
import AnalyticsPage from '@/app/analytics/page';
import CapitalPage from '@/app/capital/page';
import CalendarPage from '@/app/calendar/page';
import BudgetsPage from '@/app/budgets/page';
import GoalsPage from '@/app/goals/page';
import AIAssistantPage from '@/app/ai-assistant/page';
import PaymentsPage from '@/app/payments/page';
import HistoryPage from '@/app/history/page';
import SettingsPage from '@/app/settings/page';

// Landing & static pages
import LandingPage from '@/app/landing/page';
import AuthPage from '@/app/auth/page';
import OnboardingPage from '@/app/onboarding/page';
import HelpCenterPage from '@/app/help/page';
import ContactPage from '@/app/contact/page';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';
import CookiesPage from '@/app/cookies/page';

// App layout wrapper (with sidebar + topbar)
function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <Routes>
      {/* Landing page - no sidebar */}
      <Route path="/landing" element={<LandingPage />} />

      {/* Auth & onboarding - no sidebar */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Static pages - no sidebar */}
      <Route path="/help" element={<HelpCenterPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />

      {/* App pages - with sidebar + topbar */}
      <Route path="/" element={<AppLayout><DashboardPage /></AppLayout>} />
      <Route path="/transactions" element={<AppLayout><TransactionsPage /></AppLayout>} />
      <Route path="/accounts" element={<AppLayout><AccountsPage /></AppLayout>} />
      <Route path="/categories" element={<AppLayout><CategoriesPage /></AppLayout>} />
      <Route path="/debts" element={<AppLayout><DebtsPage /></AppLayout>} />
      <Route path="/subscriptions" element={<AppLayout><SubscriptionsPage /></AppLayout>} />
      <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />
      <Route path="/capital" element={<AppLayout><CapitalPage /></AppLayout>} />
      <Route path="/calendar" element={<AppLayout><CalendarPage /></AppLayout>} />
      <Route path="/budgets" element={<AppLayout><BudgetsPage /></AppLayout>} />
      <Route path="/goals" element={<AppLayout><GoalsPage /></AppLayout>} />
      <Route path="/ai-assistant" element={<AppLayout><AIAssistantPage /></AppLayout>} />
      <Route path="/payments" element={<AppLayout><PaymentsPage /></AppLayout>} />
      <Route path="/history" element={<AppLayout><HistoryPage /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
