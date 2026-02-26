import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 빌드 타임에 환경 변수가 없을 경우를 대비한 방어 코드
// 실제 런타임에서는 환경 변수가 필수이지만, 빌드 과정(정적 페이지 생성 등)에서
// 환경 변수가 주입되지 않아 발생하는 오류를 방지하기 위함
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드에서 사용할 클라이언트
export const createSupabaseServerClient = () => {
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

  return createClient(supabaseUrl, serviceRoleKey);
};
