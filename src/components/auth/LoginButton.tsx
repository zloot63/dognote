'use client';

import { useAuth } from '@/hooks/useAuth';

interface LoginButtonProps {
  provider: 'google' | 'github' | 'kakao';
}

export default function LoginButton({ provider }: LoginButtonProps) {
  const { signInWithOAuth } = useAuth();

  const providerNames: Record<string, string> = {
    google: 'Google',
    github: 'GitHub',
    kakao: 'Kakao',
  };

  const providerColors: Record<string, { background: string; color: string }> =
    {
      google: { background: '#EA4335', color: '#FFFFFF' },
      github: { background: '#24292e', color: '#FFFFFF' },
      kakao: { background: '#FEE500', color: '#3C1E1E' },
    };

  const handleLogin = async () => {
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      console.error(`🚨 ${providerNames[provider]} 로그인 실패:`, error);
      alert(
        `❌ ${providerNames[provider]} 로그인 중 오류가 발생했습니다. 다시 시도해주세요.`
      );
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full px-6 py-3 font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
      style={{
        backgroundColor: providerColors[provider].background,
        color: providerColors[provider].color,
      }}
    >
      {providerNames[provider]} 로그인
    </button>
  );
}
