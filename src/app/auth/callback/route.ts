import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    // 서버용 Supabase 클라이언트 생성 (쿠키 처리 포함)
    const supabase = await createClient();

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}/auth/error?error=Verification`);
      }
    } catch (err) {
      console.error('Unexpected error in callback route:', err);
      return NextResponse.redirect(`${origin}/auth/error?error=Default`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // 코드가 없는 경우
  return NextResponse.redirect(`${origin}/auth/signin`);
}
