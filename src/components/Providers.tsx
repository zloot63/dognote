"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import queryClient from "@/lib/react-query"; // ✅ QueryClient 인스턴스 분리
import { Toaster } from "@/components/ui/Toaster";
import { Toaster as Sonner } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster />
                <Sonner 
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: 'white',
                            color: 'black',
                            border: '1px solid #e5e7eb',
                        },
                        className: 'sonner-toast',
                    }}
                />
            </QueryClientProvider>
        </SessionProvider>
    );
}
