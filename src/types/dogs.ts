import { Timestamp } from "firebase/firestore";
export interface Dog {
  id: string;
  name: string;
  breed?: string;
  birthDate?: string;
  gender?: "male" | "female";
  weight?: number;
  profileImage?: string;
  registrationNumber?: string;
  ownerId?: string;
  createdAt?: Timestamp | Date; // ✅ Firestore Timestamp 또는 JavaScript Date 지원
  updatedAt?: Timestamp | Date; // ✅ 동일하게 처리
}

export interface DogUser {
  id?: string;
  dogId: string;
  userId: string;
  role: "owner" | "member";
  createdAt?: Timestamp | Date; // ✅ 동일하게 처리
}
