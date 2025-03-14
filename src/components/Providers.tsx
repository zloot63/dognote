"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import queryClient from "@/lib/react-query"; // ✅ QueryClient 인스턴스 분리

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
