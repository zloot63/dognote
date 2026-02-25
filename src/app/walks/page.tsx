import WalkDashboard from '@/components/walk/WalkDashboard';
import { Walk } from '@/types/walks';

// TODO: Supabase walks 서비스 연동 필요
export default async function WalkDashboardPage() {
  const walks: Walk[] = []; // TODO: Supabase에서 데이터 가져오기
  return <WalkDashboard walks={walks} />;
}
