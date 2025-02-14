import { db, collection, doc, getDocs, addDoc, deleteDoc } from "./firestore";
import { auth } from "@/lib/firebase";
import { Dog } from "@/types/dogs";

/**
 * ✅ Firestore에서 강아지 정보 불러오기
 */
export const fetchDogsFromFirestore = async (): Promise<Dog[]> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    try {
        const snapshot = await getDocs(collection(db, "users", userId, "dogs"));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Dog[];
    } catch (error) {
        console.error("🔥 강아지 정보 불러오기 실패:", error);
        return [];
    }
};

/**
 * ✅ Firestore에 강아지 정보 저장
 */
export const saveDogToFirestore = async (dog: Dog) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
        await addDoc(collection(db, "users", userId, "dogs"), {
            ...dog,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("🔥 강아지 정보 저장 실패:", error);
    }
};

/**
 * ✅ Firestore에서 특정 강아지 정보 삭제
 */
export const deleteDogFromFirestore = async (dogId: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
        await deleteDoc(doc(db, "users", userId, "dogs", dogId));
    } catch (error) {
        console.error("🔥 강아지 정보 삭제 실패:", error);
    }
};
