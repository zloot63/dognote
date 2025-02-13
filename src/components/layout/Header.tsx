"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { fetchDogsFromFirestore } from "@/lib/firestore";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Dog } from "@/types/dogs";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string; email: string; photoURL?: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogList, setDogList] = useState<Dog[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || "사용자",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "/default-avatar.png",
        });
        const dogs = await fetchDogsFromFirestore();
        setDogList(dogs);
        if (dogs.length > 0) setSelectedDog(dogs[0]);
      } else {
        setUser(null);
        setDogList([]);
        setSelectedDog(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("🚨 로그아웃 실패:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const dogs = await fetchDogsFromFirestore();
      setDogList(dogs);
      if (dogs.length > 0) setSelectedDog(dogs[0]);
    };
    fetchData();
  }, []);
  

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
          <Menu size={28} />
        </button>

        <h1 className="text-2xl font-bold text-gray-800">DogNote</h1>

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

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}>
          <aside
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="self-end text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>

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
