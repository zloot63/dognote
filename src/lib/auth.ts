import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import AppleProvider from "next-auth/providers/apple";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert, initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ✅ Firebase Admin SDK 초기화
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

// ✅ Firebase 앱이 이미 초기화되어 있는지 확인 후 초기화
const firebaseAdminApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseAdminConfig);

// ✅ Firestore 인스턴스 생성
const db = getFirestore(firebaseAdminApp);

/**
 * ✅ NextAuth 설정
 */
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],

  adapter: FirestoreAdapter(db), // ✅ Firestore Adapter 적용

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login", // ✅ 로그인 페이지 지정
    error: "/login", // ✅ 인증 오류 발생 시 이동
  },

  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === "development", // ✅ 개발 환경에서 디버그 활성화
};