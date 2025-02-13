"use client";

import { useEffect, useState } from "react";
import { fetchDogsFromFirestore } from "@/lib/firestore";

export default function DogList() {
    const [dogs, setDogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchDogs = async () => {
            const dogData = await fetchDogsFromFirestore();
            setDogs(dogData);
        };
        fetchDogs();
    }, []);

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
