"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { fetchDogsFromFirestore } from "@/lib/firestore"; // ✅ 강아지 정보 가져오기
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null); // ✅ 현재 선택된 강아지
  const [dogList, setDogList] = useState([]); // ✅ 강아지 목록
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ 사용자 & 강아지 정보 가져오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const dogs = await fetchDogsFromFirestore();
        setDogList(dogs);
        if (dogs.length > 0) setSelectedDog(dogs[0]); // 기본 강아지 설정
      } else {
        setUser(null);
        setDogList([]);
        setSelectedDog(null);
      }
    });

    return unsubscribe;
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
      {/* ✅ 상단 헤더 */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        {/* 왼쪽 메뉴 버튼 */}
        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
          <Menu size={28} />
        </button>

        {/* 중앙 로고 */}
        <h1 className="text-2xl font-bold text-gray-800">DogNote</h1>

        {/* ✅ 강아지 전환 버튼 */}
        {selectedDog && (
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

      {/* ✅ 사이드 메뉴 (왼쪽에서 슬라이드) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}>
          <aside
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 사이드바 닫기 버튼 */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="self-end text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            {/* ✅ 강아지 프로필 정보 (사용자 등록 강아지) */}
            {selectedDog && (
              <div className="mt-5 flex flex-col items-center text-center">
                <Image
                  src={selectedDog.photoURL || "/default-dog.png"}
                  alt="강아지 프로필 이미지"
                  width={60}
                  height={60}
                  className="rounded-full border border-gray-300"
                />
                <p className="mt-2 font-semibold">{selectedDog.name}</p>
                <p className="text-sm text-gray-500">{selectedDog.breed}</p>
              </div>
            )}

            {/* 메뉴 항목 */}
            <nav className="mt-8 flex-grow">
              <ul className="space-y-4">
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">
                    📋 내 일정
                  </button>
                </li>
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">
                    🏥 건강 기록
                  </button>
                </li>
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">
                    🐾 산책 기록
                  </button>
                </li>
                <li>
                  <button className="w-full text-left text-gray-700 hover:text-gray-900">
                    🏠 커뮤니티
                  </button>
                </li>
              </ul>
            </nav>

            {/* ✅ 로그아웃 버튼 (사이드바 하단) */}
            <button
              onClick={handleLogout}
              className="mt-auto w-full text-left text-red-600 hover:text-red-800 font-semibold"
            >
              🚪 로그아웃
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
