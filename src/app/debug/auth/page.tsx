'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuthSupabase';
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/components/ui';

const AuthDebugPage: React.FC = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();

  return (
    <Container className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">인증 상태 디버깅</h1>
        <p className="text-muted-foreground">
          Supabase Auth의 상태를 확인합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Supabase Auth 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Auth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>로딩:</strong> {loading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>인증 상태:</strong>{' '}
              {isAuthenticated ? '로그인됨' : '로그인되지 않음'}
            </div>

            {user ? (
              <div className="space-y-2">
                <div>
                  <strong>사용자 ID:</strong> {user.id}
                </div>
                <div>
                  <strong>이메일:</strong> {user.email || 'N/A'}
                </div>
                <div>
                  <strong>이름:</strong> {user.name || 'N/A'}
                </div>
                <div>
                  <strong>프로바이더:</strong> {user.provider || 'N/A'}
                </div>
              </div>
            ) : (
              <div>로그인되지 않음</div>
            )}

            <div className="space-y-2">
              <Button
                onClick={() => (window.location.href = '/auth/signin')}
                disabled={loading}
              >
                로그인
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                disabled={!isAuthenticated}
              >
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 환경 변수 확인 */}
        <Card>
          <CardHeader>
            <CardTitle>환경 변수 확인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div>
                <strong>Supabase URL:</strong>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_URL
                  ? '설정됨'
                  : '설정되지 않음'}
              </div>
              <div>
                <strong>Supabase Anon Key:</strong>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? '설정됨'
                  : '설정되지 않음'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 테스트 버튼들 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>테스트 액션</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => (window.location.href = '/dogs')}>
              강아지 관리 페이지
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/dogs/test')}
            >
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
