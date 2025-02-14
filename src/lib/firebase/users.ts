import { db, doc, setDoc } from "./firestore";
// import { auth } from "@/lib/firebase";

/**
 * ✅ Firestore에 사용자 정보 저장
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
