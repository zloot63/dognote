'use client';

import { useState, useCallback } from 'react';
import { useCreateDog } from '@/hooks/useDogs';
import { DogFormData } from '@/types/dog';
import { useToast } from '@/components/ui';

export default function AddDogForm() {
  const { mutate, isPending: isLoading } = useCreateDog();
  const { toast } = useToast();

  const [dog, setDog] = useState<DogFormData>({
    name: '',
    breed: '',
    gender: 'male',
    birthDate: new Date().toISOString().split('T')[0],
    weight: 0,
    isNeutered: false,
    color: '',
    size: 'medium',
    activityLevel: 'moderate',
    description: '',
    temperament: [],
    allergies: [],
    medicalConditions: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    veterinarian: {
      name: '',
      clinic: '',
      phone: '',
      address: '',
    },
  });

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;

      setDog(prev => ({
        ...prev,
        [name]:
          type === 'number'
            ? parseFloat(value) || 0
            : type === 'checkbox'
              ? (e.target as HTMLInputElement).checked
              : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!dog.name.trim() || !dog.breed.trim() || dog.weight <= 0) {
        toast?.error('입력 오류', '필수 항목을 모두 입력해주세요.');
        return;
      }

      mutate(dog);
    },
    [dog, mutate, toast]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-lg max-w-md w-full"
    >
      <h2 className="text-xl font-bold mb-4">강아지 정보 입력</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="이름 *"
          name="name"
          value={dog.name}
          onChange={handleChange}
          disabled={isLoading}
        />
        <InputField
          label="견종 *"
          name="breed"
          value={dog.breed}
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="mb-2 col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            성별 *
          </label>
          <select
            name="gender"
            value={dog.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="male">수컷</option>
            <option value="female">암컷</option>
          </select>
        </div>

        <InputField
          label="생년월일 *"
          name="birthDate"
          type="date"
          value={dog.birthDate}
          onChange={handleChange}
          disabled={isLoading}
        />

        <InputField
          label="몸무게 (kg) *"
          name="weight"
          type="number"
          value={dog.weight}
          onChange={handleChange}
          disabled={isLoading}
        />

        <InputField
          label="색상 *"
          name="color"
          value={dog.color}
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="mb-2 col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            크기 *
          </label>
          <select
            name="size"
            value={dog.size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="small">소형</option>
            <option value="medium">중형</option>
            <option value="large">대형</option>
            <option value="giant">초대형</option>
          </select>
        </div>

        <div className="mb-2 col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            활동량 *
          </label>
          <select
            name="activityLevel"
            value={dog.activityLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="low">낮음</option>
            <option value="moderate">보통</option>
            <option value="high">높음</option>
            <option value="very_high">매우 높음</option>
          </select>
        </div>

        <div className="mb-2 col-span-2 flex items-center">
          <input
            type="checkbox"
            id="isNeutered"
            name="isNeutered"
            checked={dog.isNeutered}
            onChange={handleChange}
            className="mr-2"
            disabled={isLoading}
          />
          <label
            htmlFor="isNeutered"
            className="text-sm font-medium text-gray-700"
          >
            중성화 수술 완료
          </label>
        </div>

        <div className="mb-2 col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            설명
          </label>
          <textarea
            name="description"
            value={dog.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full p-2 rounded mt-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        disabled={isLoading}
      >
        {isLoading ? '저장 중...' : '반려견 등록하기'}
      </button>
    </form>
  );
}

interface InputFieldProps {
  label: string;
  name: keyof DogFormData;
  type?: 'text' | 'number' | 'date';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  disabled,
}: InputFieldProps) => (
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
