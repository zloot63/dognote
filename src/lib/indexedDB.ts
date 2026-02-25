import { openDB, deleteDB, IDBPDatabase } from 'idb';

const DB_NAME = 'dognote-walks';
const DB_VERSION = 2;
const STORE_NAME = 'routes';
const WALK_STATE = 'walkState';

const isBrowser = typeof window !== 'undefined';

let dbInstance: IDBPDatabase | null = null; // IndexedDB 인스턴스 저장

// ✅ IndexedDB 초기화 (openDB)
const initDB = async () => {
  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        console.warn(
          `📌 IndexedDB 업그레이드 실행됨! (버전: ${oldVersion} → ${newVersion})`
        );
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
          console.warn('📌 IndexedDB: STORE_NAME 생성');
        }
        if (!db.objectStoreNames.contains(WALK_STATE)) {
          db.createObjectStore(WALK_STATE);
          console.warn('📌 IndexedDB: WALK_STATE 생성');
        }
      },
    });
    console.warn('✅ IndexedDB 초기화 완료');
  } catch (error) {
    console.error('🚨 IndexedDB 초기화 실패:', error);
  }
};

// ✅ IndexedDB 강제 초기화 함수
export const clearIndexedDB = async () => {
  if (!isBrowser) return;
  console.warn('🗑 IndexedDB 강제 삭제 진행 중...');

  try {
    if (dbInstance) dbInstance.close(); // 🔥 기존 연결 닫기
    await deleteDB(DB_NAME);
    console.warn('✅ IndexedDB 삭제 완료 (새로고침 후 재생성)');

    // ✅ 삭제 후 즉시 새로운 DB 열기
    await initDB();
  } catch (error) {
    console.error('🚨 IndexedDB 삭제 중 에러 발생:', error);
  }
};

// ✅ IndexedDB 데이터 저장
export const saveToIndexedDB = async (location: {
  lat: number;
  lng: number;
  timestamp: string;
}) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.add(STORE_NAME, location);
    console.warn('📍 GPS 데이터 저장 완료:', location);
  } catch (error) {
    console.error('🚨 IndexedDB GPS 데이터 저장 실패:', error);
  }
};

// ✅ 진행 중인 산책 ID 저장
export const saveCurrentWalkToDB = async (walkId: string) => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    await db.put(WALK_STATE, walkId, 'currentWalk');
    console.warn('📥 IndexedDB에 walkId 저장 완료:', walkId);
  } catch (error) {
    console.error('🚨 IndexedDB walkId 저장 실패:', error);
  }
};

// ✅ 진행 중인 산책 ID 불러오기 (DB 존재 여부 확인 후 실행)
export const getCurrentWalkFromDB = async (): Promise<string | null> => {
  try {
    console.warn('🧐 IndexedDB에서 walkId 가져오는 중...');
    const db = await openDB(DB_NAME, DB_VERSION);

    // ✅ DB가 비어있으면 null 반환
    if (!db.objectStoreNames.contains(WALK_STATE)) {
      console.warn('⚠️ walkId를 찾을 수 없음 (IndexedDB가 존재하지 않음)');
      return null;
    }

    const walkId = await db.get(WALK_STATE, 'currentWalk');
    return walkId || null;
  } catch (error) {
    console.error('🚨 IndexedDB walkId 가져오기 실패:', error);
    return null;
  }
};

// ✅ 진행 중인 산책 ID 삭제
export const removeCurrentWalkFromDB = async () => {
  try {
    console.warn('🗑 IndexedDB에서 walkId 삭제 진행...');

    // ✅ DB가 존재하는지 확인 후 삭제
    const db = await openDB(DB_NAME, DB_VERSION);
    if (!db.objectStoreNames.contains(WALK_STATE)) {
      console.warn('⚠️ 삭제할 walkId 없음 (IndexedDB가 존재하지 않음)');
      return;
    }

    await db.delete(WALK_STATE, 'currentWalk');
    console.warn('✅ walkId 삭제 완료');
  } catch (error) {
    console.error('🚨 IndexedDB walkId 삭제 실패:', error);
  }
};

export const getWalkFromIndexedDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const data = await db.getAll(STORE_NAME);
    console.warn('📍 GPS 데이터 가져오기 완료:', data);
    return data;
  } catch (error) {
    console.error('🚨 IndexedDB GPS 데이터 가져오기 실패:', error);
    return [];
  }
};

// ✅ IndexedDB 초기화 실행 (앱 실행 시 자동 실행)
initDB();
