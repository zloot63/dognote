// 반려견 프로필 관련 타입 정의

export interface Dog {
  id: string;
  userId: string; // 소유자 ID
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string; // ISO 8601 format
  weight: number; // kg
  profileImage?: string; // Firebase Storage URL
  description?: string;
  isNeutered: boolean;
  microchipId?: string;
  registrationNumber?: string;
  color: string;
  size: 'small' | 'medium' | 'large' | 'giant';
  activityLevel: 'low' | 'moderate' | 'high' | 'very_high';
  temperament: string[];
  allergies: string[];
  medicalConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  veterinarian: {
    name: string;
    clinic: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DogFormData {
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string;
  weight: number;
  profileImage?: File | string;
  description?: string;
  isNeutered: boolean;
  microchipId?: string;
  registrationNumber?: string;
  color: string;
  size: 'small' | 'medium' | 'large' | 'giant';
  activityLevel: 'low' | 'moderate' | 'high' | 'very_high';
  temperament: string[];
  allergies: string[];
  medicalConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  veterinarian: {
    name: string;
    clinic: string;
    phone: string;
    address: string;
  };
}

export interface DogListItem {
  id: string;
  name: string;
  breed: string;
  profileImage?: string;
  age: number; // 계산된 나이 (개월 수)
  weight: number;
  size: Dog['size'];
}

// 견종 목록 (한국에서 인기 있는 견종들)
export const DOG_BREEDS = [
  '골든 리트리버',
  '래브라도 리트리버',
  '시바 이누',
  '포메라니안',
  '말티즈',
  '요크셔 테리어',
  '치와와',
  '푸들',
  '비숑 프리제',
  '코기',
  '시츄',
  '닥스훈트',
  '보더 콜리',
  '허스키',
  '진돗개',
  '믹스견',
  '기타'
] as const;

// 성격/기질 옵션
export const TEMPERAMENT_OPTIONS = [
  '활발한',
  '온순한',
  '친화적인',
  '보호적인',
  '독립적인',
  '충성스러운',
  '장난기 많은',
  '조용한',
  '호기심 많은',
  '경계심 강한',
  '사교적인',
  '차분한'
] as const;

// 활동 수준 라벨
export const ACTIVITY_LEVEL_LABELS = {
  low: '낮음 (실내 활동 위주)',
  moderate: '보통 (일일 산책)',
  high: '높음 (활발한 운동)',
  very_high: '매우 높음 (격렬한 운동)'
} as const;

// 크기 라벨
export const SIZE_LABELS = {
  small: '소형견 (10kg 미만)',
  medium: '중형견 (10-25kg)',
  large: '대형견 (25-40kg)',
  giant: '초대형견 (40kg 이상)'
} as const;

// 유효성 검사 스키마
export const dogValidationSchema = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 20,
    pattern: /^[가-힣a-zA-Z\s]+$/
  },
  breed: {
    required: true
  },
  gender: {
    required: true
  },
  birthDate: {
    required: true,
    validate: (date: string) => {
      const birth = new Date(date);
      const now = new Date();
      return birth <= now && birth >= new Date(now.getFullYear() - 25, 0, 1);
    }
  },
  weight: {
    required: true,
    min: 0.1,
    max: 100
  },
  color: {
    required: true,
    minLength: 1,
    maxLength: 20
  }
};

// 나이 계산 함수
export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  return diffMonths;
};

// 나이 표시 함수
export const formatAge = (months: number): string => {
  if (months < 12) {
    return `${months}개월`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years}세`;
  }
  return `${years}세 ${remainingMonths}개월`;
};
