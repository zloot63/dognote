import Link from "next/link";

export default function QuickActions() {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-around">
            <Link href="/add-walk">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600">
                    🚶‍♂️ 산책 기록 시작
                </button>
            </Link>
            <Link href="/add-health">
                <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600">
                    🏥 건강 기록 추가
                </button>
            </Link>
        </footer>
    );
}
