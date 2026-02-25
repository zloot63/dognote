export interface Walk {
  id: string;
  userId: string;
  dogIds: string[];
  startTime: string;
  endTime?: string;
  duration?: number;
  distance?: number;
  route?: { lat: number; lng: number }[];
  status: 'active' | 'completed';
  issues?: string[];
  notes?: string;
  mood?: string;
  condition?: string;
}

// Legacy type alias - can be removed when walks are fully migrated to Supabase
export type WalkFromDB = Walk;
