"use client"; // ✅ 추가

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import DogProfile from "@/components/dashboard/DogProfile";
import RecentSchedule from "@/components/dashboard/RecentSchedule";
import AddDogForm from "@/components/dog/AddDogForm"; 
import { fetchDogsFromFirestore } from "@/lib/firestore";

export default function Dashboard() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dogData = await fetchDogsFromFirestore();
      setDogs(dogData);
    };

    fetchData();
  }, []);

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
