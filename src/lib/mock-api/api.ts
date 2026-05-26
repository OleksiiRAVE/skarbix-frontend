import {
  mockUser,
  mockAIMessages, mockNotifications,
  mockMonobankConnection, mockCashFlowData, mockTransactionOverviewData,
  mockAnalyticsData, mockHistoryEvents,
} from './data';
import { supabase } from '@/lib/supabase/client';
import type {
  Account, Transaction, Category, Budget, Debt, AIMessage,
  Notification, MonobankConnection, CashFlowData,
  TransactionOverviewData, AnalyticsData, HistoryEvent,
  CapitalData,
} from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

const toAccount = (row: {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number | string;
  currency: string;
  color?: string | null;
  icon?: string | null;
}): Account => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  type: ['cash', 'bank', 'card', 'checking', 'savings', 'investment', 'other'].includes(row.type)
    ? row.type as Account['type']
    : 'other',
  balance: Number(row.balance),
  currency: row.currency,
  color: row.color || undefined,
  icon: row.icon || undefined,
  isConnected: false,
});

const toCategory = (row: {
  id: string;
  name: string;
  type?: string | null;
  color: string | null;
  icon: string | null;
  is_system: boolean;
}): Category => ({
  id: row.id,
  name: row.name,
  icon: row.icon || 'Tag',
  color: row.color || '#8B5CF6',
  type: row.is_system ? 'system' : 'custom',
  kind: row.type === 'income' ? 'income' : 'expense',
  monthlySpent: 0,
});

const toTransaction = (row: {
  id: string;
  user_id: string;
  account_id: string | null;
  category_id: string | null;
  type: string;
  amount: number | string;
  currency: string;
  merchant: string | null;
  notes: string | null;
  occurred_at: string;
  source: string;
  categories?: { name: string | null } | { name: string | null }[] | null;
}): Transaction => ({
  id: row.id,
  userId: row.user_id,
  accountId: row.account_id || undefined,
  amount: Number(row.amount),
  type: row.type === 'income' ? 'income' : 'expense',
  category: (Array.isArray(row.categories) ? row.categories[0]?.name : row.categories?.name) || 'Uncategorized',
  categoryId: row.category_id || 'uncategorized',
  merchant: row.merchant || 'Manual transaction',
  description: row.notes || undefined,
  date: row.occurred_at,
  source: row.source === 'monobank' || row.source === 'ai' ? row.source : 'manual',
  notes: row.notes || undefined,
  createdAt: row.occurred_at,
  updatedAt: row.occurred_at,
});

const toBudget = (row: {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  amount: number | string;
  period: 'weekly' | 'monthly' | 'yearly';
  starts_on: string;
  categories?: { name: string | null; color: string | null } | { name: string | null; color: string | null }[] | null;
}): Budget => ({
  id: row.id,
  userId: row.user_id,
  categoryId: row.category_id || 'uncategorized',
  categoryName: (Array.isArray(row.categories) ? row.categories[0]?.name : row.categories?.name) || row.name,
  categoryColor: (Array.isArray(row.categories) ? row.categories[0]?.color : row.categories?.color) || '#8B5CF6',
  amount: Number(row.amount),
  spent: 0,
  period: row.period === 'weekly' ? 'weekly' : 'monthly',
  month: new Date(row.starts_on).getMonth() + 1,
  year: new Date(row.starts_on).getFullYear(),
  alertThreshold: 80,
});

const toDebt = (row: {
  id: string;
  user_id: string;
  person_name: string;
  direction: 'owed_to_me' | 'i_owe';
  amount: number | string;
  currency: string;
  status: 'pending' | 'overdue' | 'paid';
  due_date: string | null;
  notes: string | null;
  created_at: string;
}): Debt => ({
  id: row.id,
  userId: row.user_id,
  personName: row.person_name,
  direction: row.direction,
  amount: Number(row.amount),
  currency: row.currency,
  status: row.status,
  dueDate: row.due_date || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at,
});

// User
export const fetchUser = async () => {
  await delay(400);
  return { ...mockUser };
};

// Accounts
export const fetchAccounts = async () => {
  const userId = await getUserId();
  if (!userId) return [];

  let response: {
    data: {
      id: string;
      user_id: string;
      name: string;
      type: string;
      balance: number | string;
      currency: string;
      color?: string | null;
      icon?: string | null;
    }[] | null;
    error: { message: string } | null;
  } = await supabase
    .from('accounts')
    .select('id,user_id,name,type,balance,currency,color,icon')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: true });

  if (response.error && (response.error.message.includes('color') || response.error.message.includes('icon'))) {
    response = await supabase
      .from('accounts')
      .select('id,user_id,name,type,balance,currency')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: true });
  }

  if (response.error) throw response.error;
  return (response.data ?? []).map(toAccount);
};

export const createAccount = async (data: {
  name: string;
  type: Account['type'];
  balance: number;
  currency?: string;
  color?: string;
  icon?: string;
}) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const payload = {
    user_id: userId,
    name: data.name,
    type: data.type,
    balance: data.balance,
    currency: data.currency || 'UAH',
    color: data.color,
    icon: data.icon,
  };

  const select = 'id,user_id,name,type,balance,currency,color,icon';
  let response = await supabase.from('accounts').insert(payload).select(select).single();

  if (response.error && (response.error.message.includes('color') || response.error.message.includes('icon'))) {
    const { color, icon, ...legacyPayload } = payload;
    void color;
    void icon;
    response = await supabase
      .from('accounts')
      .insert(legacyPayload)
      .select('id,user_id,name,type,balance,currency')
      .single();
  }

  if (response.error) throw response.error;
  return toAccount(response.data);
};

export const updateAccount = async (id: string, data: {
  name?: string;
  type?: Account['type'];
  balance?: number;
  color?: string;
  icon?: string;
}) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.type !== undefined) payload.type = data.type;
  if (data.balance !== undefined) payload.balance = data.balance;
  if (data.color !== undefined) payload.color = data.color;
  if (data.icon !== undefined) payload.icon = data.icon;

  const response = await supabase
    .from('accounts')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select('id,user_id,name,type,balance,currency,color,icon')
    .single();

  if (response.error) throw response.error;
  return toAccount(response.data);
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
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const userId = await getUserId();
  if (!userId) return { transactions: [], total: 0 };

  let query = supabase
    .from('transactions')
    .select('id,user_id,account_id,category_id,type,amount,currency,merchant,notes,occurred_at,source,categories(name)', { count: 'exact' })
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false })
    .range(from, to);

  if (filters?.search) {
    query = query.or(`merchant.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
  }
  if (filters?.category) {
    query = query.eq('category_id', filters.category);
  }
  if (filters?.source) {
    query = query.eq('source', filters.source);
  }
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return { transactions: data.map(toTransaction), total: count ?? 0 };
};

export const createTransaction = async (data: Partial<Transaction>) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const { data: inserted, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      account_id: data.accountId,
      category_id: data.categoryId === 'uncategorized' ? null : data.categoryId,
      type: data.type || 'expense',
      amount: data.amount || 0,
      merchant: data.merchant || 'Manual transaction',
      notes: data.notes || data.description || null,
      occurred_at: data.date || new Date().toISOString(),
      source: data.source || 'manual',
    })
    .select('id,user_id,account_id,category_id,type,amount,currency,merchant,notes,occurred_at,source,categories(name)')
    .single();

  if (error) throw error;
  return toTransaction(inserted);
};

export const updateTransaction = async (id: string, data: Partial<Transaction>) => {
  const { data: updated, error } = await supabase
    .from('transactions')
    .update({
      type: data.type,
      amount: data.amount,
      merchant: data.merchant,
      notes: data.notes || data.description,
      occurred_at: data.date,
    })
    .eq('id', id)
    .select('id,user_id,account_id,category_id,type,amount,currency,merchant,notes,occurred_at,source,categories(name)')
    .single();

  if (error) throw error;
  return toTransaction(updated);
};

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('id,name,type,color,icon,is_system')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toCategory);
};

export const createCategory = async (data: Partial<Category>) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const { data: inserted, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name: data.name || 'New Category',
      type: data.kind || 'expense',
      color: data.color || '#8B5CF6',
      icon: data.icon || 'lucide:tag',
      is_system: false,
    })
    .select('id,name,type,color,icon,is_system')
    .single();

  if (error) throw error;
  return toCategory(inserted);
};

// Budgets
export const fetchBudgets = async (): Promise<Budget[]> => {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('budgets')
    .select('id,user_id,category_id,name,amount,period,starts_on,categories(name,color)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toBudget);
};

export const createBudget = async (data: Partial<Budget>) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const { data: inserted, error } = await supabase
    .from('budgets')
    .insert({
      user_id: userId,
      category_id: data.categoryId,
      name: data.categoryName || 'Budget',
      amount: data.amount || 0,
      period: data.period || 'monthly',
      starts_on: new Date().toISOString().slice(0, 10),
    })
    .select('id,user_id,category_id,name,amount,period,starts_on,categories(name,color)')
    .single();

  if (error) throw error;
  return toBudget(inserted);
};

// Debts
export const fetchDebts = async (): Promise<Debt[]> => {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('debts')
    .select('id,user_id,person_name,direction,amount,currency,status,due_date,notes,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toDebt);
};

export const createDebt = async (data: Partial<Debt>) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const { data: inserted, error } = await supabase
    .from('debts')
    .insert({
      user_id: userId,
      person_name: data.personName || 'Unknown',
      direction: data.direction || 'owed_to_me',
      amount: data.amount || 0,
      currency: data.currency || 'UAH',
      due_date: data.dueDate || null,
      notes: data.notes || null,
    })
    .select('id,user_id,person_name,direction,amount,currency,status,due_date,notes,created_at')
    .single();

  if (error) throw error;
  return toDebt(inserted);
};

export const markDebtPaid = async (id: string) => {
  const { data, error } = await supabase
    .from('debts')
    .update({ status: 'paid' })
    .eq('id', id)
    .select('id,user_id,person_name,direction,amount,currency,status,due_date,notes,created_at')
    .single();

  if (error) throw error;
  return toDebt(data);
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
  const { total } = await fetchTransactions({ limit: 1 });
  if (total === 0) return [];

  const currentMonth = new Date().getMonth();
  return mockCashFlowData.filter((d) => monthNames.indexOf(d.month) <= currentMonth).map((d) => ({ ...d }));
};

export const fetchTransactionOverview = async (): Promise<TransactionOverviewData[]> => {
  const { total } = await fetchTransactions({ limit: 1 });
  if (total === 0) return [];

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
