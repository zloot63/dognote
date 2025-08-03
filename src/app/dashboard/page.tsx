"use client";

import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl font-bold text-indigo-600">🐾 DogNote</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.image && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.image}
                      alt={user.name}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  환영합니다, {user?.name}님! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  DogNote 대시보드에 성공적으로 로그인하셨습니다.
                </p>
                
                {/* 사용자 정보 카드 */}
                <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">계정 정보</h2>
                  <div className="space-y-3 text-left">
                    <div>
                      <span className="text-sm font-medium text-gray-500">이메일:</span>
                      <p className="text-sm text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">로그인 방식:</span>
                      <p className="text-sm text-gray-900 capitalize">{user?.provider}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">사용자 ID:</span>
                      <p className="text-sm text-gray-900 font-mono">{user?.id}</p>
                    </div>
                  </div>
                </div>

                {/* 다음 단계 안내 */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    다음 개발 단계
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 반려견 프로필 등록 기능</li>
                    <li>• GPS 산책 추적 시스템</li>
                    <li>• 건강 기록 관리</li>
                    <li>• 포인트 시스템</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
