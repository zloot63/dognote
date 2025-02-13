"use client";

import { signInWithGoogle } from "@/lib/auth";

export default function LoginButton({ provider }: { provider: string }) {
  const handleLogin = async () => {
    try {
      if (provider === "google") {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error("🚨 로그인 실패:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full px-4 py-2 text-white rounded-md hover:opacity-80"
      style={{ backgroundColor: provider === "google" ? "#EA4335" : "#4A90E2" }}
    >
      {provider === "google" ? "Google 로그인" : "로그인"}
    </button>
  );
}
