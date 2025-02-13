"use client";

import { useEffect, useState } from "react";
import { fetchDogsFromFirestore } from "@/lib/firestore";
import { auth } from "@/lib/firebase"; //  auth는 firebase.ts에서 불러옴
import { onAuthStateChanged } from "firebase/auth"; //  여기가 중요!

export default function DogList() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const dogData = await fetchDogsFromFirestore();
        setDogs(dogData);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isLoggedIn) {
    return <p className="text-gray-500">로그인 후 강아지 정보를 확인할 수 있습니다.</p>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-80 mt-4">
      <h2 className="text-xl font-bold mb-2">🐶 내 강아지 목록</h2>
      {dogs.length === 0 ? (
        <p className="text-gray-500">등록된 강아지가 없습니다.</p>
      ) : (
        <ul>
          {dogs.map((dog) => (
            <li key={dog.id} className="p-2 border-b">
              <strong>{dog.name}</strong> ({dog.breed}) - {dog.age}살, {dog.weight}kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
