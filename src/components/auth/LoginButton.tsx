"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { saveUserToFirestore } from "@/lib/firestore";

export default function LoginButton() {
  const [user, setUser] = useState<any>(null);

  // 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        saveUserToFirestore({
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Google 로그인
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ 로그인 성공:", user);

      // Firestore에 사용자 정보 저장
      await saveUserToFirestore({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    } catch (error) {
      console.error("🔥 로그인 실패:", error);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ 로그아웃 성공");
      setUser(null);
    } catch (error) {
      console.error("🔥 로그아웃 실패:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {user ? (
        <div className="flex items-center space-x-3">
          <img src={user.photoURL || "/default-avatar.png"} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-lg font-bold">{user.displayName || "사용자"}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            로그아웃
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Google 로그인
        </button>
      )}
    </div>
  );
}
