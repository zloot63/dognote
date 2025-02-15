export interface Walk {
    id: string;
    userId: string;
    dogIds: string[];
    startTime: string;
    endTime?: string;
    duration?: number;
    distance?: number;
    route?: { lat: number; lng: number }[];
    status: "active" | "completed";
    issues?: string[];
    notes?: string;
}


export interface WalkFromFirestore {
    id: string;
    userId: string;
    dogIds?: string[];  // ✅ Firestore 데이터가 없는 경우도 대비
    startTime?: string;
    endTime?: string | null;
    duration?: number;
    distance?: number;
    route?: { lat: number; lng: number }[];
    status?: "active" | "completed";  // ✅ 기본값을 적용할 수 있음
    issues?: string[];
    notes?: string;
}