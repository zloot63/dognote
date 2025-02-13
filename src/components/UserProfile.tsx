"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function UserProfile() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md w-80">
            {user ? (
                <div className="flex flex-col items-center">
                    <img src={user.photoURL || "/default-avatar.png"}
                         alt="User Avatar"
                         className="w-20 h-20 rounded-full" />
                    <h2 className="mt-2 text-xl font-bold">{user.displayName}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <button
                        onClick={() => signOut(auth)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-500">로그인이 필요합니다.</p>
            )}
        </div>
    );
}
