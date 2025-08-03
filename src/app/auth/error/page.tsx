"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "서버 설정에 문제가 있습니다. 관리자에게 문의하세요.";
      case "AccessDenied":
        return "접근이 거부되었습니다. 권한을 확인해주세요.";
      case "Verification":
        return "인증 토큰이 만료되었거나 이미 사용되었습니다.";
      case "Default":
        return "로그인 중 오류가 발생했습니다.";
      default:
        return "알 수 없는 오류가 발생했습니다.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* 오류 아이콘 */}
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            로그인 오류
          </h2>
          <p className="text-gray-600 mb-6">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            다시 로그인하기
          </Link>
          
          <Link
            href="/"
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>

        {error && (
          <div className="text-center text-sm text-gray-500 mt-6">
            오류 코드: {error}
          </div>
        )}
      </div>
    </div>
  );
}
