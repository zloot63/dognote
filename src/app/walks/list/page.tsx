import { getUserWalks } from "@/lib/firebase/walks";
import WalkList from "@/components/walk/WalkList";
import { Walk } from "@/types/walks";

export default async function WalkListPage() {
    const walks: Walk[] = await getUserWalks(); // ✅ 서버에서 Firestore 데이터 가져오기
    return <WalkList walks={walks} />;
}