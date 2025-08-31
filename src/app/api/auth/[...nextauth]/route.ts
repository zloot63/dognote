import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ `session.user` 타입 확장 (NextAuth 모듈 확장)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      provider: string;
    };
  }
}

// NextAuth.js 핸들러 생성 및 내보내기
const handler = NextAuth(authOptions);

// API 라우트 핸들러 내보내기
export { handler as GET, handler as POST };
