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
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg w-96">
      <h2 className="text-2xl font-bold mb-4 text-center">🐾 강아지 등록</h2>

      {["name", "breed", "age", "weight"].map((field, index) => (
        <div key={index} className="mb-3">
          <label className="block text-gray-700 font-medium">
            {field === "name"
              ? "이름"
              : field === "breed"
              ? "견종"
              : field === "age"
              ? "나이"
              : "몸무게 (kg)"}
          </label>
          <input
            type={field === "age" || field === "weight" ? "number" : "text"}
            name={field}
            placeholder=""
            value={dog[field as keyof DogFormState]}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
        등록하기
      </button>
    </form>
  );
}
