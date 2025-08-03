"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이미 로그인된 사용자는 대시보드로 리다이렉트
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });
      
      if (result?.error) {
        console.error("로그인 오류:", result.error);
        // TODO: 토스트 알림 추가
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* 로고 영역 */}
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl">🐾</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            DogNote에 오신 것을 환영합니다
          </h2>
          <p className="text-gray-600">
            반려견의 산책과 건강을 기록하고 관리하세요
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            ) : (
              <>
                <FcGoogle className="h-5 w-5 mr-3" />
                Google로 계속하기
              </>
            )}
          </button>

          {/* Apple 로그인 버튼 (Phase 2에서 구현 예정) */}
          <button
            disabled
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple로 계속하기 (준비 중)
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          로그인하면{" "}
          <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
            이용약관
          </a>
          {" "}및{" "}
          <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}
