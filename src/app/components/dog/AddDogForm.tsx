"use client";

import { useState } from "react";
import { saveDogToFirestore } from "@/lib/firestore";

interface DogFormState {
    name: string;
    breed: string;
    age: string;
    weight: string;
}

export default function AddDogForm() {
    const [dog, setDog] = useState<DogFormState>({ name: "", breed: "", age: "", weight: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDog({ ...dog, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 입력 값 검증
        if (!dog.name.trim() || !dog.breed.trim() || !dog.age.trim() || !dog.weight.trim()) {
            alert("⚠ 모든 필드를 입력해주세요!");
            return;
        }

        await saveDogToFirestore({
            name: dog.name.trim(),
            breed: dog.breed.trim(),
            age: Number(dog.age),
            weight: Number(dog.weight),
        });

        setDog({ name: "", breed: "", age: "", weight: "" });
        alert("✅ 강아지 정보가 저장되었습니다! 🐶");
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg w-80">
            <h2 className="text-xl font-bold mb-2">강아지 정보 입력</h2>

            {["name", "breed", "age", "weight"].map((field, index) => (
                <input
                    key={index}
                    type={field === "age" || field === "weight" ? "number" : "text"}
                    name={field}
                    placeholder={field === "name" ? "이름" : field === "breed" ? "견종" : field === "age" ? "나이" : "몸무게 (kg)"}
                    value={dog[field as keyof DogFormState]}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                />
            ))}

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                저장하기
            </button>
        </form>
    );
}
