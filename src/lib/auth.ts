import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";

// Firebase Admin 설정
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert(firebaseAdminConfig),
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Apple OAuth는 추후 추가 예정
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7일
  },
  callbacks: {
    async jwt({ token, user, account }) {
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
      }
      
      return token;
    },
    async session({ session, token }) {
      // 세션에 사용자 정보 추가
      if (token) {
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.provider = token.provider as string;
      }
      
      return session;
    },
    async signIn({ user, account }) {
      // 로그인 성공 시 추가 처리 로직
      console.log("User signed in:", { user: user.email, provider: account?.provider });
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 로그인 후 리다이렉트 처리
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};
