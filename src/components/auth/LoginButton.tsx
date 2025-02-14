"use client";

import { signInWithGoogle } from "@/lib/auth";
import { FirebaseError } from "firebase/app"; // ✅ FirebaseError 타입 가져오기

export default function LoginButton({ provider }: { provider: string }) {
  const handleLogin = async () => {
    try {
      if (provider === "google") {
        await signInWithGoogle();
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/user-cancelled") {
          alert("⚠️ 로그인 과정이 취소되었습니다. 다시 시도해주세요.");
        } else {
          console.error("🚨 로그인 실패:", error);
          alert("❌ 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        console.error("🚨 알 수 없는 오류:", error);
        alert("❌ 예기치 않은 오류가 발생했습니다.");
      }
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
