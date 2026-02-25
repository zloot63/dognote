'use client';

import { useAuth as useSupabaseAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  provider?: string;
}

export function useAuth() {
  const auth = useSupabaseAuth();
  const router = useRouter();

  const user: AuthUser | null = auth.user
    ? {
        id: auth.user.id,
        email: auth.user.email || '',
        name:
          auth.user.user_metadata?.display_name ||
          auth.user.email?.split('@')[0],
        image:
          auth.user.user_metadata?.photo_url ||
          auth.user.user_metadata?.avatar_url,
        provider: auth.user.identities?.[0]?.provider || 'email',
      }
    : null;

  const logout = useCallback(async () => {
    try {
      await auth.signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }, [auth, router]);

  const requireAuth = useCallback(() => {
    if (!auth.loading && !auth.user) {
      router.push('/auth/signin');
      return false;
    }
    return true;
  }, [auth.loading, auth.user, router]);

  return {
    user,
    loading: auth.loading,
    isAuthenticated: !!auth.user,
    logout,
    requireAuth,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signInWithGoogle: () => auth.signInWithOAuth('google'),
    signInWithGitHub: () => auth.signInWithOAuth('github'),
    signInWithKakao: () => auth.signInWithOAuth('kakao'),
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
  };
}

// 서버 사이드에서 사용할 인증 함수
export async function getServerSession() {
  // 서버 컴포넌트에서 사용할 세션 가져오기 로직
  // 이 부분은 나중에 서버 사이드 세션 처리 시 구현
  return null;
}
