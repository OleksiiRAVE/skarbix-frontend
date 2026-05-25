import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { Bell, CreditCard, Settings, Sparkles } from "lucide-react";

import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { BankCard } from "@/components/dashboard/BankCard";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TransactionOverviewChart } from "@/components/dashboard/TransactionOverviewChart";
import { CardSkeleton, ChartSkeleton, DashboardSkeleton, TableSkeleton, TransactionListSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCashFlowData, mockTransactionOverviewData, mockTransactions } from "@/lib/mock-api/data";

function Surface({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <div className="min-h-screen bg-[var(--sk-bg)] p-6 text-[var(--sk-text)]">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </MemoryRouter>
  );
}

function DashboardComponents() {
  return (
    <Surface>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <BankCard />
          <BalanceCard balance={124580.4} change={14.5} changeAmount={18340} />
          <AIInsightCard />
        </div>
        <div className="space-y-6 lg:col-span-3">
          <CashFlowChart data={mockCashFlowData} />
          <TransactionOverviewChart data={mockTransactionOverviewData} />
          <RecentActivity transactions={mockTransactions} />
        </div>
      </div>
    </Surface>
  );
}

function UiKit() {
  return (
    <Surface>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Buttons and badges</CardTitle>
            <CardDescription>Primary controls used across the finance dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button>
              <Sparkles className="size-4" />
              Analyze
            </Button>
            <Button variant="secondary">
              <CreditCard className="size-4" />
              Add card
            </Button>
            <Button variant="outline">
              <Settings className="size-4" />
              Settings
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Badge>Connected</Badge>
            <Badge variant="secondary">Manual</Badge>
            <Badge variant="destructive">Over budget</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inputs and status</CardTitle>
            <CardDescription>Form controls for filters, settings and onboarding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input placeholder="Search transactions, merchants, categories" />
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <div className="font-medium">Monobank sync</div>
                <div className="text-sm text-muted-foreground">Import transactions automatically</div>
              </div>
              <Switch defaultChecked />
            </div>
            <Progress value={72} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Segmented financial views.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="income">
              <TabsList>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
                <TabsTrigger value="savings">Savings</TabsTrigger>
              </TabsList>
              <TabsContent value="income" className="mt-4 rounded-xl border p-4">Income view</TabsContent>
              <TabsContent value="expense" className="mt-4 rounded-xl border p-4">Expense view</TabsContent>
              <TabsContent value="savings" className="mt-4 rounded-xl border p-4">Savings view</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Surface>
  );
}

function SkeletonStates() {
  return (
    <Surface>
      <div className="space-y-8">
        <DashboardSkeleton />
        <div className="grid gap-6 lg:grid-cols-3">
          <CardSkeleton />
          <ChartSkeleton className="lg:col-span-2" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>List and table loading</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-2">
            <TransactionListSkeleton count={6} />
            <TableSkeleton rows={6} />
          </CardContent>
        </Card>
      </div>
    </Surface>
  );
}

const meta = {
  title: "Skarbix/Components",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DashboardCardsAndCharts: Story = {
  render: () => <DashboardComponents />,
};

export const UiKitControls: Story = {
  render: () => <UiKit />,
};

export const LoadingSkeletons: Story = {
  render: () => <SkeletonStates />,
};
