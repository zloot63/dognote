"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { listAllDogs } from "@/lib/firebase/dogs";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Dog } from "@/types/dogs";
import SideMenu from "./SideMenu"; // ✅ 추가

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogList, setDogList] = useState<Dog[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ 사용자 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const dogs = await listAllDogs();
  
          setDogList(dogs);
          if (dogs.length > 0) {
            setSelectedDog(dogs[0]);
          }
        } catch (error) {
          console.error("🔥 강아지 데이터 로드 실패:", error);
        }
      } else {
        setDogList([]);
        setSelectedDog(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        {/* 왼쪽 메뉴 버튼 */}
        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
          <Menu size={28} />
        </button>

        {/* 중앙 로고 */}
        <h1 className="text-2xl font-bold text-gray-800">DogNote</h1>

        {/* ✅ 강아지 전환 버튼 (로그인한 경우만 표시) */}
        {user && selectedDog && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Image
                src={selectedDog.profileImage || "/default-dog.png"}
                alt={selectedDog.name}
                width={30}
                height={30}
                className="rounded-full border border-gray-300"
              />
              {selectedDog.name}
              <ChevronDown size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                {dogList.map((dog) => (
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
      <SideMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
    </>
  );
}