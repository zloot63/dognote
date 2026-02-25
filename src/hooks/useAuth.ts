'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image: string;
  provider: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        image: session.user.image || '',
        provider: session.user.provider || '',
      }
    : null;

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const logout = useCallback(async () => {
    try {
      await signOut({
        callbackUrl: '/auth/signin',
        redirect: true,
      });
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }, []);

  const requireAuth = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
      return false;
    }
    return true;
  }, [isLoading, isAuthenticated, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    requireAuth,
  };
}
