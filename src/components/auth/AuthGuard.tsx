"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoading, isAuthenticated, requireAuth } = useAuth();

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      fallback || (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">로딩 중...</span>
        </div>
      )
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    requireAuth();
    return null;
  }

  // 인증된 사용자에게만 children 렌더링
  return <>{children}</>;
}
