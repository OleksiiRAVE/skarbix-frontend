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

const MARKETING_HOSTS = new Set(['skarbix.xyz', 'www.skarbix.xyz']);

function isMarketingHost() {
  return MARKETING_HOSTS.has(window.location.hostname.toLowerCase());
}

// App layout wrapper (with sidebar + topbar)
function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

function DashboardEntry() {
  if (isMarketingHost()) {
    return <LandingPage />;
  }

  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}

function AppPage({ children }: { children: React.ReactNode }) {
  if (isMarketingHost()) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function AppSurface({ children }: { children: React.ReactNode }) {
  if (isMarketingHost()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Landing page - no sidebar */}
      <Route path="/landing" element={<LandingPage />} />

      {/* Auth & onboarding - no sidebar */}
      <Route path="/auth" element={<AppSurface><AuthPage /></AppSurface>} />
      <Route path="/onboarding" element={<AppSurface><OnboardingPage /></AppSurface>} />

      {/* Static pages - no sidebar */}
      <Route path="/help" element={<HelpCenterPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />

      {/* App pages - with sidebar + topbar */}
      <Route path="/" element={<DashboardEntry />} />
      <Route path="/dashboard" element={<AppPage><DashboardPage /></AppPage>} />
      <Route path="/transactions" element={<AppPage><TransactionsPage /></AppPage>} />
      <Route path="/accounts" element={<AppPage><AccountsPage /></AppPage>} />
      <Route path="/categories" element={<AppPage><CategoriesPage /></AppPage>} />
      <Route path="/debts" element={<AppPage><DebtsPage /></AppPage>} />
      <Route path="/subscriptions" element={<AppPage><SubscriptionsPage /></AppPage>} />
      <Route path="/analytics" element={<AppPage><AnalyticsPage /></AppPage>} />
      <Route path="/capital" element={<AppPage><CapitalPage /></AppPage>} />
      <Route path="/calendar" element={<AppPage><CalendarPage /></AppPage>} />
      <Route path="/budgets" element={<AppPage><BudgetsPage /></AppPage>} />
      <Route path="/goals" element={<AppPage><GoalsPage /></AppPage>} />
      <Route path="/ai-assistant" element={<AppPage><AIAssistantPage /></AppPage>} />
      <Route path="/payments" element={<AppPage><PaymentsPage /></AppPage>} />
      <Route path="/history" element={<AppPage><HistoryPage /></AppPage>} />
      <Route path="/settings" element={<AppPage><SettingsPage /></AppPage>} />

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
