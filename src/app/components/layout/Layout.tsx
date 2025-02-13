import Header from "@/app/components/layout/Header";
import BottomNav from "@/app/components/layout/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow p-4">{children}</main>
            <BottomNav />
        </div>
    );
}