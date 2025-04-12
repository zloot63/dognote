import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { JWT } from "next-auth/jwt";
import { Account, Profile, Session } from "next-auth";

// ✅ 환경 변수 체크 (보안 키는 서버 전용, NEXT_PUBLIC_X 제거)
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET || !NEXTAUTH_SECRET) {
  throw new Error("🚨 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요!");
}

// ✅ `session.user` 타입 확장 (NextAuth 모듈 확장)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    NaverProvider({
      clientId: NAVER_CLIENT_ID,
      clientSecret: NAVER_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: KAKAO_CLIENT_ID,
      clientSecret: KAKAO_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: JWT; account?: Account | null; profile?: Profile }) {
      if (account) {
        token.accessToken = account.access_token || ""; // 🚨 undefined 방지
      }
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.sub || "", // ✅ 타입 안정성 확보
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        accessToken: token.accessToken as string, // ✅ 타입 안정성 추가
      };
      return session;
    },
  },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

// ✅ NextAuth 핸들러
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
