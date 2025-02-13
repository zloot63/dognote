import { db } from "./firebase";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { getWalkFromIndexedDB, clearIndexedDB } from "./indexedDB";

export const db = getFirestore();

/**
 * ✅ 현재 로그인한 사용자 ID 반환
 */
const getUserId = (): string | null => auth.currentUser?.uid || null;

/**
 * ✅ Firestore에 사용자 정보 저장 (최초 로그인 시)
 */
export const saveUserToFirestore = async (user: { uid: string; email: string; displayName?: string; photoURL?: string }) => {
    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
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
export const fetchDogsFromFirestore = async (): Promise<any[]> => {
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

/**
 * ✅ Firestore에 강아지 정보 저장
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
 * ✅ Firestore에서 특정 강아지 정보 삭제
 */
export const deleteDogFromFirestore = async (dogId: string) => {
    const userId = getUserId();
    if (!userId) {
        console.error("❌ 로그인한 사용자 정보가 없습니다.");
        return;
    }

    try {
        const dogRef = doc(db, "users", userId, "dogs", dogId);
        await deleteDoc(dogRef);
        console.log("✅ 강아지 정보 삭제 완료:", dogId);
    } catch (error) {
        console.error("🔥 강아지 정보 삭제 실패:", error);
    }
};

/**
 * ✅ Firestore에 산책 기록 저장 (GPS 데이터 포함)
 */
export const saveWalkToFirestore = async (walk: {
    dogIds: string[];
    startTime: string;
    endTime?: string;
    duration?: number;
    distance?: number;
    route?: { lat: number; lng: number }[];
    status: "active" | "completed";
    issues?: string[];
    notes?: string;
}) => {
    const userId = getUserId();
    if (!userId) {
        console.error("❌ 로그인한 사용자 정보가 없습니다.");
        return;
    }

    try {
        const walksCollectionRef = collection(db, "users", userId, "walks");
        await addDoc(walksCollectionRef, { ...walk });
        console.log("✅ 산책 기록 저장 완료:", walk);
    } catch (error) {
        console.error("🔥 산책 기록 저장 실패:", error);
    }
};

/**
 * ✅ Firestore에서 산책 기록 불러오기
 */
export const fetchWalksFromFirestore = async (): Promise<any[]> => {
    const userId = getUserId();
    if (!userId) {
        console.error("❌ 로그인한 사용자 정보가 없습니다.");
        return [];
    }

    try {
        const walksCollectionRef = collection(db, "users", userId, "walks");
        const snapshot = await getDocs(walksCollectionRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("🔥 산책 기록 불러오기 실패:", error);
        return [];
    }
};

/**
 * ✅ Firestore에서 특정 산책 기록 삭제 (산책 취소 기능)
 */
export const deleteWalkFromFirestore = async (walkId: string) => {
    const userId = getUserId();
    if (!userId) {
        console.error("❌ 로그인한 사용자 정보가 없습니다.");
        return;
    }

    try {
        const walkRef = doc(db, "users", userId, "walks", walkId);
        await deleteDoc(walkRef);
        console.log("✅ 산책 기록 삭제 완료:", walkId);
    } catch (error) {
        console.error("🔥 산책 기록 삭제 실패:", error);
    }
};

let walkDocRef = null; // ✅ Firestore 문서 참조 저장

// ✅ Firestore에 최초 저장
export const startWalkInFirestore = async (userId: string, dogIds: string[]) => {
  try {
    walkDocRef = await addDoc(collection(db, "walks"), {
      userId,
      dogIds,
      startTime: new Date().toISOString(),
      endTime: null,
      distance: 0,
      route: [],
    });
  } catch (error) {
    console.error("🚨 Firestore 산책 시작 저장 실패:", error);
  }
};

// ✅ Firestore에 5분마다 업데이트
export const updateWalkInFirestore = async () => {
  if (!walkDocRef) return;

  try {
    const allRoutes = await getWalkFromIndexedDB();
    const filteredRoute = allRoutes.filter((_, index) => index % 3 === 0); // ✅ 데이터 압축

    await updateDoc(walkDocRef, {
      endTime: allRoutes[allRoutes.length - 1].timestamp,
      distance: calculateDistance(allRoutes),
      route: filteredRoute,
    });
  } catch (error) {
    console.error("🚨 Firestore 업데이트 실패:", error);
  }
};

// ✅ 산책 종료 후 최종 저장
export const endWalkInFirestore = async () => {
  if (!walkDocRef) return;

  try {
    const allRoutes = await getWalkFromIndexedDB();
    const filteredRoute = allRoutes.filter((_, index) => index % 3 === 0);

    await updateDoc(walkDocRef, {
      endTime: new Date().toISOString(),
      distance: calculateDistance(allRoutes),
      route: filteredRoute,
    });

    await clearIndexedDB(); // ✅ IndexedDB 데이터 삭제
    walkDocRef = null; // ✅ Firestore 문서 참조 초기화
  } catch (error) {
    console.error("🚨 Firestore 산책 종료 저장 실패:", error);
  }
}