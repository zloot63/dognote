import { Timestamp, FieldValue } from "firebase/firestore";

/**
 * 읽기 시점: Firestore에서 문서를 가져올 때
 */
export interface Schedule {
  id: string;
  dogId: string;
  userId: string;
  type: string;
  title?: string;
  description?: string;
  scheduledAt: Timestamp; // 실제 Timestamp
  completed: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * 쓰기 시점: Firestore에 문서를 저장할 때
 */
export interface ScheduleWrite {
  dogId: string;
  userId: string;
  type: string;
  title?: string;
  description?: string;
  scheduledAt: FieldValue | Timestamp; // serverTimestamp() or Timestamp
  completed: boolean;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
}
