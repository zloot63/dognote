"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDogs } from "@/hooks/useDogs";
import { useDogStore } from "@/store/dogStore";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Firebase Auth 연동 상태 확인
  const { isFirebaseAuthenticated, isLoading: authLoading } = useFirebaseAuth();

  // 강아지 데이터 조회
  const { isLoading: dogsLoading, error: dogsError, refetch } = useDogs();
  const { dogs } = useDogStore();

  // Firebase 인증이 완료된 후에만 강아지 데이터 refetch
  useEffect(() => {
    if (isFirebaseAuthenticated && !dogsLoading) {
      refetch();
    }
  }, [isFirebaseAuthenticated, refetch, dogsLoading]);

  // 전체 로딩 상태 (NextAuth + Firebase Auth)
  const isLoading = authLoading || dogsLoading;
  
  // 강아지 데이터 (React Query 데이터 우선, 없으면 스토어 데이터)
  const currentDogs = dogs || [];
  const hasDogs = currentDogs.length > 0;

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">인증 확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // Firebase 인증 실패
  if (!isFirebaseAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-yellow-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-yellow-900 mb-2">인증 연동 중</h3>
            <p className="text-yellow-700 mb-4">
              Firebase 인증을 연동하고 있습니다. 잠시만 기다려주세요.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              새로고침
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            {isLoading ? (
              // 로딩 상태
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">강아지 정보를 불러오는 중...</p>
                </div>
              </div>
            ) : dogsError ? (
              // 에러 상태
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-red-600 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-red-900 mb-2">데이터 로드 오류</h3>
                  <p className="text-red-700 mb-4">
                    {dogsError instanceof Error ? dogsError.message : '강아지 목록을 불러오는데 실패했습니다.'}
                  </p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    다시 시도
                  </Button>
                </div>
              </div>
            ) : !hasDogs ? (
              // 강아지가 없을 때 - 등록 유도
              <div className="text-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-6">
                      <span className="text-4xl">🐕</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      환영합니다, {user?.name}님! 🎉
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                      DogNote에 처음 오셨네요! 반려견을 등록하고 산책 기록을 시작해보세요.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      🐾 첫 번째 반려견을 등록해주세요
                    </h2>
                    <p className="text-gray-600 mb-4">
                      반려견의 정보를 등록하면 맞춤형 산책 기록과 건강 관리 서비스를 이용하실 수 있습니다.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        GPS 기반 산책 경로 추적
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        건강 기록 및 관리
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        포인트 적립 시스템
                      </li>
                    </ul>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => router.push('/dogs')}
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                      >
                        🐕 반려견 등록하기
                      </Button>
                      <Button 
                        onClick={() => router.push('/dogs')}
                        variant="outline"
                        size="lg"
                        className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-6 py-3"
                      >
                        등록 페이지 둘러보기
                      </Button>
                    </div>
                  </div>

                  {/* 사용자 정보 카드 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">계정 정보</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-medium">이메일:</span> {user?.email}</p>
                      <p><span className="font-medium">로그인 방식:</span> {user?.provider}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 강아지가 있을 때 - 기존 대시보드 내용
              <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    환영합니다, {user?.name}님! 🎉
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    등록된 반려견 {currentDogs.length}마리와 함께 DogNote를 즐겨보세요!
                  </p>
                  
                  {/* 등록된 강아지 요약 */}
                  <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">등록된 반려견</h2>
                    <div className="space-y-2">
                      {currentDogs.slice(0, 3).map((dog) => (
                        <div key={dog.id} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{dog.name}</span>
                          <span className="text-gray-500">{dog.breed}</span>
                        </div>
                      ))}
                      {currentDogs.length > 3 && (
                        <p className="text-sm text-gray-500 pt-2">
                          외 {currentDogs.length - 3}마리 더...
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        onClick={() => router.push('/dogs')}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        반려견 관리하기
                      </Button>
                    </div>
                  </div>

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
                      <li>• GPS 산책 추적 시스템</li>
                      <li>• 건강 기록 관리</li>
                      <li>• 포인트 시스템</li>
                      <li>• 커뮤니티 기능</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
