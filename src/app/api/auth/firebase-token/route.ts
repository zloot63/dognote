import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import admin from 'firebase-admin';

// Firebase Admin SDK 초기화 (이미 초기화된 경우 재사용)
if (!admin.apps.length) {
  const {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
  } = process.env;

  if (!NEXT_PUBLIC_FIREBASE_PROJECT_ID || !NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || !NEXT_PUBLIC_FIREBASE_PRIVATE_KEY) {
    throw new Error('Firebase Admin 환경 변수가 설정되지 않았습니다.');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export async function POST(request: NextRequest) {
  try {
    // NextAuth 세션 확인
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const { uid, email, name } = await request.json();

    // 세션의 사용자 ID와 요청의 UID가 일치하는지 확인
    if (session.user.id !== uid) {
      return NextResponse.json(
        { error: '사용자 ID가 일치하지 않습니다.' },
        { status: 403 }
      );
    }

    // Firebase Custom Token 생성
    const customToken = await admin.auth().createCustomToken(uid, {
      email,
      name,
      provider: 'nextauth',
    });

    return NextResponse.json({ customToken });
  } catch (error) {
    console.error('Firebase Custom Token 생성 오류:', error);
    return NextResponse.json(
      { error: 'Firebase 토큰 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
