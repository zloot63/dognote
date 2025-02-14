"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { fetchDogsFromFirestore } from "@/lib/firebase/dogs";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Dog } from "@/types/dogs";

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
          const dogs = await fetchDogsFromFirestore();
          setDogList(dogs);
          if (dogs.length > 0) setSelectedDog(dogs[0]); // ✅ 첫 번째 강아지를 기본 선택
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

  // ✅ 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("🚨 로그아웃 실패:", error);
    }
  };

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
                src={selectedDog.photoURL || "/default-dog.png"}
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

      {/* ✅ 사이드 메뉴 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}>
          <aside
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsSidebarOpen(false)} className="self-end text-gray-600 hover:text-gray-800">
              <X size={24} />
            </button>

            {/* ✅ 사용자 프로필 (로그인한 경우만 표시) */}
            {user && (
              <div className="mt-5 flex flex-col items-center text-center">
                <Image
                  src={user.photoURL || "/default-avatar.png"}
                  alt="사용자 프로필 이미지"
                  width={60}
                  height={60}
                  className="rounded-full border border-gray-300"
                />
                <p className="mt-2 font-semibold">{user.displayName || "사용자"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}

            {/* ✅ 메뉴 항목 */}
            <nav className="mt-8 flex-grow">
              <ul className="space-y-4">
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">📋 내 일정</button>
                </li>
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">🏥 건강 기록</button>
                </li>
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">🐾 산책 기록</button>
                </li>
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">🏠 커뮤니티</button>
                </li>
              </ul>
            </nav>

            {/* ✅ 로그아웃 버튼 */}
            {user && (
              <button onClick={handleLogout} className="mt-auto w-full text-left text-red-600 hover:text-red-800 font-semibold">
                🚪 로그아웃
              </button>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
