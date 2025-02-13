"use client";

import { useFetchData } from "@/hooks/useFetchData";
import { fetchDogsFromFirestore } from "@/lib/firestore";
import Layout from "@/components/layout/Layout";
import DogProfile from "@/components/dashboard/DogProfile";
import RecentSchedule from "@/components/dashboard/RecentSchedule";
import AddDogForm from "@/components/dog/AddDogForm";

export default function Dashboard() {
  const { data: dogs, loading, refetch } = useFetchData(fetchDogsFromFirestore);

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg font-semibold">🐶 데이터를 불러오는 중...</p>
        </div>
      ) : dogs && dogs.length > 0 ? (
        <>
          <DogProfile dogs={dogs} />
          <RecentSchedule />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-xl font-bold mb-4">🐶 등록된 강아지가 없습니다.</h2>
          <AddDogForm refetch={refetch} />
        </div>
      )}
    </Layout>
  );
}