export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    dogs: string[]; // 사용자가 등록한 강아지 ID 목록
}
