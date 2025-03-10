import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, getDocs, query, where } from "firebase/firestore";
import { User } from "@/types/users";

// 특정 이메일로 사용자 찾기
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docSnap = snap.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as User;
  } catch (error) {
    console.error("🔥 getUserByEmail 실패:", error);
    return null;
  }
};

// 특정 userId로 사용자 정보 가져오기
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = doc(db, "users", userId);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as User;
  } catch (error) {
    console.error("🔥 getUserById 실패:", error);
    return null;
  }
};

// 사용자 생성 or 업데이트 (OAuth 로그인 시)
export const upsertUser = async (user: User) => {
  if (!user.id) return;
  const userDoc = doc(db, "users", user.id);
  await setDoc(userDoc, {
    ...user,
    updatedAt: new Date(),
  }, { merge: true });
};