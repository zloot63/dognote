"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // ✅ getAuth() 대신 auth 가져오기

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>
      {/* 로그인 버튼 */}
      <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Google 로그인
      </button>
    </div>
  );
}
