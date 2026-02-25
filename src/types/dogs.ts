export interface Dog {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  birthDate?: string;
  gender?: 'male' | 'female';
  weight?: number;
  profileImage?: string;
  registrationNumber?: string;
  ownerId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DogUser {
  id?: string;
  dogId: string;
  userId: string;
  role: 'owner' | 'member';
  createdAt?: string | Date;
}
