export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'card' | 'savings' | 'investment';
  balance: number;
  currency: string;
  number?: string;
  cardNumber?: string;
  expiryDate?: string;
  bankName?: string;
  isConnected: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryId: string;
  merchant: string;
  description?: string;
  date: string;
  source: 'manual' | 'monobank' | 'ai';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'system' | 'custom';
  monthlyBudget?: number;
  monthlySpent: number;
  mccCodes?: string[];
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly';
  month: number;
  year: number;
  alertThreshold: number;
}

export interface Debt {
  id: string;
  userId: string;
  personName: string;
  amount: number;
  currency: string;
  direction: 'owed_to_me' | 'i_owe';
  dueDate?: string;
  status: 'pending' | 'overdue' | 'paid';
  notes?: string;
  createdAt: string;
  settledAt?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  parsedTransaction?: ParsedTransaction;
  parsedDebt?: ParsedDebt;
  parsedBudget?: ParsedBudget;
}

export interface ParsedTransaction {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  merchant: string;
  date: string;
  confidence: number;
}

export interface ParsedDebt {
  personName: string;
  amount: number;
  direction: 'owed_to_me' | 'i_owe';
  confidence: number;
}

export interface ParsedBudget {
  category: string;
  amount: number;
  period: 'monthly' | 'weekly';
  confidence: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'budget' | 'debt' | 'ai' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  monthlyIncome: number[];
  monthlyExpense: number[];
  monthlySavings: number[];
  categoryBreakdown: { name: string; amount: number; color: string }[];
  dailySpending: { date: string; amount: number }[];
  topMerchants: { name: string; amount: number; count: number }[];
}

export interface MonobankConnection {
  connected: boolean;
  token?: string;
  lastSync?: string;
  webhookEnabled: boolean;
  importedTransactions: number;
  accountName?: string;
}

export interface CashFlowData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

export interface CapitalData {
  totalAssets: number;
  totalLiabilities: number;
  changePercent: number;
  history: { month: string; value: number }[];
}

export interface TransactionOverviewData {
  date: string;
  current: number;
  previous: number;
}

export interface HistoryEvent {
  id: string;
  type: 'monobank_sync' | 'ai_transaction' | 'category_edit' | 'budget_exceeded' | 'debt_paid' | 'setting_change';
  title: string;
  description: string;
  timestamp: string;
}
