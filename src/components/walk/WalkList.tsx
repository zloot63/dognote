"use client";

import { Walk } from "@/types/walks";
import Link from "next/link";

interface WalkListProps {
    walks: Walk[];
}

export default function WalkList({ walks }: WalkListProps) {
    if (!walks || walks.length === 0) {
        return <div className="text-center p-5">📭 기록된 산책이 없습니다.</div>;
    }

    return (
        <div className="p-5 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🐾 산책 기록</h1>
            {walks.map((walk: Walk) => (
                <div key={walk.id} className="bg-white shadow-md p-4 rounded-lg mb-3">
                    <p><strong>날짜:</strong> {new Date(walk.startTime).toLocaleDateString()}</p>
                    <p><strong>거리:</strong> {walk.distance ? `${walk.distance} km` : "측정 중"}</p>
                    <p><strong>상태:</strong> {walk.status === "completed" ? "완료됨" : "진행 중"}</p>
                    <Link href={`/walks/details/${walk.id}`}>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                            자세히 보기
                        </button>
                    </Link>
                </div>
            ))}
        </div>
    );
}