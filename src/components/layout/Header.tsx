'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthSupabase';
import { useDogs } from '@/hooks/useDogs';
import { Menu, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Dog } from '@/types/dog';
import SideMenu from './SideMenu';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { data: dogList = [] } = useDogs();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 첫 번째 강아지를 기본 선택
  const activeDog = selectedDog || dogList[0] || null;

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        {/* 왼쪽 메뉴 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-600"
        >
          <Menu size={28} />
        </button>

        {/* 중앙 로고 */}
        <h1 className="text-2xl font-bold text-gray-800">DogNote</h1>

        {/* ✅ 강아지 전환 버튼 (로그인한 경우만 표시) */}
        {isAuthenticated && activeDog && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Image
                src={activeDog.profileImage || '/default-dog.png'}
                alt={activeDog.name}
                width={30}
                height={30}
                className="rounded-full border border-gray-300"
              />
              {activeDog.name}
              <ChevronDown size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                {dogList.map(dog => (
                  <button
                    key={dog.id}
                    onClick={() => {
                      setSelectedDog(dog);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {dog.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ✅ 분리된 SideMenu 컴포넌트 */}
      <SideMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
