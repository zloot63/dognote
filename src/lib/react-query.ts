import { QueryClient } from "@tanstack/react-query";

// ✅ 전역적으로 사용할 QueryClient 인스턴스
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5분 동안 데이터 유지 (이전 요청 시 캐시된 데이터 사용)
            refetchOnWindowFocus: false, // 창이 포커스될 때 자동 리패치 방지
            refetchOnReconnect: true, // 네트워크 재연결 시 자동으로 다시 요청
            refetchOnMount: false, // 컴포넌트 마운트 시 자동 리패치 방지
            retry: 2, // 요청 실패 시 최대 2번 재시도
        },
    },
});

export default queryClient;
