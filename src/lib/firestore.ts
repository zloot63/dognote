import { getFirestore, collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import { auth } from "@/lib/firebase";

export const db = getFirestore();

/**
 * 현재 로그인한 사용자 ID 반환
 */
const getUserId = (): string | null => auth.currentUser?.uid || null;

/**
 * Firestore에 강아지 정보 저장
 * @param dog - 강아지 정보 (이름, 견종, 나이, 몸무게)
 */
export const saveDogToFirestore = async (dog: { name: string; breed: string; age: number; weight: number }) => {
  const userId = getUserId();
  if (!userId) {
    console.error("❌ 로그인한 사용자 정보가 없습니다.");
    return;
  }

  try {
    const dogsCollectionRef = collection(db, "users", userId, "dogs");
    await addDoc(dogsCollectionRef, {
      ...dog,
      createdAt: new Date().toISOString(),
    });
    console.log("✅ 강아지 정보 저장 완료:", dog);
  } catch (error) {
    console.error("🔥 강아지 정보 저장 실패:", error);
  }
};

/**
 * Firestore에서 강아지 정보 불러오기
 * @returns {Promise<DocumentData[]>} - 저장된 강아지 리스트
 */
export const fetchDogsFromFirestore = async (): Promise<DocumentData[]> => {
  const userId = getUserId();
  if (!userId) {
    console.error("❌ 로그인한 사용자 정보가 없습니다.");
    return [];
  }

  try {
    const dogsCollectionRef = collection(db, "users", userId, "dogs");
    const snapshot = await getDocs(dogsCollectionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("🔥 강아지 정보 불러오기 실패:", error);
    return [];
  }
};
