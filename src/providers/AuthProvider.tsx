'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { AuthService } from '@/lib/supabase/auth';
import { ensureUserProfile } from '@/lib/supabase/ensureUserProfile';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github' | 'kakao') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const session = await AuthService.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        setError(error as AuthError);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Ensure user profile exists when user signs in or signs up
      if (event === 'SIGNED_IN' && session?.user) {
        await ensureUserProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const { session } = await AuthService.signUp(email, password);
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { session } = await AuthService.signIn(email, password);
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'kakao') => {
    setError(null);
    try {
      await AuthService.signInWithOAuth(provider);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await AuthService.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await AuthService.resetPassword(email);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    setError(null);
    try {
      await AuthService.updatePassword(newPassword);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
