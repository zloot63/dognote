import { db } from "@/lib/firebase";
import { collection, query, orderBy, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; // ✅ 추가
import { getCurrentWalkFromDB } from "@/lib/localStorage";
import { calculateDistance } from "@/utils/distance";
import { getGPSFromStorage, removeGPSFromStorage } from "@/lib/localStorage";
import { auth } from "@/lib/firebase";
import { Walk, WalkFromFirestore } from "@/types/walks";


/**
 * ✅ 현재 로그인한 사용자 ID 반환
 */
const getUserId = (): string | null => auth.currentUser?.uid || null;

/**
 * ✅ Firestore에 산책 기록 저장 (최초)
 */
export const startWalkInFirestore = async (dogIds: string[]): Promise<string | null> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    try {
        const walkDocRef = await addDoc(collection(db, "users", userId, "walks"), {
            dogIds,
            startTime: new Date().toISOString(),
            endTime: null,
            distance: 0,
            route: [],
        });

        return walkDocRef.id;
    } catch (error) {
        console.error("🚨 Firestore 산책 시작 저장 실패:", error);
        return null;
    }
};

/**
 * ✅ Firestore에 산책 기록 저장 (GPS 데이터 포함)
 */
export const saveWalkToFirestore = async (walk: Walk) => {
    const userId = getUserId();
    if (!userId) throw new Error("❌ 로그인한 사용자 정보가 없습니다.");

    await addDoc(collection(db, "users", userId, "walks"), walk);
};



/**
 * ✅ Firestore에 산책 경로 업데이트
 */
export const updateWalkInFirestore = async (walkId?: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const currentWalkId = walkId || (await getCurrentWalkFromDB());
    if (!currentWalkId) return;

    try {
        const allRoutes = getGPSFromStorage();
        await updateDoc(doc(db, "users", userId, "walks", currentWalkId), {
            distance: calculateDistance(allRoutes),
            route: allRoutes,
        });

        console.log("✅ Firestore 산책 데이터 업데이트 완료:", currentWalkId);
    } catch (error) {
        console.error("🚨 Firestore 업데이트 실패:", error);
    }
};

/**
 * ✅ Firestore에 산책 종료 저장 (개선된 버전)
 */
export const endWalkInFirestore = async (
    walkId: string,
    duration: number,
    distance: number,
    route: { lat: number; lng: number }[],
    issues?: string[],
    notes?: string,
    rating?: number
): Promise<Walk> => {
    const userId = getUserId();
    if (!userId) throw new Error("로그인한 사용자 정보가 없습니다.");

    try {
        const endTime = new Date().toISOString();
        const walkDocRef = doc(db, "users", userId, "walks", walkId);
        
        const updateData = {
            endTime,
            duration,
            distance,
            route,
            status: "completed" as const,
            ...(issues && { issues }),
            ...(notes && { notes }),
            ...(rating && { rating })
        };
        
        await updateDoc(walkDocRef, updateData);
        
        // 업데이트된 산책 데이터 반환
        const walkDoc = await getDoc(walkDocRef);
        if (!walkDoc.exists()) {
            throw new Error("산책 데이터를 찾을 수 없습니다.");
        }
        
        const walkData = walkDoc.data() as WalkFromFirestore;
        return {
            id: walkDoc.id,
            userId,
            dogIds: walkData.dogIds || [],
            startTime: walkData.startTime || "",
            endTime,
            duration,
            distance,
            route,
            status: "completed",
            issues,
            notes
        };
    } catch (error) {
        console.error("🚨 Firestore 산책 종료 저장 실패:", error);
        throw error;
    }
};


/**
 * ✅ Firestore에서 산책 기록 불러오기
 */
export const fetchWalksFromFirestore = async (): Promise<Walk[]> => {
    const userId = getUserId();
    if (!userId) {
        console.error("❌ 로그인한 사용자 정보가 없습니다.");
        return [];
    }

    try {
        const walksCollectionRef = collection(db, "users", userId, "walks");
        const snapshot = await getDocs(walksCollectionRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Walk[];
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

/**
 * ✅ Firestore에서 사용자의 산책 기록 가져오기 (최신순)
 */
export const getUserWalks = async (): Promise<Walk[]> => {
    const userId = getUserId();
    if (!userId) {
        console.warn("🚨 로그인한 사용자 정보가 없습니다.");
        return [];
    }

    try {
        const walksQuery = query( // ✅ query 사용
            collection(db, "users", userId, "walks"),
            orderBy("startTime", "desc") // ✅ 최신순 정렬
        );
        const snapshot = await getDocs(walksQuery);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Walk[];
    } catch (error) {
        console.error("🔥 Firestore에서 산책 기록 불러오기 실패:", error);
        return [];
    }
};

export const getWalkById = async (walkId: string): Promise<Walk | null> => {
    const userId = getUserId();
    if (!userId) return null;

    try {
        const walkRef = doc(db, "users", userId, "walks", walkId);
        const walkSnap = await getDoc(walkRef);

        if (!walkSnap.exists()) return null;

        const walkData = walkSnap.data() as WalkFromFirestore;

        return {
            id: walkSnap.id,
            userId,
            dogIds: walkData.dogIds ?? [],
            startTime: walkData.startTime ?? "",
            endTime: walkData.endTime ?? undefined,
            duration: walkData.duration ?? 0,
            distance: walkData.distance ?? 0,
            route: walkData.route ?? [],
            status: walkData.status ?? "completed",
            issues: walkData.issues ?? [],
            notes: walkData.notes ?? "",
        };
    } catch (error) {
        console.error("🚨 Firestore에서 산책 데이터 불러오기 실패:", error);
        return null;
    }
};


export const updateWalkDetails = async (walkId: string, data: Partial<Walk>) => {
    const userId = getUserId();
    if (!userId) {
        console.error("🚨 로그인한 사용자 정보가 없습니다.");
        return;
    }

    try {
        const walkRef = doc(db, "users", userId, "walks", walkId);
        await updateDoc(walkRef, data);
        console.log("✅ 산책 기록 업데이트 완료:", walkId);
    } catch (error) {
        console.error("🚨 Firestore 산책 기록 업데이트 실패:", error);
    }
};