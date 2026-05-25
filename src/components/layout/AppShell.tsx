import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAppStore } from '@/store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] transition-colors duration-300 flex">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--sk-card)',
            color: 'var(--sk-text)',
            border: '1px solid var(--sk-border)',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 500,
          },
        }}
      />
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[220px]">
        <TopBar />
        <main className="flex-1 pt-14 sm:pt-16 pb-6 sm:pb-8 px-3 sm:px-5 lg:px-8 max-w-[1440px] w-full mx-auto">
          <div key={location.pathname} className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
