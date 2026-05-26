import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/store';
import type { User } from '@/types';

interface AuthContextValue {
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: SupabaseUser | null): User | null {
  if (!user?.email) return null;

  const displayName =
    (typeof user.user_metadata.display_name === 'string' && user.user_metadata.display_name) ||
    (typeof user.user_metadata.name === 'string' && user.user_metadata.name) ||
    user.email.split('@')[0];

  return {
    id: user.id,
    name: displayName,
    email: user.email,
    avatar: '',
    currency: 'UAH',
    theme: 'system',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(mapUser(data.session?.user ?? null));
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(mapUser(nextSession?.user ?? null));
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      supabaseUser: session?.user ?? null,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      },
    }),
    [loading, session, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
