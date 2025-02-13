"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import LoginButton from "@/components/auth/LoginButton";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); // ✅ 로그인 상태면 메인으로 이동
      }
    });
    return unsubscribe;
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>

      {/* ✅ 구글 로그인 */}
      <LoginButton provider="google" />
    </div>
  );
}
