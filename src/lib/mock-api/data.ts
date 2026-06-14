import type {
  User, Account, Transaction, Category, Budget, Debt,
  AIMessage, Notification, AnalyticsData, MonobankConnection,
  CashFlowData, TransactionOverviewData, HistoryEvent
} from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Skarbix User',
  email: 'user@skarbix.app',
  avatar: '',
  currency: 'UAH',
  theme: 'light',
};

export const mockAccounts: Account[] = [
  {
    id: 'acc1',
    userId: '1',
    name: 'Primary Card',
    type: 'card',
    balance: 124580.40,
    currency: 'UAH',
    cardNumber: '4253 5432 3521 3090',
    expiryDate: '09/28',
    bankName: 'Skarbix Virtual',
    isConnected: true,
  },
  {
    id: 'acc2',
    userId: '1',
    name: 'Cash',
    type: 'checking',
    balance: 8500.00,
    currency: 'UAH',
    isConnected: false,
  },
];

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Food & Drinks', icon: 'UtensilsCrossed', color: '#F59E0B', type: 'system', kind: 'expense', monthlySpent: 8450, monthlyBudget: 10000 },
  { id: 'cat2', name: 'Transport', icon: 'Car', color: '#8B5CF6', type: 'system', kind: 'expense', monthlySpent: 2340, monthlyBudget: 3000 },
  { id: 'cat3', name: 'Shopping', icon: 'ShoppingBag', color: '#EC4899', type: 'system', kind: 'expense', monthlySpent: 5600, monthlyBudget: 5000 },
  { id: 'cat4', name: 'Entertainment', icon: 'Film', color: '#10B981', type: 'system', kind: 'expense', monthlySpent: 1200, monthlyBudget: 2000 },
  { id: 'cat5', name: 'Bills', icon: 'Receipt', color: '#EF4444', type: 'system', kind: 'expense', monthlySpent: 4500, monthlyBudget: 4500 },
  { id: 'cat6', name: 'Health', icon: 'Heart', color: '#06B6D4', type: 'system', kind: 'expense', monthlySpent: 800, monthlyBudget: 1500 },
  { id: 'cat7', name: 'Income', icon: 'TrendingUp', color: '#10B981', type: 'system', kind: 'income', monthlySpent: 0 },
  { id: 'cat8', name: 'Taxi', icon: 'Car', color: '#F97316', type: 'custom', kind: 'expense', monthlySpent: 1890, monthlyBudget: 2000 },
  { id: 'cat9', name: 'Groceries', icon: 'Apple', color: '#84CC16', type: 'custom', kind: 'expense', monthlySpent: 6200, monthlyBudget: 7000 },
  { id: 'cat10', name: 'Subscriptions', icon: 'CreditCard', color: '#6366F1', type: 'custom', kind: 'expense', monthlySpent: 597, monthlyBudget: 600 },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1', userId: '1', accountId: 'acc1', amount: 560.00, type: 'income', category: 'Income',
    categoryId: 'cat7', merchant: 'Stripe', description: 'Deposit',
    date: '2025-05-25T07:18:00', source: 'manual',
    createdAt: '2025-05-25T07:18:00', updatedAt: '2025-05-25T07:18:00',
  },
  {
    id: 't2', userId: '1', accountId: 'acc1', amount: 560.00, type: 'income', category: 'Income',
    categoryId: 'cat7', merchant: 'Cashback', description: 'Business cashback',
    date: '2025-05-01T11:44:00', source: 'manual',
    createdAt: '2025-05-01T11:44:00', updatedAt: '2025-05-01T11:44:00',
  },
  {
    id: 't3', userId: '1', accountId: 'acc1', amount: 60.00, type: 'expense', category: 'Food & Drinks',
    categoryId: 'cat1', merchant: 'Amazon', description: 'Refund from amazon',
    date: '2025-05-25T07:18:00', source: 'manual', notes: 'Partial refund',
    createdAt: '2025-05-25T07:18:00', updatedAt: '2025-05-25T07:18:00',
  },
  {
    id: 't4', userId: '1', accountId: 'acc1', amount: 1245.00, type: 'expense', category: 'Groceries',
    categoryId: 'cat9', merchant: 'Silpo', description: 'Weekly groceries',
    date: '2025-05-24T16:30:00', source: 'monobank',
    createdAt: '2025-05-24T16:30:00', updatedAt: '2025-05-24T16:30:00',
  },
  {
    id: 't5', userId: '1', accountId: 'acc2', amount: 89.00, type: 'expense', category: 'Taxi',
    categoryId: 'cat8', merchant: 'Bolt', description: 'Ride to office',
    date: '2025-05-24T08:15:00', source: 'monobank',
    createdAt: '2025-05-24T08:15:00', updatedAt: '2025-05-24T08:15:00',
  },
  {
    id: 't6', userId: '1', accountId: 'acc1', amount: 156.00, type: 'expense', category: 'Taxi',
    categoryId: 'cat8', merchant: 'Uklon', description: 'Airport transfer',
    date: '2025-05-23T20:00:00', source: 'manual',
    createdAt: '2025-05-23T20:00:00', updatedAt: '2025-05-23T20:00:00',
  },
  {
    id: 't7', userId: '1', accountId: 'acc1', amount: 349.00, type: 'expense', category: 'Shopping',
    categoryId: 'cat3', merchant: 'Rozetka', description: 'Electronics',
    date: '2025-05-23T14:20:00', source: 'monobank',
    createdAt: '2025-05-23T14:20:00', updatedAt: '2025-05-23T14:20:00',
  },
  {
    id: 't8', userId: '1', accountId: 'acc2', amount: 245.00, type: 'expense', category: 'Food & Drinks',
    categoryId: 'cat1', merchant: "McDonald's", description: 'Lunch',
    date: '2025-05-22T13:00:00', source: 'manual',
    createdAt: '2025-05-22T13:00:00', updatedAt: '2025-05-22T13:00:00',
  },
  {
    id: 't9', userId: '1', accountId: 'acc1', amount: 129.00, type: 'expense', category: 'Subscriptions',
    categoryId: 'cat10', merchant: 'Spotify', description: 'Premium subscription',
    date: '2025-05-22T00:00:00', source: 'monobank',
    createdAt: '2025-05-22T00:00:00', updatedAt: '2025-05-22T00:00:00',
  },
  {
    id: 't10', userId: '1', accountId: 'acc2', amount: 199.00, type: 'expense', category: 'Subscriptions',
    categoryId: 'cat10', merchant: 'Netflix', description: 'Monthly subscription',
    date: '2025-05-21T00:00:00', source: 'monobank',
    createdAt: '2025-05-21T00:00:00', updatedAt: '2025-05-21T00:00:00',
  },
  {
    id: 't11', userId: '1', accountId: 'acc1', amount: 450.00, type: 'expense', category: 'Shopping',
    categoryId: 'cat3', merchant: 'Nova Poshta', description: 'Delivery payment',
    date: '2025-05-20T10:30:00', source: 'manual',
    createdAt: '2025-05-20T10:30:00', updatedAt: '2025-05-20T10:30:00',
  },
  {
    id: 't12', userId: '1', accountId: 'acc2', amount: 289.00, type: 'expense', category: 'Food & Drinks',
    categoryId: 'cat1', merchant: 'Glovo', description: 'Food delivery',
    date: '2025-05-19T19:45:00', source: 'monobank',
    createdAt: '2025-05-19T19:45:00', updatedAt: '2025-05-19T19:45:00',
  },
  {
    id: 't13', userId: '1', accountId: 'acc1', amount: 15000.00, type: 'income', category: 'Income',
    categoryId: 'cat7', merchant: 'Freelance', description: 'Project payment',
    date: '2025-05-15T09:00:00', source: 'manual',
    createdAt: '2025-05-15T09:00:00', updatedAt: '2025-05-15T09:00:00',
  },
  {
    id: 't14', userId: '1', accountId: 'acc2', amount: 1200.00, type: 'expense', category: 'Bills',
    categoryId: 'cat5', merchant: 'Kyivstar', description: 'Internet + Mobile',
    date: '2025-05-10T00:00:00', source: 'manual',
    createdAt: '2025-05-10T00:00:00', updatedAt: '2025-05-10T00:00:00',
  },
  {
    id: 't15', userId: '1', accountId: 'acc1', amount: 3200.00, type: 'expense', category: 'Bills',
    categoryId: 'cat5', merchant: 'Rent', description: 'Monthly rent',
    date: '2025-05-01T00:00:00', source: 'manual',
    createdAt: '2025-05-01T00:00:00', updatedAt: '2025-05-01T00:00:00',
  },
];

export const mockBudgets: Budget[] = [
  { id: 'b1', userId: '1', categoryId: 'cat1', categoryName: 'Food & Drinks', categoryColor: '#F59E0B', amount: 10000, spent: 8450, period: 'monthly', month: 5, year: 2025, alertThreshold: 85 },
  { id: 'b2', userId: '1', categoryId: 'cat8', categoryName: 'Taxi', categoryColor: '#F97316', amount: 2000, spent: 1890, period: 'monthly', month: 5, year: 2025, alertThreshold: 90 },
  { id: 'b3', userId: '1', categoryId: 'cat9', categoryName: 'Groceries', categoryColor: '#84CC16', amount: 7000, spent: 6200, period: 'monthly', month: 5, year: 2025, alertThreshold: 80 },
  { id: 'b4', userId: '1', categoryId: 'cat3', categoryName: 'Shopping', categoryColor: '#EC4899', amount: 5000, spent: 5600, period: 'monthly', month: 5, year: 2025, alertThreshold: 100 },
  { id: 'b5', userId: '1', categoryId: 'cat4', categoryName: 'Entertainment', categoryColor: '#10B981', amount: 2000, spent: 1200, period: 'monthly', month: 5, year: 2025, alertThreshold: 75 },
  { id: 'b6', userId: '1', categoryId: 'cat5', categoryName: 'Bills', categoryColor: '#EF4444', amount: 4500, spent: 4500, period: 'monthly', month: 5, year: 2025, alertThreshold: 95 },
];

export const mockDebts: Debt[] = [
  {
    id: 'd1', userId: '1', personName: 'Sasha Petrov', amount: 1200,
    currency: 'UAH', direction: 'owed_to_me', dueDate: '2025-05-30',
    status: 'pending', notes: 'Lunch and taxi money',
    createdAt: '2025-05-20T10:00:00',
  },
  {
    id: 'd2', userId: '1', personName: 'Maria Ivanova', amount: 3500,
    currency: 'UAH', direction: 'owed_to_me', dueDate: '2025-06-05',
    status: 'pending', notes: 'Concert tickets',
    createdAt: '2025-05-15T14:00:00',
  },
  {
    id: 'd3', userId: '1', personName: 'Dmytro Kovalenko', amount: 800,
    currency: 'UAH', direction: 'i_owe', dueDate: '2025-05-28',
    status: 'pending', notes: 'Coffee and snacks',
    createdAt: '2025-05-22T09:00:00',
  },
  {
    id: 'd4', userId: '1', personName: 'Olena Shevchenko', amount: 2000,
    currency: 'UAH', direction: 'owed_to_me',
    status: 'paid', notes: 'Gift split',
    createdAt: '2025-04-10T12:00:00', settledAt: '2025-04-25T12:00:00',
  },
];

export const mockAIMessages: AIMessage[] = [
  {
    id: 'ai1', role: 'assistant',
    content: 'Hello! I\'m your Skarbix AI assistant. I can help you track expenses, manage debts, create budgets, and analyze your spending patterns. How can I help you today?',
    timestamp: '2025-05-25T08:00:00',
  },
  {
    id: 'ai2', role: 'user',
    content: 'I spent 450 UAH on taxi today',
    timestamp: '2025-05-25T08:05:00',
  },
  {
    id: 'ai3', role: 'assistant',
    content: 'I found a taxi expense. Here are the details:',
    timestamp: '2025-05-25T08:05:02',
    parsedTransaction: {
      amount: 450, type: 'expense', category: 'Taxi',
      merchant: 'Taxi', date: '2025-05-25', confidence: 0.92,
    },
  },
  {
    id: 'ai4', role: 'user',
    content: 'How much did I spend on food this month?',
    timestamp: '2025-05-25T08:10:00',
  },
  {
    id: 'ai5', role: 'assistant',
    content: 'You\'ve spent ₴8,450 on food and drinks this month out of your ₴10,000 budget. That\'s 84.5% of your budget with 6 days remaining. You spent 23% more on restaurants this week compared to last week.',
    timestamp: '2025-05-25T08:10:03',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1', userId: '1', title: 'Budget Alert',
    message: 'Your Taxi budget is at 94.5%. Only ₴110 remaining.',
    type: 'budget', read: false, createdAt: '2025-05-25T09:00:00',
  },
  {
    id: 'n2', userId: '1', title: 'New Transaction',
    message: 'Bolt charged ₴89.00 for Taxi.',
    type: 'transaction', read: false, createdAt: '2025-05-24T08:20:00',
  },
  {
    id: 'n3', userId: '1', title: 'Debt Reminder',
    message: 'Sasha Petrov owes you ₴1,200. Due in 5 days.',
    type: 'debt', read: true, createdAt: '2025-05-20T10:00:00',
  },
  {
    id: 'n4', userId: '1', title: 'AI Insight',
    message: 'You spent 23% more on restaurants this week. Want to set a limit?',
    type: 'ai', read: true, createdAt: '2025-05-19T18:00:00',
  },
  {
    id: 'n5', userId: '1', title: 'Monobank Synced',
    message: 'Successfully imported 12 new transactions.',
    type: 'system', read: true, createdAt: '2025-05-18T14:30:00',
  },
];

export const mockMonobankConnection: MonobankConnection = {
  connected: true,
  status: 'connected',
  authMode: 'provider',
  lastSync: '2025-05-25T08:00:00',
  webhookEnabled: true,
  importedTransactions: 342,
  accountName: 'Monobank White',
};

export const mockCashFlowData: CashFlowData[] = [
  { month: 'Jan', income: 45000, expense: 32000, savings: 13000 },
  { month: 'Feb', income: 48000, expense: 35000, savings: 13000 },
  { month: 'Mar', income: 42000, expense: 38000, savings: 4000 },
  { month: 'Apr', income: 52000, expense: 34000, savings: 18000 },
  { month: 'May', income: 35000, expense: 28000, savings: 7000 },
  { month: 'Jun', income: 48000, expense: 31000, savings: 17000 },
  { month: 'Jul', income: 55000, expense: 42000, savings: 13000 },
  { month: 'Aug', income: 50000, expense: 36000, savings: 14000 },
  { month: 'Sep', income: 46000, expense: 33000, savings: 13000 },
  { month: 'Oct', income: 51000, expense: 35000, savings: 16000 },
  { month: 'Nov', income: 48000, expense: 37000, savings: 11000 },
  { month: 'Dec', income: 62000, expense: 45000, savings: 17000 },
];

export const mockTransactionOverviewData: TransactionOverviewData[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const baseCurrent = 2000 + Math.sin(day * 0.3) * 800 + Math.random() * 400;
  const basePrevious = 1800 + Math.sin(day * 0.3 + 1) * 600 + Math.random() * 300;
  return {
    date: `2025-05-${String(day).padStart(2, '0')}`,
    current: Math.round(baseCurrent),
    previous: Math.round(basePrevious),
  };
});

export const mockAnalyticsData: AnalyticsData = {
  monthlyIncome: [45000, 48000, 42000, 52000, 35000, 48000],
  monthlyExpense: [32000, 35000, 38000, 34000, 28000, 31000],
  monthlySavings: [13000, 13000, 4000, 18000, 7000, 17000],
  categoryBreakdown: [
    { name: 'Bills', amount: 4500, color: '#EF4444' },
    { name: 'Groceries', amount: 6200, color: '#84CC16' },
    { name: 'Shopping', amount: 5600, color: '#EC4899' },
    { name: 'Food & Drinks', amount: 8450, color: '#F59E0B' },
    { name: 'Taxi', amount: 2340, color: '#8B5CF6' },
    { name: 'Entertainment', amount: 1200, color: '#10B981' },
    { name: 'Subscriptions', amount: 597, color: '#6366F1' },
    { name: 'Health', amount: 800, color: '#06B6D4' },
  ],
  dailySpending: Array.from({ length: 30 }, (_, i) => ({
    date: `2025-05-${String(i + 1).padStart(2, '0')}`,
    amount: Math.round(200 + Math.random() * 1500),
  })),
  topMerchants: [
    { name: 'Silpo', amount: 6200, count: 12 },
    { name: 'Bolt', amount: 1890, count: 18 },
    { name: 'Rozetka', amount: 5600, count: 5 },
    { name: 'Kyivstar', amount: 1200, count: 1 },
    { name: 'Glovo', amount: 1450, count: 8 },
  ],
};

export const mockHistoryEvents: HistoryEvent[] = [
  { id: 'h1', type: 'monobank_sync', title: 'Monobank Synced', description: 'Successfully imported 12 new transactions from Monobank.', timestamp: '2025-05-25T08:00:00' },
  { id: 'h2', type: 'ai_transaction', title: 'AI Created Transaction', description: 'AI added taxi expense of ₴450 from your message.', timestamp: '2025-05-25T08:05:00' },
  { id: 'h3', type: 'budget_exceeded', title: 'Budget Exceeded', description: 'Shopping budget exceeded by ₴600.', timestamp: '2025-05-23T16:00:00' },
  { id: 'h4', type: 'debt_paid', title: 'Debt Settled', description: 'Olena Shevchenko paid back ₴2,000.', timestamp: '2025-04-25T12:00:00' },
  { id: 'h5', type: 'category_edit', title: 'Category Updated', description: 'You changed "Bolt" transactions to Taxi category.', timestamp: '2025-04-20T10:00:00' },
  { id: 'h6', type: 'setting_change', title: 'Settings Updated', description: 'Monthly budget increased to ₴45,000.', timestamp: '2025-04-01T00:00:00' },
];
