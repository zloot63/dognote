'use client';

import { Dog } from '@/types/dogs';

interface DogProfileProps {
  dogs: Dog[];
}

export default function DogProfile({ dogs }: DogProfileProps) {
  return (
    <section className="bg-white p-4 shadow-md rounded-lg mb-4">
      <h2 className="text-xl font-bold">🐶 내 강아지</h2>
      {dogs.length > 0 ? (
        <ul>
          {dogs.map(dog => (
            <li key={dog.id} className="flex items-center gap-4 mt-2">
              <img
                src={dog.profileImage || '/default-dog.png'}
                alt={dog.name}
                className="w-12 h-12 rounded-full border border-gray-300"
              />
              <p className="text-lg">
                {dog.name} ({dog.breed})
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">등록된 강아지가 없습니다.</p>
      )}
    </section>
  );
}
