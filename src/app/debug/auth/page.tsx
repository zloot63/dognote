'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Container, Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

const AuthDebugPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseAuthLoading, setFirebaseAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setFirebaseAuthLoading(false);
      console.log('Firebase Auth State Changed:', user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log('Firebase 로그아웃 완료');
    } catch (error) {
      console.error('Firebase 로그아웃 실패:', error);
    }
  };

  const handleGetIdToken = async () => {
    if (firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        console.log('Firebase ID Token:', token);
        alert('토큰이 콘솔에 출력되었습니다.');
      } catch (error) {
        console.error('토큰 가져오기 실패:', error);
      }
    }
  };

  return (
    <Container className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">인증 상태 디버깅</h1>
        <p className="text-muted-foreground">
          NextAuth.js와 Firebase Auth의 상태를 확인합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* NextAuth.js 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>NextAuth.js 세션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>상태:</strong> {status}
            </div>
            
            {session ? (
              <div className="space-y-2">
                <div>
                  <strong>사용자 ID:</strong> {session.user?.id || 'N/A'}
                </div>
                <div>
                  <strong>이메일:</strong> {session.user?.email || 'N/A'}
                </div>
                <div>
                  <strong>이름:</strong> {session.user?.name || 'N/A'}
                </div>
                <div>
                  <strong>프로바이더:</strong> {session.user?.provider || 'N/A'}
                </div>
                <div>
                  <strong>액세스 토큰:</strong> 
                  <span className="text-xs font-mono break-all">
                    {session.user?.accessToken ? '토큰 있음' : '토큰 없음'}
                  </span>
                </div>
              </div>
            ) : (
              <div>로그인되지 않음</div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/auth/signin'}
                disabled={status === 'loading'}
              >
                NextAuth 로그인
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/api/auth/signout'}
                disabled={!session}
              >
                NextAuth 로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Firebase Auth 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Auth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>로딩:</strong> {firebaseAuthLoading ? 'Yes' : 'No'}
            </div>
            
            {firebaseUser ? (
              <div className="space-y-2">
                <div>
                  <strong>사용자 ID:</strong> {firebaseUser.uid}
                </div>
                <div>
                  <strong>이메일:</strong> {firebaseUser.email || 'N/A'}
                </div>
                <div>
                  <strong>이름:</strong> {firebaseUser.displayName || 'N/A'}
                </div>
                <div>
                  <strong>이메일 인증:</strong> {firebaseUser.emailVerified ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>프로바이더:</strong> 
                  {firebaseUser.providerData.map(p => p.providerId).join(', ')}
                </div>
              </div>
            ) : (
              <div>Firebase에 로그인되지 않음</div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={handleGetIdToken}
                disabled={!firebaseUser}
              >
                ID 토큰 확인
              </Button>
              <Button 
                variant="outline"
                onClick={handleSignOut}
                disabled={!firebaseUser}
              >
                Firebase 로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 환경 변수 확인 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>환경 변수 확인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div>
              <strong>Firebase API Key:</strong> 
              {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '설정됨' : '설정되지 않음'}
            </div>
            <div>
              <strong>Firebase Auth Domain:</strong> 
              {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '설정됨' : '설정되지 않음'}
            </div>
            <div>
              <strong>Firebase Project ID:</strong> 
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '설정됨' : '설정되지 않음'}
            </div>
            <div>
              <strong>NextAuth URL:</strong> 
              {process.env.NEXTAUTH_URL || 'http://localhost:3000'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 테스트 버튼들 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>테스트 액션</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => window.location.href = '/dogs'}>
              강아지 관리 페이지
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dogs/test'}>
              컴포넌트 테스트 페이지
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>콘솔을 열어서 상세한 로그를 확인하세요.</p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AuthDebugPage;
