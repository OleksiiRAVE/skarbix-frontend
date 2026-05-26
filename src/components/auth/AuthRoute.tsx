import { Navigate, useLocation } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-[#8B5CF6]" />
    </div>
  );
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingScreen />;

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function RedirectAuthed({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
