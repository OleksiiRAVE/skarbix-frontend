import { create } from 'zustand';
import type { User, Transaction, Category, Budget, Debt, AIMessage, Notification } from '@/types';

interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'uk' | 'en';
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  user: User | null;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  debts: Debt[];
  aiMessages: AIMessage[];
  notifications: Notification[];
  isLoading: boolean;

  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'uk' | 'en') => void;
  openModal: (modal: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setUser: (user: User | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setCategories: (categories: Category[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setDebts: (debts: Debt[]) => void;
  setAIMessages: (messages: AIMessage[]) => void;
  addAIMessage: (message: AIMessage) => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  language: 'uk',
  activeModal: null,
  modalData: null,
  user: null,
  transactions: [],
  categories: [],
  budgets: [],
  debts: [],
  aiMessages: [],
  notifications: [],
  isLoading: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  setLanguage: (lang) => set({ language: lang }),
  openModal: (modal, data) => set({ activeModal: modal, modalData: data || null }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  setUser: (user) => set({ user }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  setCategories: (categories) => set({ categories }),
  setBudgets: (budgets) => set({ budgets }),
  setDebts: (debts) => set({ debts }),
  setAIMessages: (messages) => set({ aiMessages: messages }),
  addAIMessage: (message) =>
    set((state) => ({ aiMessages: [...state.aiMessages, message] })),
  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
