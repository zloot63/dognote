'use client';

import { useParams } from 'next/navigation';
import WalkDetail from '@/components/walk/WalkDetail';

export const runtime = 'edge';

// TODO: Supabase walks 서비스 연동 필요
export default function WalkDetailPage() {
  const params = useParams();

  if (!params?.walkId) {
    return <div>올바르지 않은 요청입니다.</div>;
  }

  return <WalkDetail walkId={params.walkId as string} />;
}
