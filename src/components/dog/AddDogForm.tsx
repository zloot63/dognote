"use client";

import { useState } from "react";
import { useAddDog } from "@/hooks/useDogs";
import { Dog } from "@/types/dogs";

export default function AddDogForm() {
  const { mutate, isLoading } = useAddDog();
  const [dog, setDog] = useState<Dog>({
    id: "",
    name: "",
    breed: "",
    age: 0,
    weight: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDog({ ...dog, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dog.name.trim() || !dog.breed.trim() || dog.age <= 0 || dog.weight <= 0) {
      alert("⚠ 모든 필드를 올바르게 입력해주세요!");
      return;
    }

    mutate(dog);
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
          value={dog[field as keyof Dog]}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          disabled={isLoading} // ✅ 로딩 중이면 입력 비활성화
        />
      ))}

      <button
        type="submit"
        className={`w-full p-2 rounded ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        disabled={isLoading} // ✅ 로딩 중 버튼 비활성화
      >
        {isLoading ? "저장 중..." : "저장하기"}
      </button>
    </form>
  );
}