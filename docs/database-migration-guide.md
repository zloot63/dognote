# DogNote 데이터베이스 마이그레이션 가이드

## 현재 문제점 및 해결 방안

### 1. 즉시 해결해야 할 문제들

#### 1.1 Firebase 인덱스 오류
**문제**: `where` + `orderBy` 복합 쿼리 시 인덱스 부족으로 권한 오류 발생

**해결책**:
```bash
# 1. firestore.indexes.json 업데이트
firebase deploy --only firestore:indexes

# 2. 또는 임시로 클라이언트 정렬 사용 (현재 적용됨)
```

#### 1.2 데이터 타입 불일치
**문제**: Timestamp와 ISO 8601 문자열 혼재 사용

**해결책**:
```typescript
// 통일된 타입 정의
interface BaseEntity {
  id: string;
  createdAt: Timestamp;  // Firebase Timestamp 사용
  updatedAt: Timestamp;
}

// 클라이언트에서 변환
const formatDate = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString().split('T')[0];
};
```

#### 1.3 양방향 참조 문제
**문제**: `users.dogs` 배열과 `dogs.userId` 간 동기화 문제

**해결책**:
```typescript
// users.dogs 배열 제거, dogs.userId만 사용
interface User {
  id: string;
  email: string;
  displayName: string;
  // dogs: string[]; // 제거
}

// 강아지 목록은 쿼리로 조회
const getUserDogs = (userId: string) => {
  return db.collection('dogs')
    .where('userId', '==', userId)
    .where('isActive', '==', true)
    .get();
};
```

### 2. 단계별 마이그레이션 계획

#### Phase 1: 긴급 수정 (1주)
1. **Firebase 인덱스 생성**
2. **보안 규칙 강화**
3. **타입 정의 통일**

#### Phase 2: 스키마 개선 (2-3주)
1. **새로운 엔티티 구조 적용**
2. **데이터 마이그레이션**
3. **성능 최적화**

#### Phase 3: 고급 기능 (4주)
1. **공유 기능 구현**
2. **실시간 알림**
3. **분석 대시보드**

## 구체적인 구현 가이드

### 1. 개선된 타입 정의

#### 1.1 공통 베이스 타입
```typescript
// src/types/base.ts
export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BaseEntityWrite {
  createdAt: FieldValue;
  updatedAt: FieldValue;
}
```

#### 1.2 사용자 타입 개선
```typescript
// src/types/user.ts
export interface User extends BaseEntity {
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      walkReminders: boolean;
      healthReminders: boolean;
    };
  };
  
  stats: {
    totalDogs: number;
    totalWalks: number;
    totalDistance: number;
  };
}

export interface UserWrite extends BaseEntityWrite {
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  preferences: User['preferences'];
  stats: User['stats'];
}
```

#### 1.3 강아지 타입 개선
```typescript
// src/types/dog.ts
export interface Dog extends BaseEntity {
  userId: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string; // ISO 8601 (YYYY-MM-DD)
  weight: number;
  profileImage?: string;
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
  
  // 연락처
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
  
  // 상태
  isActive: boolean;
  
  // 통계 (비정규화)
  stats: {
    totalWalks: number;
    totalDistance: number;
    averageWalkDuration: number;
    lastWalkDate?: string;
  };
}
```

### 2. 서비스 레이어 개선

#### 2.1 베이스 서비스 클래스
```typescript
// src/services/BaseService.ts
export abstract class BaseService<T extends BaseEntity, TWrite extends BaseEntityWrite> {
  protected collectionName: string;
  
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }
  
  protected getCollection() {
    return collection(db, this.collectionName);
  }
  
  async create(data: Omit<TWrite, 'createdAt' | 'updatedAt'>): Promise<string> {
    const docData: TWrite = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as TWrite;
    
    const docRef = await addDoc(this.getCollection(), docData);
    return docRef.id;
  }
  
  async update(id: string, data: Partial<Omit<TWrite, 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = doc(this.getCollection(), id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }
  
  async delete(id: string): Promise<void> {
    const docRef = doc(this.getCollection(), id);
    await deleteDoc(docRef);
  }
  
  async softDelete(id: string): Promise<void> {
    await this.update(id, { isActive: false } as any);
  }
  
  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.getCollection(), id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    
    return null;
  }
}
```

#### 2.2 개선된 DogService
```typescript
// src/services/DogService.ts
export class DogService extends BaseService<Dog, DogWrite> {
  constructor() {
    super('dogs');
  }
  
  async getDogsByUserId(userId: string): Promise<Dog[]> {
    try {
      const q = query(
        this.getCollection(),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Dog));
    } catch (error) {
      console.error('강아지 목록 조회 실패:', error);
      throw new Error('강아지 목록을 불러오는데 실패했습니다.');
    }
  }
  
  async updateStats(dogId: string, walkData: { distance: number; duration: number }): Promise<void> {
    const dog = await this.getById(dogId);
    if (!dog) throw new Error('강아지를 찾을 수 없습니다.');
    
    const newStats = {
      totalWalks: dog.stats.totalWalks + 1,
      totalDistance: dog.stats.totalDistance + walkData.distance,
      averageWalkDuration: Math.round(
        (dog.stats.averageWalkDuration * dog.stats.totalWalks + walkData.duration) / 
        (dog.stats.totalWalks + 1)
      ),
      lastWalkDate: new Date().toISOString().split('T')[0]
    };
    
    await this.update(dogId, { stats: newStats });
  }
}
```

### 3. 데이터 마이그레이션 스크립트

#### 3.1 마이그레이션 실행기
```typescript
// src/utils/migration.ts
interface MigrationStep {
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export class MigrationRunner {
  private migrations: MigrationStep[] = [];
  
  addMigration(migration: MigrationStep) {
    this.migrations.push(migration);
  }
  
  async runMigrations() {
    const currentVersion = await this.getCurrentVersion();
    const pendingMigrations = this.migrations.filter(m => 
      this.compareVersions(m.version, currentVersion) > 0
    );
    
    for (const migration of pendingMigrations) {
      console.log(`Running migration: ${migration.description}`);
      await migration.up();
      await this.updateVersion(migration.version);
      console.log(`Completed migration: ${migration.version}`);
    }
  }
  
  private async getCurrentVersion(): Promise<string> {
    const versionDoc = await getDoc(doc(db, 'system', 'version'));
    return versionDoc.exists() ? versionDoc.data().version : '0.0.0';
  }
  
  private async updateVersion(version: string): Promise<void> {
    await setDoc(doc(db, 'system', 'version'), { 
      version, 
      updatedAt: serverTimestamp() 
    });
  }
  
  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      
      if (aPart > bPart) return 1;
      if (aPart < bPart) return -1;
    }
    
    return 0;
  }
}
```

#### 3.2 구체적인 마이그레이션 스크립트
```typescript
// src/migrations/001-fix-user-dogs-reference.ts
export const migration001: MigrationStep = {
  version: '1.0.1',
  description: 'Remove dogs array from users collection',
  up: async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const batch = writeBatch(db);
    
    usersSnapshot.docs.forEach(userDoc => {
      const userData = userDoc.data();
      if (userData.dogs) {
        // dogs 필드 제거
        batch.update(userDoc.ref, {
          dogs: deleteField()
        });
      }
    });
    
    await batch.commit();
  },
  down: async () => {
    // 롤백: 각 사용자의 dogs 배열 재생성
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const batch = writeBatch(db);
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const dogsSnapshot = await getDocs(
        query(collection(db, 'dogs'), where('userId', '==', userId))
      );
      
      const dogIds = dogsSnapshot.docs.map(doc => doc.id);
      batch.update(userDoc.ref, { dogs: dogIds });
    }
    
    await batch.commit();
  }
};
```

### 4. 성능 최적화

#### 4.1 캐싱 전략
```typescript
// src/utils/cache.ts
class CacheManager {
  private cache = new Map<string, { data: any; expiry: number }>();
  
  set(key: string, data: any, ttlSeconds: number = 300) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expiry });
  }
  
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }
  
  invalidate(pattern: string) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new CacheManager();
```

#### 4.2 배치 처리
```typescript
// src/utils/batch.ts
export class BatchProcessor {
  private operations: Array<() => Promise<void>> = [];
  private readonly batchSize: number;
  
  constructor(batchSize: number = 500) {
    this.batchSize = batchSize;
  }
  
  add(operation: () => Promise<void>) {
    this.operations.push(operation);
  }
  
  async execute() {
    for (let i = 0; i < this.operations.length; i += this.batchSize) {
      const batch = this.operations.slice(i, i + this.batchSize);
      await Promise.all(batch.map(op => op()));
      
      // 배치 간 지연 (Rate limiting)
      if (i + this.batchSize < this.operations.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}
```

## 실행 계획

### 1. 즉시 실행 (이번 주)
```bash
# 1. 인덱스 배포
firebase deploy --only firestore:indexes

# 2. 보안 규칙 업데이트
firebase deploy --only firestore:rules

# 3. 타입 정의 업데이트
# - BaseEntity 인터페이스 추가
# - 기존 타입들 개선
```

### 2. 다음 주 실행
```bash
# 1. 마이그레이션 스크립트 실행
npm run migrate

# 2. 서비스 레이어 리팩토링
# - BaseService 구현
# - DogService 개선

# 3. 캐싱 시스템 도입
```

### 3. 지속적 모니터링
- 쿼리 성능 모니터링
- 데이터 무결성 검증
- 사용자 피드백 수집

## 주의사항

1. **백업 필수**: 마이그레이션 전 전체 데이터 백업
2. **단계적 배포**: 기능별로 나누어 점진적 배포
3. **롤백 준비**: 각 단계별 롤백 계획 수립
4. **모니터링**: 성능 및 오류 지표 지속 관찰
