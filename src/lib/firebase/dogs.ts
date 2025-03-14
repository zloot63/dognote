import { db } from "@/lib/firebase"; // ← 여기로 수정
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { Dog } from "@/types/dogs";

/**
 * 강아지 등록 (Create)
 */
export const createDog = async (
  dog: Omit<Dog, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const dogRef = await addDoc(collection(db, "dogs"), {
      ...dog,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return dogRef.id;
  } catch (error) {
    console.error("🚨 강아지 등록 실패:", error);
    return null;
  }
};

// 강아지 정보 조회 (Read)
export const getDogById = async (dogId: string): Promise<Dog | null> => {
  try {
    const dogDoc = await getDoc(doc(db, "dogs", dogId));
    if (!dogDoc.exists()) return null;

    return { id: dogDoc.id, ...dogDoc.data() } as Dog;
  } catch (error) {
    console.error("🚨 강아지 조회 실패:", error);
    return null;
  }
};

// 강아지 정보 업데이트 (Update)
export const updateDog = async (
  dogId: string,
  data: Partial<Omit<Dog, "id" | "createdAt">>
): Promise<void> => {
  await updateDoc(doc(db, "dogs", dogId), { ...data, updatedAt: new Date() });
};

// 강아지 삭제 (Delete)
export const deleteDog = async (dogId: string): Promise<void> => {
  await deleteDoc(doc(db, "dogs", dogId));
};


/**
 * 모든 강아지 목록 조회 (또는 특정 조건이 필요하면 파라미터 추가)
 */
export const listAllDogs = async (): Promise<Dog[]> => {
    try {
      const snap = await getDocs(collection(db, "dogs"));
      const dogs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dog[];
      return dogs;
    } catch (error) {
      console.error("🚨 모든 강아지 목록 조회 실패:", error);
      return [];
    }
  };