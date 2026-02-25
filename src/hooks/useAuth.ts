'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Provider } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image: string;
  provider: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              '',
            image:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              '',
            provider: session.user.app_metadata?.provider || 'email',
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            '',
          image:
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture ||
            '',
          provider: session.user.app_metadata?.provider || 'email',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithOAuth = useCallback(
    async (provider: Provider) => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      } catch (error) {
        console.error('OAuth 로그인 중 오류 발생:', error);
        throw error;
      }
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/signin');
      router.refresh();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }, [router, supabase]);

  const requireAuth = useCallback(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
      return false;
    }
    return true;
  }, [isLoading, user, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithOAuth,
    logout,
    requireAuth,
  };
}
