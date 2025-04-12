import { db } from "@/lib/firebase"; // ✅ Firebase 초기화
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { Dog } from "@/types/dogs";

/**
 * ✅ 강아지 등록 (Create)
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

/**
 * ✅ 특정 강아지 정보 조회 (Read)
 */
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

/**
 * ✅ 강아지 정보 업데이트 (Update)
 */
export const updateDog = async (
  dogId: string,
  data: Partial<Omit<Dog, "id" | "createdAt">>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "dogs", dogId), { ...data, updatedAt: new Date() });
  } catch (error) {
    console.error("🚨 강아지 정보 업데이트 실패:", error);
    throw error;
  }
};

/**
 * ✅ 강아지 삭제 (Delete)
 */
export const deleteDog = async (dogId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "dogs", dogId));
  } catch (error) {
    console.error("🚨 강아지 삭제 실패:", error);
    throw error;
  }
};

/**
 * ✅ 특정 사용자의 강아지 목록 조회 (Read)
 */
export const listUserDogs = async (userId: string): Promise<Dog[]> => {
  try {
    const q = query(collection(db, "dogs"), where("ownerId", "==", userId));
    const snap = await getDocs(q);
    
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Dog[];
  } catch (error) {
    console.error("🚨 사용자 강아지 목록 조회 실패:", error);
    return [];
  }
};

/**
 * ✅ 모든 강아지 목록 조회 (관리자용)
 */
export const listAllDogs = async (): Promise<Dog[]> => {
  try {
    const snap = await getDocs(collection(db, "dogs"));
    
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Dog[];
  } catch (error) {
    console.error("🚨 모든 강아지 목록 조회 실패:", error);
    return [];
  }
};
