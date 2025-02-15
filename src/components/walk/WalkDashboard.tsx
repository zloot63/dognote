"use client";

import { Walk } from "@/types/walks";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface WalkDashboardProps {
    walks: Walk[];
}

export default function WalkDashboard({ walks }: WalkDashboardProps) {
    if (!walks || walks.length === 0) {
        return (
            <div className="text-center p-5 text-gray-600">
                📭 아직 산책 기록이 없습니다.<br />
                <Link href="/start-walk">
                    <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                        첫 산책 시작하기
                    </button>
                </Link>
            </div>
        );
    }

    // ✅ 산책 거리 & 날짜 데이터 변환
    const walkData = walks.map((walk) => ({
        date: new Date(walk.startTime).toLocaleDateString(),
        distance: walk.distance || 0,
    }));

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📊 산책 대시보드</h1>
            
            {/* ✅ 산책 목표 대비 진행률 */}
            <div className="bg-white shadow-md p-4 rounded-lg mb-4 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">🎯 이번 달 목표 달성률</h2>
                <p className="text-center text-2xl font-bold text-green-500">🚀 80% 완료</p>
            </div>

            {/* ✅ 주간/월간 산책 거리 그래프 */}
            <div className="bg-white shadow-md p-4 rounded-lg mb-4 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">📈 주간 산책 거리</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={walkData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="distance" stroke="#4CAF50" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ✅ 최근 산책 기록 */}
            <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">📅 최근 산책 기록</h2>
                {walks.slice(0, 2).map((walk: Walk) => (
                    <div key={walk.id} className="border-b py-3 flex justify-between items-center">
                        <div>
                            <p className="text-gray-700"><strong>📆 날짜:</strong> {new Date(walk.startTime).toLocaleDateString()}</p>
                            <p className="text-gray-700"><strong>🚶 거리:</strong> {walk.distance ? `${walk.distance} km` : "측정 중"}</p>
                        </div>
                        <Link href={`/walks/details/${walk.id}`}>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                                자세히 보기
                            </button>
                        </Link>
                    </div>
                ))}
                <div className="text-center mt-4">
                    <Link href="/walks/list">
                        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                            전체 보기
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}