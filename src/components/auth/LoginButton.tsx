"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { db, saveUserToFirestore } from "@/lib/firestore";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function LoginButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await saveUserToFirestore(user); // 🔥 Firestore에 사용자 정보 저장
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user); // 🔥 로그인 시 Firestore 저장
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  if (user) return null; // 로그인 상태일 때 버튼 숨기기

  return (
    <button
      onClick={loginWithGoogle}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Google 로그인
    </button>
  );
}
