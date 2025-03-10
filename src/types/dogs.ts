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
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }
  
  export interface DogUser {
    id?: string;
    dogId: string;
    userId: string;
    role: "owner" | "member";
    createdAt?: Timestamp;
  }