import Link from "next/link";
import WalkButton from "@/components/walk/WalkButton"; 

export default function BottomNav() {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-around">
            <WalkButton />
            <Link href="/add-health">
                <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600">
                    🏥 건강 기록 추가
                </button>
            </Link>
        </footer>
    );
}
