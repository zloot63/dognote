"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/auth/LoginButton";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>
      <LoginButton provider="google" />
      <LoginButton provider="naver" />
      <LoginButton provider="kakao" />
      <LoginButton provider="apple" />
    </div>
  );
}
