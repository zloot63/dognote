import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { DogUser } from "@/types/dogs";

/**
 * 강아지에 사용자 추가 (공유하기)
 */
export const addUserToDog = async (
  dogId: string,
  userId: string,
  role: "owner" | "member" = "member"
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, "dog_users"), {
      dogId,
      userId,
      role,
      createdAt: serverTimestamp(),
    });

    console.log("✅ 강아지 사용자 추가 완료:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("🚨 강아지에 사용자 추가 실패:", error);
    return null;
  }
};

/**
 * 강아지에서 사용자 제거
 */
export const removeUserFromDog = async (dogId: string, userId: string) => {
  try {
    const dogUsersQuery = query(
      collection(db, "dog_users"),
      where("dogId", "==", dogId),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(dogUsersQuery);

    snapshot.forEach(async (dogUserDoc) => {
      await deleteDoc(dogUserDoc.ref);
      console.log(`✅ 사용자(${userId}) 강아지(${dogId})에서 삭제 완료.`);
    });
  } catch (error) {
    console.error("🚨 강아지에서 사용자 삭제 실패:", error);
  }
};

/**
 * 특정 강아지의 사용자 목록 조회
 */
export const getUsersByDog = async (dogId: string): Promise<DogUser[]> => {
  try {
    const qDogUsers = query(
      collection(db, "dog_users"),
      where("dogId", "==", dogId)
    );
    const snap = await getDocs(qDogUsers);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as DogUser[];
  } catch (error) {
    console.error("🚨 강아지 사용자 목록 조회 실패:", error);
    return [];
  }
};

/**
 * 사용자가 접근 가능한 강아지 목록
 */
export const getDogsByUser = async (userId: string): Promise<string[]> => {
  try {
    const qDogUsers = query(
      collection(db, "dog_users"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(qDogUsers);

    return snap.docs.map((doc) => {
      const data = doc.data() as DogUser;
      return data.dogId;
    });
  } catch (error) {
    console.error("🚨 사용자별 강아지 목록 조회 실패:", error);
    return [];
  }
};