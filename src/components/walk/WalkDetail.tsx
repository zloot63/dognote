'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Walk } from '@/types/walks';

// TODO: Supabase walks 서비스 연동 필요
interface WalkDetailProps {
  walkId: string;
}

export default function WalkDetail({ walkId }: WalkDetailProps) {
  const [walk] = useState<Walk | null>(null);
  const [mood, setMood] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [issues, setIssues] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!walkId) return;
    // TODO: Supabase에서 산책 데이터 조회
    console.warn('TODO: fetch walk from Supabase:', walkId);
  }, [walkId, router]);

  const handleSave = async () => {
    if (!walk) return;
    setIsSaving(true);

    // TODO: Supabase에 산책 상세 정보 업데이트
    console.warn('TODO: update walk in Supabase:', walk.id, {
      mood,
      condition,
      issues,
      notes,
    });

    setIsSaving(false);
    alert('산책 기록이 저장되었습니다!');
    router.push('/walks');
  };

  if (!walk) {
    return <div className="text-center p-5">⏳ 산책 정보를 불러오는 중...</div>;
  }

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🐾 산책 상세 정보</h1>
      <div className="bg-white shadow-md p-4 rounded-lg">
        <p>
          <strong>강아지 ID:</strong> {walk.dogIds.join(', ')}
        </p>
        <p>
          <strong>시작 시간:</strong>{' '}
          {new Date(walk.startTime).toLocaleString()}
        </p>
        <p>
          <strong>종료 시간:</strong>{' '}
          {walk.endTime ? new Date(walk.endTime).toLocaleString() : '진행 중'}
        </p>
        <p>
          <strong>거리:</strong>{' '}
          {walk.distance ? `${walk.distance} km` : '측정 중'}
        </p>
        <p>
          <strong>상태:</strong>{' '}
          {walk.status === 'completed' ? '완료됨' : '진행 중'}
        </p>
      </div>

      {/* ✅ 사용자 입력 폼 추가 */}
      <div className="bg-gray-100 p-4 rounded-lg mt-4">
        <h2 className="text-lg font-bold">산책 추가 정보 입력</h2>
        <label className="block mt-2">산책 기분</label>
        <select
          className="w-full p-2 rounded"
          value={mood}
          onChange={e => setMood(e.target.value)}
        >
          <option value="">선택</option>
          <option value="happy">😀 행복</option>
          <option value="neutral">😐 보통</option>
          <option value="tired">😩 피곤</option>
          <option value="sad">😢 슬픔</option>
        </select>

        <label className="block mt-2">강아지 컨디션</label>
        <select
          className="w-full p-2 rounded"
          value={condition}
          onChange={e => setCondition(e.target.value)}
        >
          <option value="">선택</option>
          <option value="good">좋음</option>
          <option value="normal">보통</option>
          <option value="tired">피곤함</option>
          <option value="sick">아픔</option>
        </select>

        <label className="block mt-2">산책 중 이슈</label>
        <input
          type="text"
          className="w-full p-2 rounded"
          placeholder="이슈 입력 (쉼표로 구분)"
          value={issues.join(', ')}
          onChange={e => setIssues(e.target.value.split(', '))}
        />

        <label className="block mt-2">추가 메모</label>
        <textarea
          className="w-full p-2 rounded"
          placeholder="산책에 대한 메모를 남겨주세요"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '💾 저장하기'}
        </button>
      </div>
    </div>
  );
}
