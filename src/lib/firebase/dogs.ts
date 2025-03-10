// lib/firebase/dogs.ts
import { db } from '@/lib/firebase/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Dog } from '@/types/dogs';

const dogsCollection = collection(db, 'dogs');

// 강아지 등록
export const createDog = async (dog: Omit<Dog, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  try {
    const dogRef = await addDoc(collection(db, 'dogs'), {
      ...dog,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return dogRef.id;
  } catch (error) {
    console.error('🚨 강아지 등록 실패:', error);
    return null;
  }
};

// 강아지 정보 조회
export const getDogById = async (dogId: string): Promise<Dog | null> => {
  try {
    const dogDoc = await getDoc(doc(db, 'dogs', dogId));
    if (!dogDoc.exists()) return null;

    return { id: dogDoc.id, ...dogDoc.data() } as Dog;
  } catch (error) {
    console.error('🚨 강아지 조회 실패:', error);
    return null;
  }
};

// 강아지 정보 업데이트
export const updateDog = async (dogId: string, data: Partial<Omit<Dog, 'id' | 'createdAt'>>): Promise<void> => {
  await updateDoc(doc(db, 'dogs', dogId), { ...data, updatedAt: new Date() });
};

// 강아지 삭제 (구성원 여부 체크 로직은 추후 추가 예정)
export const deleteDog = async (dogId: string): Promise<void> => {
  await deleteDoc(doc(db, 'dogs', dogId));
};
