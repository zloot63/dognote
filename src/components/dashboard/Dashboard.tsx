"use client";

import { useSession } from "next-auth/react";
// import { useFetchDogs } from "@/hooks/useDogs"; // 임시 비활성화
import Layout from "@/components/layout/Layout";
import DogProfile from "@/components/dashboard/DogProfile";
import RecentSchedule from "@/components/dashboard/RecentSchedule";
import WalkStatsChart from "@/components/dashboard/WalkStatsChart";
import PointsDisplay from "@/components/dashboard/PointsDisplay";
import RecentWalksList from "@/components/dashboard/RecentWalksList";
import HealthSummary from "@/components/dashboard/HealthSummary";
import QuickActions from "@/components/dashboard/QuickActions";
import AddDogForm from "@/components/dog/AddDogForm";

/**
 * ✅ Dashboard 페이지 (강아지 정보 & 일정 관리)
 */
export default function Dashboard() {
    const { data: session } = useSession(); // ✅ 현재 로그인된 사용자 세션 가져오기
    const userId = session?.user?.email ?? ""; // ✅ user.id 대신 email을 식별자로 사용

    // 임시 목업 데이터 (실제로는 useFetchDogs 훅 사용)
    const dogs = [
        {
            id: '1',
            name: '멍멍이',
            breed: '골든 리트리버',
            age: 3,
            imageUrl: '/images/default-dog.jpg'
        }
    ];
    const isLoading = false;

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-lg font-semibold">🐶 데이터를 불러오는 중...</p>
                </div>
            </Layout>
        );
    }

    // 목업 데이터 (실제로는 API에서 가져올 데이터)
    const mockWalkData = [
        {
            id: '1',
            date: new Date().toISOString(),
            distance: 1500,
            duration: 1800
        },
        {
            id: '2', 
            date: new Date(Date.now() - 86400000).toISOString(),
            distance: 2200,
            duration: 2400
        }
    ];

    const mockPointsData = {
        totalPoints: 1250,
        monthlyPoints: 320,
        weeklyPoints: 85,
        todayPoints: 15,
        rank: 'Silver',
        nextMilestone: 2000
    };

    const mockWalkRecords = [
        {
            id: '1',
            date: new Date().toISOString(),
            startTime: new Date(Date.now() - 3600000).toISOString(),
            endTime: new Date().toISOString(),
            distance: 1500,
            duration: 1800,
            dogNames: ['멍멍이'],
            status: 'completed' as const,
            rating: 4
        }
    ];

    const mockHealthRecords = [
        {
            id: '1',
            date: new Date().toISOString(),
            type: 'vaccination' as const,
            title: '종합백신 접종',
            status: 'upcoming' as const,
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
            dogName: '멍멍이'
        }
    ];

    return (
        <Layout 
            variant="dashboard" 
            showFooter={true}
            showWalkButton={true}
        >
            {dogs.length > 0 ? (
                <div className="space-y-6">
                    {/* 상단 강아지 프로필 */}
                    <DogProfile dogs={dogs} />
                    
                    {/* 퀵 액션 */}
                    <QuickActions />
                    
                    {/* 메인 대시보드 그리드 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 포인트 현황 */}
                        <PointsDisplay pointsData={mockPointsData} />
                        
                        {/* 건강 요약 */}
                        <HealthSummary healthRecords={mockHealthRecords} />
                        
                        {/* 산책 통계 차트 */}
                        <div className="lg:col-span-2">
                            <WalkStatsChart walks={mockWalkData} />
                        </div>
                        
                        {/* 최근 산책 기록 */}
                        <RecentWalksList walks={mockWalkRecords} />
                        
                        {/* 최근 일정 */}
                        <RecentSchedule />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-xl font-bold mb-4">🐶 등록된 강아지가 없습니다.</h2>
                    <AddDogForm />
                </div>
            )}
        </Layout>
    );
}
