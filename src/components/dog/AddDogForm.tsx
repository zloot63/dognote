"use client";

import { useState, useCallback } from "react";
import { useAddDog } from "@/hooks/useDogs";
import { Dog } from "@/types/dogs";

export default function AddDogForm() {
  const { mutate, isLoading } = useAddDog();
  const [dog, setDog] = useState<Omit<Dog, "id">>({
    name: "",
    breed: "",
    age: 0,
    weight: 0,
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setDog((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!dog.name.trim() || !dog.breed.trim() || dog.age <= 0 || dog.weight <= 0) {
      alert("⚠ 모든 필드를 올바르게 입력해주세요!");
      return;
    }
    mutate(dog);
  }, [dog, mutate]);

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg w-80">
      <h2 className="text-xl font-bold mb-2">강아지 정보 입력</h2>

      {/* ✅ 입력 필드 */}
      <InputField label="이름" name="name" value={dog.name} onChange={handleChange} disabled={isLoading} />
      <InputField label="견종" name="breed" value={dog.breed} onChange={handleChange} disabled={isLoading} />
      <InputField label="나이" name="age" type="number" value={dog.age} onChange={handleChange} disabled={isLoading} />
      <InputField label="몸무게 (kg)" name="weight" type="number" value={dog.weight} onChange={handleChange} disabled={isLoading} />

      {/* ✅ 제출 버튼 */}
      <button
        type="submit"
        className={`w-full p-2 rounded ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        disabled={isLoading}
      >
        {isLoading ? "저장 중..." : "저장하기"}
      </button>
    </form>
  );
}

/**
 * ✅ 입력 필드 컴포넌트
 */
interface InputFieldProps {
  label: string;
  name: keyof Omit<Dog, "id">;
  type?: "text" | "number";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const InputField = ({ label, name, type = "text", value, onChange, disabled }: InputFieldProps) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
      disabled={disabled}
    />
  </div>
);
