import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        'Supabase environment variables are missing in callback route'
      );
      // 환경 변수가 없을 때 에러 페이지로 리다이렉트
      return NextResponse.redirect(`${origin}/auth/error?error=Configuration`);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
