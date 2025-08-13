# DogNote 데이터베이스 설계 문서

## 개요

이 문서는 DogNote 프로젝트의 데이터베이스 설계를 정의하며, 확장성, 유지보수성, 그리고 다른 데이터베이스로의 이식성을 고려하여 작성되었습니다.

## 설계 원칙

### 1. 확장성 (Scalability)
- 수평적 확장이 가능한 구조
- 데이터 분산 및 샤딩 고려
- 인덱스 최적화

### 2. 유지보수성 (Maintainability)
- 명확한 스키마 정의
- 일관된 네이밍 컨벤션
- 버전 관리 및 마이그레이션 지원

### 3. 이식성 (Portability)
- 데이터베이스 독립적인 설계
- 표준 SQL 호환성
- ORM/ODM 활용 가능한 구조

## 현재 문제점 분석

### 1. 데이터 정합성 문제
- `users.dogs` 배열과 `dogs.userId` 간의 양방향 참조로 인한 동기화 문제
- 트랜잭션 없이 관련 데이터 업데이트 시 일관성 보장 어려움

### 2. 스키마 불일치
- Firebase Timestamp와 ISO 8601 문자열 혼재
- 선택적 필드의 일관성 부족
- Read/Write 타입 분리 부족

### 3. 확장성 제약
- NoSQL 특성을 제대로 활용하지 못한 설계
- 복합 쿼리를 위한 인덱스 설계 부족
- 데이터 중복 최소화 vs 쿼리 성능 간의 균형 부족

## 개선된 데이터베이스 설계

### 1. 핵심 엔티티 설계

#### 1.1 Users (사용자)
```typescript
interface User {
  id: string;                    // Primary Key
  email: string;                 // Unique, 로그인 식별자
  displayName: string;           // 표시명
  photoURL?: string;             // 프로필 이미지 URL
  provider: string;              // 로그인 제공자 (google, apple, etc.)
  
  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  
  // 설정
  preferences: {
    language: string;            // 언어 설정
    timezone: string;            // 시간대
    notifications: {
      email: boolean;
      push: boolean;
      walkReminders: boolean;
      healthReminders: boolean;
    };
  };
  
  // 통계 (비정규화)
  stats: {
    totalDogs: number;
    totalWalks: number;
    totalDistance: number;       // 총 산책 거리 (km)
  };
}
```

#### 1.2 Dogs (반려견)
```typescript
interface Dog {
  id: string;                    // Primary Key
  userId: string;                // Foreign Key to Users
  
  // 기본 정보
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string;             // ISO 8601 (YYYY-MM-DD)
  weight: number;                // kg
  profileImage?: string;         // Storage URL
  description?: string;
  
  // 신체 정보
  color: string;
  size: 'small' | 'medium' | 'large' | 'giant';
  isNeutered: boolean;
  
  // 식별 정보
  microchipId?: string;
  registrationNumber?: string;
  
  // 성격 및 건강
  activityLevel: 'low' | 'moderate' | 'high' | 'very_high';
  temperament: string[];
  allergies: string[];
  medicalConditions: string[];
  
  // 연락처 정보
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
  
  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;             // 소프트 삭제
  
  // 통계 (비정규화)
  stats: {
    totalWalks: number;
    totalDistance: number;
    averageWalkDuration: number; // 분
    lastWalkDate?: string;
  };
}
```

#### 1.3 Walks (산책 기록)
```typescript
interface Walk {
  id: string;                    // Primary Key
  userId: string;                // Foreign Key to Users
  dogIds: string[];              // Foreign Keys to Dogs (다중 반려견 산책)
  
  // 시간 정보
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number;             // 분
  
  // 위치 및 경로
  startLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  endLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  route?: {
    lat: number;
    lng: number;
    timestamp: Timestamp;
  }[];
  
  // 통계
  distance?: number;             // km
  averageSpeed?: number;         // km/h
  maxSpeed?: number;             // km/h
  elevationGain?: number;        // m
  
  // 상태 및 메모
  status: 'active' | 'completed' | 'paused';
  weather?: {
    temperature: number;         // 섭씨
    condition: string;           // 날씨 상태
    humidity: number;            // 습도 %
  };
  
  // 이벤트 및 메모
  events: {
    type: 'rest' | 'play' | 'meet' | 'issue' | 'photo';
    timestamp: Timestamp;
    location?: { lat: number; lng: number; };
    description?: string;
    photoUrl?: string;
  }[];
  notes?: string;
  
  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2. 인덱스 설계

#### 2.1 Firebase/Firestore 인덱스
```json
{
  "indexes": [
    {
      "collectionGroup": "dogs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "walks",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "startTime", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 3. 보안 및 권한 관리

#### 3.1 Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 접근 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 강아지 데이터 - 소유자만 접근
    match /dogs/{dogId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // 산책 기록 - 소유자만 접근
    match /walks/{walkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 마이그레이션 로드맵

### Phase 1: 현재 문제 해결 (1-2주)
1. 데이터 타입 일관성 확보
2. 필수 인덱스 생성
3. 기본 보안 규칙 강화

### Phase 2: 스키마 개선 (2-3주)
1. 새로운 스키마 설계 적용
2. 데이터 마이그레이션 실행
3. 성능 최적화

### Phase 3: 고급 기능 추가 (3-4주)
1. 공유 기능 구현
2. 실시간 알림 시스템
3. 고급 분석 및 리포팅

## 권장사항

1. **즉시 적용**: 현재 Firebase 인덱스 문제 해결
2. **단계적 마이그레이션**: 서비스 중단 없이 점진적 개선
3. **모니터링 강화**: 성능 및 데이터 품질 지속 관찰
4. **백업 전략**: 정기적 백업 및 복구 테스트
