import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { calculateDistance } from "@/utils/distance";
import { Dog } from "@/types/dogs";
import {
    saveWalkIdToStorage,
    getWalkIdFromStorage,
    removeWalkIdFromStorage,
    getGPSFromStorage,
    removeGPSFromStorage
} from "@/lib/localStorage"; // ✅ LocalStorage 사용

/**
 * ✅ 현재 로그인한 사용자 ID 반환
 */
const getUserId = (): string | null => auth.currentUser?.uid || null;

/**
 * ✅ Firestore에 사용자 정보 저장 (최초 로그인 시)
 */
export const saveUserToFirestore = async (user: { uid: string; email: string; displayName?: string; photoURL?: string }) => {
    try {
        if (!user.uid) throw new Error("🚨 사용자 UID가 없습니다.");

        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
        }, { merge: true });

        console.log("✅ 사용자 정보 Firestore에 저장 완료:", user);
    } catch (error) {
        console.error("🔥 사용자 정보 저장 실패:", error);
    }
};

/**
 * ✅ Firestore에서 강아지 정보 불러오기
 */
export const fetchDogsFromFirestore = async (): Promise<Dog[]> => {
    const userId = getUserId();
    if (!userId) {
        console.warn("🚨 로그인한 사용자 정보가 없습니다. 강아지 데이터를 불러오지 않습니다.");
        return [];
    }

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
    const userId = getUserId();
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
    const userId = getUserId();
    if (!userId) return;

    try {
        await deleteDoc(doc(db, "users", userId, "dogs", dogId));
    } catch (error) {
        console.error("🔥 강아지 정보 삭제 실패:", error);
    }
};

/**
 * ✅ Firestore에 산책 기록 저장 (최초)
 */
export const startWalkInFirestore = async (dogIds: string[]): Promise<string | null> => {
    const userId = getUserId();
    if (!userId) return null;

    try {
        const walkDocRef = await addDoc(collection(db, "users", userId, "walks"), {
            dogIds,
            startTime: new Date().toISOString(),
            endTime: null, // ✅ 종료되지 않은 상태
            distance: 0,
            route: [],
        });

        saveWalkIdToStorage(walkDocRef.id); // ✅ LocalStorage에 walkId 저장
        return walkDocRef.id;
    } catch (error) {
        console.error("🚨 Firestore 산책 시작 저장 실패:", error);
        return null;
    }
};

/**
 * ✅ Firestore에 산책 종료 저장
 */
export const endWalkInFirestore = async (walkId?: string) => {
    const userId = getUserId();
    if (!userId) return;

    const currentWalkId = walkId || getWalkIdFromStorage();
    if (!currentWalkId) {
        console.error("🚨 산책 ID가 없습니다.");
        return;
    }

    try {
        const allRoutes = getGPSFromStorage(); // ✅ LocalStorage에서 GPS 데이터 가져오기
        const filteredRoute = allRoutes.filter((_, index) => index % 3 === 0);

        await updateDoc(doc(db, "users", userId, "walks", currentWalkId), {
            endTime: new Date().toISOString(), // ✅ 종료 시간 저장
            distance: calculateDistance(allRoutes),
            route: filteredRoute,
        });

        removeGPSFromStorage(); // ✅ LocalStorage에서 GPS 데이터 삭제
        removeWalkIdFromStorage(); // ✅ LocalStorage에서 walkId 삭제

        console.log("✅ Firestore 산책 종료 저장 완료:", currentWalkId);
    } catch (error) {
        console.error("🚨 Firestore 산책 종료 저장 실패:", error);
    }
};
