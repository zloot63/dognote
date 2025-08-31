"use client";

import { useUserWalks } from "@/hooks/useWalks";
import { Walk } from "@/types/walks";

export default function WalkHistory() {
    const { walks, loading } = useUserWalks();

    return (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">산책 기록</h2>

            {loading && <p>📡 로딩 중...</p>}

            {!loading && walks.length === 0 && <p>🚶‍♂️ 산책 기록이 없습니다.</p>}

            {!loading && walks.length > 0 && (
                <ul className="space-y-2">
                    {walks.map((walk: Walk) => (
                        <li key={walk.id} className="p-2 border rounded-lg">
                            <p className="font-medium">📍 산책 시작: {new Date(walk.startTime).toLocaleString()}</p>
                            <p>🕒 종료: {walk.endTime ? new Date(walk.endTime).toLocaleString() : "진행 중"}</p>
                            <p>📏 거리: {walk.distance ? walk.distance.toFixed(2) : '0.00'} km</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
