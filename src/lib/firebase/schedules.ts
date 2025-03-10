import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Schedule } from "@/types/schedule";

/**
 * ✅ Firestore에서 최근 주요일정 가져오기
 */
export const fetchRecentSchedules = async (): Promise<Schedule[]> => {
  try {
    const scheduleRef = collection(db, "schedules");
    const q = query(scheduleRef, orderBy("date", "asc")); // ✅ 날짜순 정렬
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  } catch (error) {
    console.error("🔥 Firestore에서 일정 불러오기 실패:", error);
    return [];
  }
};
