import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { RedirectAuthed, RequireAuth } from '@/components/auth/AuthRoute';

// Dashboard (app) pages
const DashboardPage = lazy(() => import('@/app/dashboard/page'));
const TransactionsPage = lazy(() => import('@/app/transactions/page'));
const AccountsPage = lazy(() => import('@/app/accounts/page'));
const CategoriesPage = lazy(() => import('@/app/categories/page'));
const DebtsPage = lazy(() => import('@/app/debts/page'));
const SubscriptionsPage = lazy(() => import('@/app/subscriptions/page'));
const AnalyticsPage = lazy(() => import('@/app/analytics/page'));
const CapitalPage = lazy(() => import('@/app/capital/page'));
const CalendarPage = lazy(() => import('@/app/calendar/page'));
const BudgetsPage = lazy(() => import('@/app/budgets/page'));
const GoalsPage = lazy(() => import('@/app/goals/page'));
const AIAssistantPage = lazy(() => import('@/app/ai-assistant/page'));
const PaymentsPage = lazy(() => import('@/app/payments/page'));
const HistoryPage = lazy(() => import('@/app/history/page'));
const SettingsPage = lazy(() => import('@/app/settings/page'));

// Landing & static pages
const LandingPage = lazy(() => import('@/app/landing/page'));
const AuthPage = lazy(() => import('@/app/auth/page'));
const OnboardingPage = lazy(() => import('@/app/onboarding/page'));
const HelpCenterPage = lazy(() => import('@/app/help/page'));
const ContactPage = lazy(() => import('@/app/contact/page'));
const PrivacyPage = lazy(() => import('@/app/privacy/page'));
const TermsPage = lazy(() => import('@/app/terms/page'));
const CookiesPage = lazy(() => import('@/app/cookies/page'));

const MARKETING_HOSTS = new Set(['skarbix.xyz', 'www.skarbix.xyz']);

function isMarketingHost() {
  return MARKETING_HOSTS.has(window.location.hostname.toLowerCase());
}

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] flex items-center justify-center px-6">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--sk-border)] border-t-[#8B5CF6]"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}

// App layout wrapper (with sidebar + topbar)
function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

function DashboardEntry() {
  if (isMarketingHost()) {
    return <LandingPage />;
  }

  return <Navigate to="/dashboard" replace />;
}

function LandingEntry() {
  if (isMarketingHost()) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-[#8B5CF6]">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Not Found</h1>
      </div>
    </div>
  );
}

function AppPage({ children }: { children: React.ReactNode }) {
  if (isMarketingHost()) {
    return <Navigate to="/" replace />;
  }

  return (
    <RequireAuth>
      <AppLayout>{children}</AppLayout>
    </RequireAuth>
  );
}

function AppSurface({ children }: { children: React.ReactNode }) {
  if (isMarketingHost()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Landing page - no sidebar */}
        <Route path="/landing" element={<LandingEntry />} />

        {/* Auth & onboarding - no sidebar */}
        <Route path="/auth" element={<AppSurface><RedirectAuthed><AuthPage /></RedirectAuthed></AppSurface>} />
        <Route path="/onboarding" element={<AppSurface><RequireAuth><OnboardingPage /></RequireAuth></AppSurface>} />

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
    </Suspense>
  );
}
