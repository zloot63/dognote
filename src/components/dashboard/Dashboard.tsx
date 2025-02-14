"use client";

import { useFetchDogs } from "@/hooks/useDogs";
import Layout from "@/components/layout/Layout";
import DogProfile from "@/components/dashboard/DogProfile";
import RecentSchedule from "@/components/dashboard/RecentSchedule";
import AddDogForm from "@/components/dog/AddDogForm";
import WalkHistory from "@/components/walk/WalkHistory";

export default function Dashboard() {
    const { data: dogs, isLoading } = useFetchDogs(); // ✅ 강아지 목록 가져오기

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
            {dogs && dogs.length > 0 ? (
                <>
                    <DogProfile dogs={dogs} />
                    <RecentSchedule />
                    <WalkHistory /> {/* ✅ 산책 기록 표시 */}
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
