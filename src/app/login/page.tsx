'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/auth/LoginButton';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      console.warn('✅ 로그인 성공, 홈으로 이동');
      router.replace('/'); // ✅ replace 사용 (뒤로가기 방지)
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        🔄 로그인 상태 확인 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>

      {/* ✅ OAuth 로그인 버튼 */}
      <LoginButton provider="google" />
      <LoginButton provider="github" />
      <LoginButton provider="kakao" />
    </div>
  );
}
