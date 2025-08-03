import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { JWT } from "next-auth/jwt";
import { Account, Session } from "next-auth";

// ✅ 환경 변수 체크 (DogNote 프로젝트용)
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
} = process.env;

// 필수 환경 변수 검증
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !NEXTAUTH_SECRET) {
  throw new Error("🚨 OAuth 관련 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요!");
}

// Firebase Admin 환경 변수 검증 (현재 NEXT_PUBLIC_ 접두사 사용)
if (!NEXT_PUBLIC_FIREBASE_PROJECT_ID || !NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || !NEXT_PUBLIC_FIREBASE_PRIVATE_KEY) {
  throw new Error("🚨 Firebase Admin 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요!");
}

// 참고: 보안을 위해 허용된 서버 환경에서는 NEXT_PUBLIC_ 접두사를 사용하지 않는 것이 좋습니다.

// Firebase Admin 설정
const firebaseAdminConfig = {
  projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  privateKey: NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// 디버깅용 로그
console.log("Firebase Admin Config 검증:", {
  projectIdExists: !!firebaseAdminConfig.projectId,
  clientEmailExists: !!firebaseAdminConfig.clientEmail,
  privateKeyExists: !!firebaseAdminConfig.privateKey,
});

// ✅ `session.user` 타입 확장 (NextAuth 모듈 확장)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken: string;
      provider: string;
    };
  }
}

// NextAuth.js 옵션 설정
export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: firebaseAdminConfig.projectId,
      clientEmail: firebaseAdminConfig.clientEmail,
      privateKey: firebaseAdminConfig.privateKey,
    }),
  }),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7일
  },
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      // 첫 로그인 시 사용자 정보를 토큰에 저장
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      
      // OAuth provider 정보 저장
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // 세션에 사용자 정보 추가
      if (token) {
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.provider = token.provider as string;
        session.user.accessToken = token.accessToken as string;
      }
      
      return session;
    },
  },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === 'development',
};

// NextAuth.js 핸들러 생성 및 내보내기
const handler = NextAuth(authOptions);

// API 라우트 핸들러 내보내기
export { handler as GET, handler as POST };
