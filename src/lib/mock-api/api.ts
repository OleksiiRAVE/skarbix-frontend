import {
  mockUser, mockAccounts, mockTransactions, mockCategories,
  mockBudgets, mockDebts, mockAIMessages, mockNotifications,
  mockMonobankConnection, mockCashFlowData, mockTransactionOverviewData,
  mockAnalyticsData, mockHistoryEvents,
} from './data';
import type {
  Transaction, Category, Budget, Debt, AIMessage,
  Notification, MonobankConnection, CashFlowData,
  TransactionOverviewData, AnalyticsData, HistoryEvent,
  CapitalData,
} from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// User
export const fetchUser = async () => {
  await delay(400);
  return { ...mockUser };
};

// Accounts
export const fetchAccounts = async () => {
  await delay(300);
  return mockAccounts.map((a) => ({ ...a }));
};

// Transactions
export const fetchTransactions = async (filters?: {
  search?: string;
  category?: string;
  source?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{ transactions: Transaction[]; total: number }> => {
  await delay(500);
  let result = [...mockTransactions];

  if (filters?.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.merchant.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s)
    );
  }
  if (filters?.category) {
    result = result.filter((t) => t.categoryId === filters.category);
  }
  if (filters?.source) {
    result = result.filter((t) => t.source === filters.source);
  }
  if (filters?.type) {
    result = result.filter((t) => t.type === filters.type);
  }

  const total = result.length;
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  result = result.slice((page - 1) * limit, page * limit);

  return { transactions: result, total };
};

export const createTransaction = async (data: Partial<Transaction>) => {
  await delay(600);
  const newTx: Transaction = {
    id: `t${Date.now()}`,
    userId: '1',
    amount: data.amount || 0,
    type: data.type || 'expense',
    category: data.category || 'Uncategorized',
    categoryId: data.categoryId || 'cat1',
    merchant: data.merchant || 'Unknown',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    source: data.source || 'manual',
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTransactions.unshift(newTx);
  return newTx;
};

export const updateTransaction = async (id: string, data: Partial<Transaction>) => {
  await delay(400);
  const idx = mockTransactions.findIndex((t) => t.id === id);
  if (idx >= 0) {
    mockTransactions[idx] = { ...mockTransactions[idx], ...data, updatedAt: new Date().toISOString() };
    return mockTransactions[idx];
  }
  throw new Error('Transaction not found');
};

export const deleteTransaction = async (id: string) => {
  await delay(400);
  const idx = mockTransactions.findIndex((t) => t.id === id);
  if (idx >= 0) {
    mockTransactions.splice(idx, 1);
    return true;
  }
  throw new Error('Transaction not found');
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  await delay(300);
  return mockCategories.map((c) => ({ ...c }));
};

export const createCategory = async (data: Partial<Category>) => {
  await delay(400);
  const newCat: Category = {
    id: `cat${Date.now()}`,
    name: data.name || 'New Category',
    icon: data.icon || 'Tag',
    color: data.color || '#8B5CF6',
    type: 'custom',
    monthlySpent: 0,
    monthlyBudget: data.monthlyBudget,
  };
  mockCategories.push(newCat);
  return newCat;
};

// Budgets
export const fetchBudgets = async (): Promise<Budget[]> => {
  await delay(400);
  return mockBudgets.map((b) => ({ ...b }));
};

export const createBudget = async (data: Partial<Budget>) => {
  await delay(400);
  const newBudget: Budget = {
    id: `b${Date.now()}`,
    userId: '1',
    categoryId: data.categoryId || 'cat1',
    categoryName: data.categoryName || 'Uncategorized',
    categoryColor: data.categoryColor || '#8B5CF6',
    amount: data.amount || 0,
    spent: 0,
    period: data.period || 'monthly',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertThreshold: data.alertThreshold || 80,
  };
  mockBudgets.push(newBudget);
  return newBudget;
};

// Debts
export const fetchDebts = async (): Promise<Debt[]> => {
  await delay(400);
  return mockDebts.map((d) => ({ ...d }));
};

export const createDebt = async (data: Partial<Debt>) => {
  await delay(400);
  const newDebt: Debt = {
    id: `d${Date.now()}`,
    userId: '1',
    personName: data.personName || 'Unknown',
    amount: data.amount || 0,
    currency: data.currency || 'UAH',
    direction: data.direction || 'owed_to_me',
    dueDate: data.dueDate,
    status: 'pending',
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  };
  mockDebts.push(newDebt);
  return newDebt;
};

export const markDebtPaid = async (id: string) => {
  await delay(300);
  const idx = mockDebts.findIndex((d) => d.id === id);
  if (idx >= 0) {
    mockDebts[idx] = { ...mockDebts[idx], status: 'paid', settledAt: new Date().toISOString() };
    return mockDebts[idx];
  }
  throw new Error('Debt not found');
};

// AI Messages
export const fetchAIMessages = async (): Promise<AIMessage[]> => {
  await delay(300);
  return mockAIMessages.map((m) => ({ ...m }));
};

export const sendAIMessage = async (content: string): Promise<AIMessage> => {
  await delay(1200);
  const response: AIMessage = {
    id: `ai${Date.now()}`,
    role: 'assistant',
    content: `I understand: "${content}". I've processed your request and updated your records accordingly. Is there anything else you'd like me to help you with?`,
    timestamp: new Date().toISOString(),
  };
  mockAIMessages.push(response);
  return response;
};

// Notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  await delay(300);
  return mockNotifications.map((n) => ({ ...n }));
};

export const markNotificationRead = async (id: string) => {
  await delay(200);
  const idx = mockNotifications.findIndex((n) => n.id === id);
  if (idx >= 0) {
    mockNotifications[idx] = { ...mockNotifications[idx], read: true };
  }
};

export const markAllNotificationsRead = async () => {
  await delay(200);
  mockNotifications.forEach((n, i) => {
    mockNotifications[i] = { ...n, read: true };
  });
};

// Monobank
export const fetchMonobankStatus = async (): Promise<MonobankConnection> => {
  await delay(500);
  return { ...mockMonobankConnection };
};

export const connectMonobank = async (token: string) => {
  void token;
  await delay(1500);
  return { connected: true, accountName: 'Monobank White', importedTransactions: 0 };
};

export const syncMonobank = async () => {
  await delay(2000);
  return { imported: 12 };
};

export const disconnectMonobank = async () => {
  await delay(500);
  return { connected: false };
};

// Dashboard data
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fetchCashFlow = async (): Promise<CashFlowData[]> => {
  await delay(400);
  const currentMonth = new Date().getMonth();
  return mockCashFlowData.filter((d) => monthNames.indexOf(d.month) <= currentMonth).map((d) => ({ ...d }));
};

export const fetchTransactionOverview = async (): Promise<TransactionOverviewData[]> => {
  await delay(400);
  const today = new Date().getDate();
  return mockTransactionOverviewData.filter((d) => parseInt(d.date.split('-')[2]) <= today).map((d) => ({ ...d }));
};

// Analytics
export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  await delay(600);
  return {
    monthlyIncome: [...mockAnalyticsData.monthlyIncome],
    monthlyExpense: [...mockAnalyticsData.monthlyExpense],
    monthlySavings: [...mockAnalyticsData.monthlySavings],
    categoryBreakdown: mockAnalyticsData.categoryBreakdown.map((c) => ({ ...c })),
    dailySpending: mockAnalyticsData.dailySpending.map((d) => ({ ...d })),
    topMerchants: mockAnalyticsData.topMerchants.map((m) => ({ ...m })),
  };
};

// History
export const fetchHistory = async (): Promise<HistoryEvent[]> => {
  await delay(400);
  return mockHistoryEvents.map((h) => ({ ...h }));
};

// Capital
export const fetchCapital = async (): Promise<CapitalData> => {
  await delay(500);
  return {
    totalAssets: 116700,
    totalLiabilities: 15000,
    changePercent: 12.4,
    history: [
      { month: 'Jan', value: 85200 },
      { month: 'Feb', value: 89100 },
      { month: 'Mar', value: 94500 },
      { month: 'Apr', value: 97800 },
      { month: 'May', value: 101700 },
      { month: 'Jun', value: 116700 },
    ],
  };
};
