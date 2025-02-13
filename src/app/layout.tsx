import type { Metadata } from "next";
import ClientLayout from "@/components/layout/ClientLayout";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "DogNote",
    description: "반려견 건강 & 일정 관리 앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
