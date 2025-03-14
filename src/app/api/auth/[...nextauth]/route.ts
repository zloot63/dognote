import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { JWT } from "next-auth/jwt";
import { Account, Profile, Session } from "next-auth";

// ✅ 환경 변수 체크 (보안 키는 서버 전용, NEXT_PUBLIC_X 제거)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID!;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !NEXTAUTH_SECRET) {
  throw new Error("🚨 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요!");
}

// ✅ NextAuth 설정
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
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.profile) {
        session.user = {
          ...session.user,
          id: token.sub!,
          profile: token.profile,
        };
      }
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
