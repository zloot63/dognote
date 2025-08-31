/**
 * Firebase 인증 관련 유틸리티 함수
 */

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { firebaseApp } from '../firebase';

const auth = getAuth(firebaseApp);

/**
 * 이메일/비밀번호로 로그인
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(`로그인 실패: ${error.message}`);
  }
};

/**
 * 이메일/비밀번호로 회원가입
 */
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 사용자 프로필 업데이트
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    
    return userCredential.user;
  } catch (error: any) {
    throw new Error(`회원가입 실패: ${error.message}`);
  }
};

/**
 * 로그아웃
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(`로그아웃 실패: ${error.message}`);
  }
};

/**
 * 현재 인증된 사용자 가져오기
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * 인증 상태 변경 리스너 설정
 */
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(callback);
};

export { auth };
