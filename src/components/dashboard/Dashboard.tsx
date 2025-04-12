"use client";

import { useSession } from "next-auth/react";
import { useFetchDogs } from "@/hooks/useDogs";
import Layout from "@/components/layout/Layout";
import DogProfile from "@/components/dashboard/DogProfile";
import RecentSchedule from "@/components/dashboard/RecentSchedule";
import AddDogForm from "@/components/dog/AddDogForm";

/**
 * ✅ Dashboard 페이지 (강아지 정보 & 일정 관리)
 */
export default function Dashboard() {
    const { data: session } = useSession(); // ✅ 현재 로그인된 사용자 세션 가져오기
    const userId = session?.user?.email ?? ""; // ✅ user.id 대신 email을 식별자로 사용

    // ✅ userId가 존재하는 경우에만 강아지 데이터를 가져오도록 설정
    const { data: dogs = [], isLoading } = useFetchDogs(userId);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-lg font-semibold">🐶 데이터를 불러오는 중...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {dogs.length > 0 ? (
                <>
                    <DogProfile dogs={dogs} />
                    <RecentSchedule />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-xl font-bold mb-4">🐶 등록된 강아지가 없습니다.</h2>
                    <AddDogForm />
                </div>
            )}
        </Layout>
    );
}
