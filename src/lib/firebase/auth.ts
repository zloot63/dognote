import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { saveUserToFirestore } from "@/lib/firebase/users"; // Firestore에 사용자 정보 저장

// ✅ 구글 로그인
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await saveUserToFirestore(user); // ✅ Firestore에 사용자 정보 저장
        return user;
    } catch (error) {
        console.error("🚨 구글 로그인 실패:", error);
        throw error;
    }
};

// ✅ 로그아웃
export const handleLogout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("🚨 로그아웃 실패:", error);
    }
};


// ✅ 카카오, 네이버, 애플 로그인 추가 예정 (OAuth 방식)
export const signInWithKakao = async () => {
    // 카카오 로그인 로직 추가 예정
};

export const signInWithNaver = async () => {
    // 네이버 로그인 로직 추가 예정
};

export const signInWithApple = async () => {
    // 애플 로그인 로직 추가 예정
};

// ✅ 이메일 로그인
// export const signInWithEmail = async (email: string, password: string) => {
// 이메일 로그인 로직 추가 예정
//};
