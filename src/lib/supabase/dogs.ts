import { supabase } from '@/lib/supabase';
import { Dog, DogFormData } from '@/types/dog';

export interface CreateDogData {
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: 'male' | 'female';
  profile_image?: string;
  description?: string;
  birth_date?: string;
  is_neutered?: boolean;
  microchip_id?: string;
  registration_number?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'giant';
  activity_level?: 'low' | 'moderate' | 'high' | 'very_high';
  temperament?: string[];
  allergies?: string[];
  medical_conditions?: string[];
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  veterinarian?: {
    name: string;
    clinic: string;
    phone: string;
    address: string;
  };
}

export type UpdateDogData = Partial<CreateDogData>;

export class DogService {
  // 사용자의 모든 강아지 가져오기
  static async getUserDogs(userId: string): Promise<Dog[]> {
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? data.map(dog => this.transformDbDogToDog(dog)) : [];
  }

  // 강아지 생성
  static async createDog(userId: string, dogData: DogFormData): Promise<Dog> {
    // Transform camelCase to snake_case for database
    const dbData: CreateDogData = {
      name: dogData.name,
      breed: dogData.breed,
      age: dogData.birthDate
        ? this.calculateAgeFromDate(dogData.birthDate)
        : undefined,
      weight: dogData.weight,
      gender: dogData.gender,
      profile_image:
        typeof dogData.profileImage === 'string'
          ? dogData.profileImage
          : undefined,
      description: dogData.description,
      birth_date: dogData.birthDate,
      is_neutered: dogData.isNeutered,
      microchip_id: dogData.microchipId,
      registration_number: dogData.registrationNumber,
      color: dogData.color,
      size: dogData.size,
      activity_level: dogData.activityLevel,
      temperament: dogData.temperament,
      allergies: dogData.allergies,
      medical_conditions: dogData.medicalConditions,
      emergency_contact: dogData.emergencyContact,
      veterinarian: dogData.veterinarian,
    };

    const { data, error } = await supabase
      .from('dogs')
      .insert({
        ...dbData,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      // If foreign key error, it means user doesn't exist in users table
      if (
        error.code === '23503' &&
        error.message?.includes('dogs_user_id_fkey')
      ) {
        throw new Error(
          '사용자 정보가 없습니다. 로그아웃 후 다시 로그인해주세요.'
        );
      }

      throw error;
    }

    // Transform back to camelCase for frontend
    return this.transformDbDogToDog(data);
  }

  // 날짜로부터 나이 계산 (개월 수)
  private static calculateAgeFromDate(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  }

  // 데이터베이스 Dog을 프론트엔드 Dog 타입으로 변환
  private static transformDbDogToDog(dbDog: {
    id: string;
    user_id: string;
    name: string;
    breed?: string;
    gender?: string;
    birth_date?: string;
    weight?: number;
    profile_image_url?: string;
    profile_image?: string;
    description?: string;
    is_neutered?: boolean;
    microchip_id?: string;
    registration_number?: string;
    color?: string;
    size?: string;
    activity_level?: string;
    temperament?: string[];
    allergies?: string[];
    medical_conditions?: string[];
    emergency_contact?: {
      name: string;
      relationship: string;
      phone: string;
    };
    veterinarian?: {
      name: string;
      clinic: string;
      phone: string;
      address: string;
    };
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
  }): Dog {
    return {
      id: dbDog.id,
      userId: dbDog.user_id,
      name: dbDog.name,
      breed: dbDog.breed || '',
      gender: dbDog.gender || 'male',
      birthDate: dbDog.birth_date || '',
      weight: dbDog.weight || 0,
      profileImage: dbDog.profile_image,
      description: dbDog.description,
      isNeutered: dbDog.is_neutered || false,
      microchipId: dbDog.microchip_id,
      registrationNumber: dbDog.registration_number,
      color: dbDog.color || '',
      size: dbDog.size || 'medium',
      activityLevel: dbDog.activity_level || 'moderate',
      temperament: dbDog.temperament || [],
      allergies: dbDog.allergies || [],
      medicalConditions: dbDog.medical_conditions || [],
      emergencyContact: dbDog.emergency_contact || {
        name: '',
        phone: '',
        relationship: '',
      },
      veterinarian: dbDog.veterinarian || {
        name: '',
        clinic: '',
        phone: '',
        address: '',
      },
      createdAt: dbDog.created_at,
      updatedAt: dbDog.updated_at,
    };
  }

  // 강아지 정보 업데이트
  static async updateDog(
    dogId: string,
    updates: Partial<DogFormData>
  ): Promise<Dog> {
    // Transform camelCase to snake_case for database
    const dbUpdates: Partial<UpdateDogData> = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.breed !== undefined) dbUpdates.breed = updates.breed;
    if (updates.birthDate !== undefined) {
      dbUpdates.birth_date = updates.birthDate;
      dbUpdates.age = this.calculateAgeFromDate(updates.birthDate);
    }
    if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.profileImage !== undefined) {
      dbUpdates.profile_image =
        typeof updates.profileImage === 'string'
          ? updates.profileImage
          : undefined;
    }
    if (updates.description !== undefined)
      dbUpdates.description = updates.description;
    if (updates.isNeutered !== undefined)
      dbUpdates.is_neutered = updates.isNeutered;
    if (updates.microchipId !== undefined)
      dbUpdates.microchip_id = updates.microchipId;
    if (updates.registrationNumber !== undefined)
      dbUpdates.registration_number = updates.registrationNumber;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.size !== undefined) dbUpdates.size = updates.size;
    if (updates.activityLevel !== undefined)
      dbUpdates.activity_level = updates.activityLevel;
    if (updates.temperament !== undefined)
      dbUpdates.temperament = updates.temperament;
    if (updates.allergies !== undefined)
      dbUpdates.allergies = updates.allergies;
    if (updates.medicalConditions !== undefined)
      dbUpdates.medical_conditions = updates.medicalConditions;
    if (updates.emergencyContact !== undefined)
      dbUpdates.emergency_contact = updates.emergencyContact;
    if (updates.veterinarian !== undefined)
      dbUpdates.veterinarian = updates.veterinarian;

    const { data, error } = await supabase
      .from('dogs')
      .update(dbUpdates)
      .eq('id', dogId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return this.transformDbDogToDog(data);
  }

  // 강아지 삭제
  static async deleteDog(dogId: string): Promise<void> {
    const { error } = await supabase.from('dogs').delete().eq('id', dogId);

    if (error) throw error;
  }

  // 특정 강아지 정보 가져오기
  static async getDogById(dogId: string): Promise<Dog | null> {
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('id', dogId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.transformDbDogToDog(data) : null;
  }
}
