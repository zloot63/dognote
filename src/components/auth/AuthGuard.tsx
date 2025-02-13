"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login"); // ✅ 인증 안된 경우 로그인 페이지로 이동
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [router]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }

    return <>{children}</>;
}
