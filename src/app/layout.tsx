import type { Metadata } from "next";
import "@/styles/globals.css"; // ✅ 글로벌 CSS 유지

export const metadata: Metadata = {
    title: "DogNote",
    description: "반려견 건강 & 일정 관리 앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}
