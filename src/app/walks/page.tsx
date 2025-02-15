import { getUserWalks } from "@/lib/firebase/walks";
import WalkDashboard from "@/components/walk/WalkDashboard";
import { Walk } from "@/types/walks";

export default async function WalkDashboardPage() {
    const walks: Walk[] = await getUserWalks(); // ✅ Firestore에서 데이터 가져오기
    return <WalkDashboard walks={walks} />;
}