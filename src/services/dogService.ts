import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Dog, DogFormData } from '@/types/dog';

const DOGS_COLLECTION = 'dogs';
const STORAGE_PATH = 'dog-profiles';

export class DogService {
  // 이미지 업로드
  static async uploadProfileImage(file: File, dogId?: string): Promise<string> {
    try {
      const fileName = `${dogId || Date.now()}-${file.name}`;
      const imageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  }

  // 이미지 삭제
  static async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      // 이미지 삭제 실패는 치명적이지 않으므로 에러를 던지지 않음
    }
  }

  // 강아지 등록
  static async createDog(userId: string, dogData: DogFormData): Promise<Dog> {
    try {
      const now = new Date().toISOString();
      
      // 이미지 업로드 처리
      let profileImageUrl: string | undefined;
      if (dogData.profileImage && dogData.profileImage instanceof File) {
        profileImageUrl = await this.uploadProfileImage(dogData.profileImage);
      } else if (typeof dogData.profileImage === 'string') {
        profileImageUrl = dogData.profileImage;
      }

      const newDog = {
        userId,
        name: dogData.name,
        breed: dogData.breed,
        gender: dogData.gender,
        birthDate: dogData.birthDate,
        weight: dogData.weight,
        profileImage: profileImageUrl,
        description: dogData.description,
        isNeutered: dogData.isNeutered,
        microchipId: dogData.microchipId,
        registrationNumber: dogData.registrationNumber,
        color: dogData.color,
        size: dogData.size,
        activityLevel: dogData.activityLevel,
        temperament: dogData.temperament,
        allergies: dogData.allergies,
        medicalConditions: dogData.medicalConditions,
        emergencyContact: dogData.emergencyContact,
        veterinarian: dogData.veterinarian,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, DOGS_COLLECTION), newDog);
      
      return {
        id: docRef.id,
        ...newDog
      } as Dog;
    } catch (error) {
      console.error('강아지 등록 실패:', error);
      throw new Error('강아지 등록에 실패했습니다.');
    }
  }

  // 강아지 수정
  static async updateDog(dogId: string, dogData: Partial<DogFormData>): Promise<Dog> {
    try {
      const dogRef = doc(db, DOGS_COLLECTION, dogId);
      
      // 기존 데이터 가져오기
      const dogDoc = await getDoc(dogRef);
      if (!dogDoc.exists()) {
        throw new Error('강아지를 찾을 수 없습니다.');
      }
      
      const existingDog = { id: dogDoc.id, ...dogDoc.data() } as Dog;
      
      // 이미지 업로드 처리
      let profileImageUrl = existingDog.profileImage;
      if (dogData.profileImage && dogData.profileImage instanceof File) {
        // 기존 이미지 삭제
        if (existingDog.profileImage) {
          await this.deleteProfileImage(existingDog.profileImage);
        }
        // 새 이미지 업로드
        profileImageUrl = await this.uploadProfileImage(dogData.profileImage, dogId);
      } else if (typeof dogData.profileImage === 'string') {
        profileImageUrl = dogData.profileImage;
      }

      const updateData = {
        ...dogData,
        profileImage: profileImageUrl,
        updatedAt: new Date().toISOString()
      };

      // undefined 값 제거
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(dogRef, updateData);
      
      return {
        ...existingDog,
        ...updateData
      } as Dog;
    } catch (error) {
      console.error('강아지 수정 실패:', error);
      throw new Error('강아지 정보 수정에 실패했습니다.');
    }
  }

  // 강아지 삭제
  static async deleteDog(dogId: string): Promise<void> {
    try {
      const dogRef = doc(db, DOGS_COLLECTION, dogId);
      
      // 기존 데이터 가져와서 이미지 삭제
      const dogDoc = await getDoc(dogRef);
      if (dogDoc.exists()) {
        const dogData = dogDoc.data() as Dog;
        if (dogData.profileImage) {
          await this.deleteProfileImage(dogData.profileImage);
        }
      }
      
      await deleteDoc(dogRef);
    } catch (error) {
      console.error('강아지 삭제 실패:', error);
      throw new Error('강아지 삭제에 실패했습니다.');
    }
  }

  // 사용자의 강아지 목록 조회
  static async getDogsByUserId(userId: string): Promise<Dog[]> {
    try {
      const q = query(
        collection(db, DOGS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const dogs: Dog[] = [];
      
      querySnapshot.forEach((doc) => {
        dogs.push({
          id: doc.id,
          ...doc.data()
        } as Dog);
      });
      
      return dogs;
    } catch (error) {
      console.error('강아지 목록 조회 실패:', error);
      throw new Error('강아지 목록을 불러오는데 실패했습니다.');
    }
  }

  // 특정 강아지 조회
  static async getDogById(dogId: string): Promise<Dog | null> {
    try {
      const dogRef = doc(db, DOGS_COLLECTION, dogId);
      const dogDoc = await getDoc(dogRef);
      
      if (!dogDoc.exists()) {
        return null;
      }
      
      return {
        id: dogDoc.id,
        ...dogDoc.data()
      } as Dog;
    } catch (error) {
      console.error('강아지 조회 실패:', error);
      throw new Error('강아지 정보를 불러오는데 실패했습니다.');
    }
  }

  // 강아지 검색
  static async searchDogs(userId: string, searchQuery: string): Promise<Dog[]> {
    try {
      // Firestore는 full-text search를 지원하지 않으므로
      // 클라이언트 사이드에서 필터링하거나 Algolia 등의 서비스를 사용해야 함
      // 여기서는 모든 강아지를 가져와서 클라이언트에서 필터링
      const dogs = await this.getDogsByUserId(userId);
      
      if (!searchQuery.trim()) {
        return dogs;
      }
      
      const query = searchQuery.toLowerCase();
      return dogs.filter(dog => 
        dog.name.toLowerCase().includes(query) ||
        dog.breed.toLowerCase().includes(query) ||
        dog.description?.toLowerCase().includes(query)
      );
    } catch (error) {
      console.error('강아지 검색 실패:', error);
      throw new Error('강아지 검색에 실패했습니다.');
    }
  }
}
