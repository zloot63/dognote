import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * NextAuth 세션과 Firebase Auth를 연동하는 커스텀 훅
 * NextAuth로 로그인한 사용자를 Firebase Auth에도 인증시켜
 * Firestore Security Rules가 정상적으로 작동하도록 합니다.
 */
export const useFirebaseAuth = () => {
  const { data: session, status } = useSession();
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticateWithFirebase = async () => {
      if (status === 'loading') {
        return;
      }

      if (!session?.user?.id) {
        // NextAuth 세션이 없으면 Firebase에서도 로그아웃
        if (auth.currentUser) {
          await firebaseSignOut(auth);
        }
        setIsFirebaseAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // NextAuth 세션이 있으면 Firebase Custom Token을 생성하여 인증
        const response = await fetch('/api/auth/firebase-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: session.user.id,
            email: session.user.email,
            name: session.user.name,
          }),
        });

        if (!response.ok) {
          throw new Error('Firebase 토큰 생성 실패');
        }

        const { customToken } = await response.json();
        
        // Firebase Auth에 커스텀 토큰으로 로그인
        await signInWithCustomToken(auth, customToken);
        setIsFirebaseAuthenticated(true);
        console.log('✅ Firebase Auth 연동 성공');
      } catch (error) {
        console.error('❌ Firebase Auth 연동 실패:', error);
        setIsFirebaseAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    authenticateWithFirebase();
  }, [session, status]);

  return {
    isFirebaseAuthenticated,
    isLoading,
    session,
    status,
  };
};
