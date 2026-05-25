import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { AppShell } from "@/components/layout/AppShell";

import DashboardPage from "@/app/dashboard/page";
import TransactionsPage from "@/app/transactions/page";
import AccountsPage from "@/app/accounts/page";
import CategoriesPage from "@/app/categories/page";
import DebtsPage from "@/app/debts/page";
import SubscriptionsPage from "@/app/subscriptions/page";
import AnalyticsPage from "@/app/analytics/page";
import CapitalPage from "@/app/capital/page";
import CalendarPage from "@/app/calendar/page";
import BudgetsPage from "@/app/budgets/page";
import GoalsPage from "@/app/goals/page";
import AIAssistantPage from "@/app/ai-assistant/page";
import PaymentsPage from "@/app/payments/page";
import HistoryPage from "@/app/history/page";
import SettingsPage from "@/app/settings/page";
import LandingPage from "@/app/landing/page";
import AuthPage from "@/app/auth/page";
import OnboardingPage from "@/app/onboarding/page";
import HelpCenterPage from "@/app/help/page";
import ContactPage from "@/app/contact/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import CookiesPage from "@/app/cookies/page";

type PageDefinition = {
  title: string;
  path: string;
  withShell: boolean;
  Component: React.ComponentType;
};

const pages = {
  dashboard: { title: "Dashboard", path: "/", withShell: true, Component: DashboardPage },
  transactions: { title: "Transactions", path: "/transactions", withShell: true, Component: TransactionsPage },
  accounts: { title: "Accounts", path: "/accounts", withShell: true, Component: AccountsPage },
  categories: { title: "Categories", path: "/categories", withShell: true, Component: CategoriesPage },
  debts: { title: "Debts", path: "/debts", withShell: true, Component: DebtsPage },
  subscriptions: { title: "Subscriptions", path: "/subscriptions", withShell: true, Component: SubscriptionsPage },
  analytics: { title: "Analytics", path: "/analytics", withShell: true, Component: AnalyticsPage },
  capital: { title: "Capital", path: "/capital", withShell: true, Component: CapitalPage },
  calendar: { title: "Calendar", path: "/calendar", withShell: true, Component: CalendarPage },
  budgets: { title: "Budgets", path: "/budgets", withShell: true, Component: BudgetsPage },
  goals: { title: "Goals", path: "/goals", withShell: true, Component: GoalsPage },
  aiAssistant: { title: "AI Assistant", path: "/ai-assistant", withShell: true, Component: AIAssistantPage },
  payments: { title: "Payments", path: "/payments", withShell: true, Component: PaymentsPage },
  history: { title: "History", path: "/history", withShell: true, Component: HistoryPage },
  settings: { title: "Settings", path: "/settings", withShell: true, Component: SettingsPage },
  landing: { title: "Landing", path: "/landing", withShell: false, Component: LandingPage },
  auth: { title: "Auth", path: "/auth", withShell: false, Component: AuthPage },
  onboarding: { title: "Onboarding", path: "/onboarding", withShell: false, Component: OnboardingPage },
  help: { title: "Help Center", path: "/help", withShell: false, Component: HelpCenterPage },
  contact: { title: "Contact", path: "/contact", withShell: false, Component: ContactPage },
  privacy: { title: "Privacy", path: "/privacy", withShell: false, Component: PrivacyPage },
  terms: { title: "Terms", path: "/terms", withShell: false, Component: TermsPage },
  cookies: { title: "Cookies", path: "/cookies", withShell: false, Component: CookiesPage },
} satisfies Record<string, PageDefinition>;

type PageKey = keyof typeof pages;

function PageCanvas({ pageKey }: { pageKey: PageKey }) {
  const page = pages[pageKey];
  const Page = page.Component;

  return (
    <MemoryRouter initialEntries={[page.path]}>
      {page.withShell ? (
        <AppShell>
          <Page />
        </AppShell>
      ) : (
        <Page />
      )}
    </MemoryRouter>
  );
}

function PageIndex() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] p-8 text-[var(--sk-text)]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#8B5CF6]">Skarbix Storybook</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page inventory</h1>
          <p className="mt-2 text-sm text-[var(--sk-text-secondary)]">
            Every current route is listed here. Open the matching story in the sidebar to inspect it full-size.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(pages).map(([key, page]) => (
            <div key={key} className="rounded-2xl border border-[var(--sk-border)] bg-[var(--sk-card)] p-4 shadow-sm">
              <div className="text-base font-semibold">{page.title}</div>
              <div className="mt-1 text-sm text-[var(--sk-text-secondary)]">{page.path}</div>
              <div className="mt-3 text-xs font-medium text-[#8B5CF6]">
                {page.withShell ? "App shell" : "Standalone"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Skarbix/Pages",
  component: PageCanvas,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PageCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inventory: Story = {
  args: { pageKey: "dashboard" },
  render: () => <PageIndex />,
};

export const Dashboard: Story = { args: { pageKey: "dashboard" } };
export const Transactions: Story = { args: { pageKey: "transactions" } };
export const Accounts: Story = { args: { pageKey: "accounts" } };
export const Categories: Story = { args: { pageKey: "categories" } };
export const Debts: Story = { args: { pageKey: "debts" } };
export const Subscriptions: Story = { args: { pageKey: "subscriptions" } };
export const Analytics: Story = { args: { pageKey: "analytics" } };
export const Capital: Story = { args: { pageKey: "capital" } };
export const Calendar: Story = { args: { pageKey: "calendar" } };
export const Budgets: Story = { args: { pageKey: "budgets" } };
export const Goals: Story = { args: { pageKey: "goals" } };
export const AIAssistant: Story = { args: { pageKey: "aiAssistant" } };
export const Payments: Story = { args: { pageKey: "payments" } };
export const History: Story = { args: { pageKey: "history" } };
export const Settings: Story = { args: { pageKey: "settings" } };
export const Landing: Story = { args: { pageKey: "landing" } };
export const Auth: Story = { args: { pageKey: "auth" } };
export const Onboarding: Story = { args: { pageKey: "onboarding" } };
export const HelpCenter: Story = { args: { pageKey: "help" } };
export const Contact: Story = { args: { pageKey: "contact" } };
export const Privacy: Story = { args: { pageKey: "privacy" } };
export const Terms: Story = { args: { pageKey: "terms" } };
export const Cookies: Story = { args: { pageKey: "cookies" } };
