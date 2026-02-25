import WalkList from '@/components/walk/WalkList';
import { Walk } from '@/types/walks';

// TODO: Supabase walks 서비스 연동 필요
export default async function WalkListPage() {
  const walks: Walk[] = []; // TODO: Supabase에서 데이터 가져오기
  return <WalkList walks={walks} />;
}
