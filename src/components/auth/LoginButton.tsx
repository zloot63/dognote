"use client";

import { signIn } from "next-auth/react";

interface LoginButtonProps {
  provider: "google" | "naver" | "kakao" | "apple";
}

export default function LoginButton({ provider }: LoginButtonProps) {
  const providerNames: Record<string, string> = {
    google: "Google",
    naver: "Naver",
    kakao: "Kakao",
    apple: "Apple",
  };

  const providerColors: Record<string, { background: string; color: string }> = {
    google: { background: "#EA4335", color: "#FFFFFF" },
    naver: { background: "#03C75A", color: "#FFFFFF" },
    kakao: { background: "#FEE500", color: "#3C1E1E" },
    apple: { background: "#000000", color: "#FFFFFF" },
  };

  const handleLogin = async () => {
    try {
      await signIn(provider);
    } catch (error) {
      console.error(`🚨 ${providerNames[provider]} 로그인 실패:`, error);
      alert(`❌ ${providerNames[provider]} 로그인 중 오류가 발생했습니다. 다시 시도해주세요.`);
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
