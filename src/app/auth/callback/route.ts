import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Cloudflare Pages 환경에서는 request.headers.get('x-forwarded-host')를 사용할 수 없을 수 있음
      // origin을 우선적으로 사용하고, 필요한 경우 환경 변수 등으로 호스트를 설정하는 것이 좋음

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 시 로그인 페이지로 리디렉션
  return NextResponse.redirect(`${origin}/auth/signin`);
}
