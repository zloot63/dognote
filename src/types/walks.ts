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
