export interface Schedule {
    id: string;
    type: "예방접종" | "미용" | "건강검진" | "기타"; // 📌 일정 타입
    date: string; // YYYY-MM-DD 형식
    notes?: string; // 추가 메모 (선택)
}
