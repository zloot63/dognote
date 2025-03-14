import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import Providers from "@/components/Providers"

export const metadata: Metadata = {
    title: "DogNote",
    description: "반려견 건강 & 일정 관리 앱",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <Providers>{children}</Providers> 
            </body>
        </html>
    );
}
