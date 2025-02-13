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
      className="w-full px-6 py-3 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
      style={{ backgroundColor: provider === "google" ? "#EA4335" : "#4A90E2" }}
    >
      {provider === "google" ? "Google 로그인" : "로그인"}
      </button>
  );
}
