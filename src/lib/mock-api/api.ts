import {
  mockUser,
  mockAIMessages,
} from './data';
import { supabase } from '@/lib/supabase/client';
import type {
  Account, Transaction, Category, CategoryTemplate, Subscription, Budget, Debt, AIMessage,
  Notification, MonobankConnection, CashFlowData,
  TransactionOverviewData, AnalyticsData, HistoryEvent,
  CapitalData,
} from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'https://api.skarbix.xyz';

const backendRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not signed in');
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init?.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new Error(errorBody?.error?.message || 'Request failed');
  }

  return response.json() as Promise<T>;
};

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
  is_protected?: boolean | null;
  template_key?: string | null;
}): Category => ({
  id: row.id,
  name: row.name,
  icon: row.icon || 'lucide:tag',
  color: row.color || '#8B5CF6',
  type: row.is_system ? 'system' : 'custom',
  kind: row.type === 'income' ? 'income' : 'expense',
  isProtected: row.is_protected || false,
  templateKey: row.template_key || undefined,
  monthlySpent: 0,
});

const toCategoryTemplate = (row: {
  key: string;
  name: string;
  type: string;
  color: string;
  icon: string;
}): CategoryTemplate => ({
  key: row.key,
  name: row.name,
  kind: row.type === 'income' ? 'income' : 'expense',
  color: row.color,
  icon: row.icon,
});

const toSubscription = (row: {
  id: string;
  user_id: string;
  category_id: string | null;
  account_id: string | null;
  name: string;
  amount: number | string;
  currency: string;
  period: string;
  next_payment_on: string;
  color: string | null;
  icon: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}): Subscription => ({
  id: row.id,
  userId: row.user_id,
  categoryId: row.category_id || undefined,
  accountId: row.account_id || undefined,
  name: row.name,
  amount: Number(row.amount),
  currency: row.currency,
  period: row.period === 'weekly' || row.period === 'yearly' ? row.period : 'monthly',
  nextPaymentOn: row.next_payment_on,
  color: row.color || undefined,
  icon: row.icon || undefined,
  notes: row.notes || undefined,
  isActive: row.is_active,
  createdAt: row.created_at,
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
    .select('id,name,type,color,icon,is_system,is_protected,template_key')
    .eq('user_id', userId)
    .order('is_protected', { ascending: false })
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
    .select('id,name,type,color,icon,is_system,is_protected,template_key')
    .single();

  if (error) throw error;
  return toCategory(inserted);
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.kind !== undefined) payload.type = data.kind;
  if (data.color !== undefined) payload.color = data.color;
  if (data.icon !== undefined) payload.icon = data.icon;

  const { data: updated, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .eq('is_protected', false)
    .select('id,name,type,color,icon,is_system,is_protected,template_key')
    .single();

  if (error) throw error;
  return toCategory(updated);
};

export const deleteCategory = async (id: string) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .eq('is_protected', false);

  if (error) throw error;
  return true;
};

export const fetchCategoryTemplates = async (): Promise<CategoryTemplate[]> => {
  const { data, error } = await supabase
    .from('category_templates')
    .select('key,name,type,color,icon')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data.map(toCategoryTemplate);
};

// Subscriptions
export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('subscriptions')
    .select('id,user_id,category_id,account_id,name,amount,currency,period,next_payment_on,color,icon,notes,is_active,created_at')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('next_payment_on', { ascending: true });

  if (error) throw error;
  return data.map(toSubscription);
};

export const createSubscription = async (data: Partial<Subscription>) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const { data: inserted, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      category_id: data.categoryId || null,
      account_id: data.accountId || null,
      name: data.name || 'Subscription',
      amount: data.amount || 0,
      currency: data.currency || 'UAH',
      period: data.period || 'monthly',
      next_payment_on: data.nextPaymentOn || new Date().toISOString().slice(0, 10),
      color: data.color || '#8B5CF6',
      icon: data.icon || 'lucide:repeat',
      notes: data.notes || null,
    })
    .select('id,user_id,category_id,account_id,name,amount,currency,period,next_payment_on,color,icon,notes,is_active,created_at')
    .single();

  if (error) throw error;
  return toSubscription(inserted);
};

export const updateSubscription = async (id: string, data: Partial<Subscription>) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const payload: Record<string, unknown> = {};
  if (data.categoryId !== undefined) payload.category_id = data.categoryId || null;
  if (data.accountId !== undefined) payload.account_id = data.accountId || null;
  if (data.name !== undefined) payload.name = data.name;
  if (data.amount !== undefined) payload.amount = data.amount;
  if (data.currency !== undefined) payload.currency = data.currency;
  if (data.period !== undefined) payload.period = data.period;
  if (data.nextPaymentOn !== undefined) payload.next_payment_on = data.nextPaymentOn;
  if (data.color !== undefined) payload.color = data.color;
  if (data.icon !== undefined) payload.icon = data.icon;
  if (data.notes !== undefined) payload.notes = data.notes || null;
  if (data.isActive !== undefined) payload.is_active = data.isActive;

  const { data: updated, error } = await supabase
    .from('subscriptions')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select('id,user_id,category_id,account_id,name,amount,currency,period,next_payment_on,color,icon,notes,is_active,created_at')
    .single();

  if (error) throw error;
  return toSubscription(updated);
};

export const deleteSubscription = async (id: string) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const { error } = await supabase
    .from('subscriptions')
    .update({ is_active: false })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
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
  const budgets = data.map(toBudget);
  const { transactions } = await fetchTransactions({ limit: 500 });
  return budgets.map((budget) => {
    const start = new Date(budget.year, budget.month - 1, 1);
    const end = budget.period === 'weekly'
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
      : new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const spent = transactions
      .filter((transaction) => (
        transaction.type === 'expense'
        && transaction.categoryId === budget.categoryId
        && new Date(transaction.date) >= start
        && new Date(transaction.date) < end
      ))
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return { ...budget, spent };
  });
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

export const sendAIMessage = async (
  content: string,
  history: Pick<AIMessage, 'role' | 'content'>[] = [],
  locale: 'uk' | 'en' = 'uk',
): Promise<AIMessage> => backendRequest<AIMessage>('/v1/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: content,
    history: history.slice(-12),
    locale,
  }),
});

// Notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  const userId = await getUserId();
  if (!userId) return [];
  const readIds = new Set<string>(JSON.parse(localStorage.getItem(`skarbix-notifications-read:${userId}`) || '[]'));
  const [transactionResult, budgets, debts, monobank] = await Promise.all([
    fetchTransactions({ limit: 20 }),
    fetchBudgets(),
    fetchDebts(),
    fetchMonobankStatus().catch(() => null),
  ]);

  const transactionNotifications: Notification[] = transactionResult.transactions
    .filter((transaction) => transaction.source === 'monobank')
    .slice(0, 5)
    .map((transaction) => ({
      id: `transaction:${transaction.id}`,
      userId,
      title: transaction.type === 'income' ? 'New income' : 'New transaction',
      message: `${transaction.merchant}: ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} UAH`,
      type: 'transaction',
      read: readIds.has(`transaction:${transaction.id}`),
      createdAt: transaction.createdAt,
    }));

  const budgetNotifications: Notification[] = budgets
    .filter((budget) => budget.amount > 0 && budget.spent / budget.amount >= budget.alertThreshold / 100)
    .map((budget) => ({
      id: `budget:${budget.id}:${budget.month}:${budget.year}`,
      userId,
      title: budget.spent > budget.amount ? 'Budget exceeded' : 'Budget warning',
      message: `${budget.categoryName}: ${Math.round((budget.spent / budget.amount) * 100)}% used`,
      type: 'budget',
      read: readIds.has(`budget:${budget.id}:${budget.month}:${budget.year}`),
      createdAt: new Date().toISOString(),
    }));

  const now = Date.now();
  const debtNotifications: Notification[] = debts
    .filter((debt) => debt.status !== 'paid' && debt.dueDate && new Date(debt.dueDate).getTime() <= now + 7 * 86400000)
    .map((debt) => ({
      id: `debt:${debt.id}`,
      userId,
      title: debt.direction === 'owed_to_me' ? 'Debt due soon' : 'Payment due soon',
      message: `${debt.personName}: ${debt.amount.toFixed(2)} ${debt.currency}`,
      type: 'debt',
      read: readIds.has(`debt:${debt.id}`),
      createdAt: debt.dueDate || debt.createdAt,
    }));

  const systemNotifications: Notification[] = monobank?.lastSync ? [{
    id: `monobank:${monobank.lastSync}`,
    userId,
    title: 'Monobank synchronized',
    message: `${monobank.importedTransactions} transactions imported`,
    type: 'system',
    read: readIds.has(`monobank:${monobank.lastSync}`),
    createdAt: monobank.lastSync,
  }] : [];

  return [...budgetNotifications, ...debtNotifications, ...transactionNotifications, ...systemNotifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);
};

export const markNotificationRead = async (id: string) => {
  const userId = await getUserId();
  if (!userId) return;
  const key = `skarbix-notifications-read:${userId}`;
  const ids = new Set<string>(JSON.parse(localStorage.getItem(key) || '[]'));
  ids.add(id);
  localStorage.setItem(key, JSON.stringify([...ids]));
};

export const markAllNotificationsRead = async () => {
  const userId = await getUserId();
  if (!userId) return;
  const notifications = await fetchNotifications();
  localStorage.setItem(`skarbix-notifications-read:${userId}`, JSON.stringify(notifications.map((item) => item.id)));
};

// Monobank
export const fetchMonobankStatus = async (): Promise<MonobankConnection> => {
  return backendRequest<MonobankConnection>('/v1/monobank/status');
};

export const authorizeMonobank = async () => {
  return backendRequest<MonobankConnection>('/v1/monobank/provider/authorize', {
    method: 'POST',
  });
};

export const confirmMonobankAuthorization = async () => {
  return backendRequest<MonobankConnection & {
    imported?: number;
    accountsImported?: number;
    syncLimited?: boolean;
  }>('/v1/monobank/provider/confirm', {
    method: 'POST',
  });
};

export const connectMonobank = async (token: string) => {
  return backendRequest<MonobankConnection & { accountsImported: number }>('/v1/monobank/connect', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

export const syncMonobank = async () => {
  return backendRequest<{ imported: number; importedTransactions: number; accountsImported: number }>('/v1/monobank/sync', {
    method: 'POST',
  });
};

export const disconnectMonobank = async () => {
  return backendRequest<MonobankConnection>('/v1/monobank/disconnect', {
    method: 'DELETE',
  });
};

// Dashboard data
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fetchCashFlow = async (): Promise<CashFlowData[]> => {
  const { transactions, total } = await fetchTransactions({ limit: 500 });
  if (total === 0) return [];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return monthNames.slice(0, currentMonth + 1).map((month, monthIndex) => {
    const monthTransactions = transactions.filter((tx) => {
      const date = new Date(tx.date);
      return date.getFullYear() === currentYear && date.getMonth() === monthIndex;
    });
    const income = monthTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = monthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      month,
      income,
      expense,
      savings: income - expense,
    };
  }).filter((item) => item.income > 0 || item.expense > 0 || item.savings !== 0);
};

export const fetchTransactionOverview = async (): Promise<TransactionOverviewData[]> => {
  const { transactions, total } = await fetchTransactions({ limit: 500 });
  if (total === 0) return [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const daysInMonth = now.getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const current = transactions
      .filter((tx) => {
        const date = new Date(tx.date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth && date.getDate() === day;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
    const previous = transactions
      .filter((tx) => {
        const date = new Date(tx.date);
        return date.getFullYear() === previousMonthDate.getFullYear()
          && date.getMonth() === previousMonthDate.getMonth()
          && date.getDate() === day;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      date: new Date(currentYear, currentMonth, day).toISOString().slice(0, 10),
      current,
      previous,
    };
  }).filter((item) => item.current > 0 || item.previous > 0);
};

// Analytics
export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  const { transactions } = await fetchTransactions({ limit: 500 });
  const now = new Date();
  const monthStarts = Array.from({ length: 6 }, (_, index) => (
    new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
  ));
  const monthLabels = monthStarts.map((date) => date.toLocaleDateString('en-US', { month: 'short' }));
  const monthlyIncome = monthStarts.map((start) => {
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return transactions.filter((tx) => tx.type === 'income' && new Date(tx.date) >= start && new Date(tx.date) < end)
      .reduce((sum, tx) => sum + tx.amount, 0);
  });
  const monthlyExpense = monthStarts.map((start) => {
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return transactions.filter((tx) => tx.type === 'expense' && new Date(tx.date) >= start && new Date(tx.date) < end)
      .reduce((sum, tx) => sum + tx.amount, 0);
  });
  const currentStart = monthStarts[monthStarts.length - 1];
  const currentTransactions = transactions.filter((tx) => new Date(tx.date) >= currentStart);
  const categoryMap = new Map<string, number>();
  const merchantMap = new Map<string, { amount: number; count: number }>();
  const dailyMap = new Map<string, number>();
  currentTransactions.filter((tx) => tx.type === 'expense').forEach((tx) => {
    categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
    const merchant = merchantMap.get(tx.merchant) || { amount: 0, count: 0 };
    merchantMap.set(tx.merchant, { amount: merchant.amount + tx.amount, count: merchant.count + 1 });
    const date = tx.date.slice(0, 10);
    dailyMap.set(date, (dailyMap.get(date) || 0) + tx.amount);
  });
  const palette = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4'];
  const currentIncome = monthlyIncome.at(-1) || 0;
  const currentExpense = monthlyExpense.at(-1) || 0;
  const elapsedDays = Math.max(1, now.getDate());
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return {
    monthLabels,
    monthlyIncome,
    monthlyExpense,
    monthlySavings: monthlyIncome.map((income, index) => income - monthlyExpense[index]),
    categoryBreakdown: [...categoryMap.entries()]
      .map(([name, amount], index) => ({ name, amount, color: palette[index % palette.length] }))
      .sort((a, b) => b.amount - a.amount),
    dailySpending: [...dailyMap.entries()].map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date)),
    topMerchants: [...merchantMap.entries()]
      .map(([name, value]) => ({ name, ...value }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5),
    currentIncome,
    currentExpense,
    previousExpense: monthlyExpense.at(-2) || 0,
    projectedSavings: currentIncome - (currentExpense / elapsedDays) * daysInMonth,
  };
};

// History
export const fetchHistory = async (): Promise<HistoryEvent[]> => {
  const userId = await getUserId();
  if (!userId) return [];
  const [auditResult, transactionResult, debts] = await Promise.all([
    supabase.from('audit_logs').select('id,action,metadata,created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
    fetchTransactions({ limit: 30 }),
    fetchDebts(),
  ]);
  if (auditResult.error) throw auditResult.error;

  const auditEvents: HistoryEvent[] = auditResult.data.map((row) => {
    const metadata = row.metadata as Record<string, unknown> | null;
    if (row.action.startsWith('monobank.')) {
      return {
        id: `audit:${row.id}`,
        type: 'monobank_sync',
        title: 'Monobank activity',
        description: row.action.replaceAll('.', ' '),
        timestamp: row.created_at,
      };
    }
    return {
      id: `audit:${row.id}`,
      type: 'setting_change',
      title: row.action === 'ai.message.sent' ? 'AI assistant used' : 'Account activity',
      description: metadata?.proposed_debt ? 'AI prepared a debt action for confirmation.' : row.action.replaceAll('.', ' '),
      timestamp: row.created_at,
    };
  });
  const transactionEvents: HistoryEvent[] = transactionResult.transactions.slice(0, 20).map((transaction) => ({
    id: `transaction:${transaction.id}`,
    type: transaction.source === 'ai' ? 'ai_transaction' : 'transaction',
    title: transaction.source === 'ai' ? 'AI transaction confirmed' : 'Transaction recorded',
    description: `${transaction.merchant}: ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} UAH`,
    timestamp: transaction.createdAt,
  }));
  const debtEvents: HistoryEvent[] = debts.filter((debt) => debt.status === 'paid').map((debt) => ({
    id: `debt:${debt.id}`,
    type: 'debt_paid',
    title: 'Debt settled',
    description: `${debt.personName}: ${debt.amount.toFixed(2)} ${debt.currency}`,
    timestamp: debt.settledAt || debt.createdAt,
  }));

  return [...auditEvents, ...transactionEvents, ...debtEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 100);
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
