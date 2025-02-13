import { openDB } from "idb";

// IndexedDB 초기화
const DB_NAME = "dognote-walks";
const STORE_NAME = "routes";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "timestamp" });
    }
  },
});

// GPS 데이터 저장 (5m 이상 이동 시)
export const saveToIndexedDB = async (location: { lat: number; lng: number; timestamp: string }) => {
  const db = await dbPromise;
  await db.add(STORE_NAME, location);
};

// IndexedDB에서 모든 GPS 데이터 가져오기
export const getWalkFromIndexedDB = async () => {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
};

// IndexedDB 초기화 (산책 시작 시 기존 데이터 삭제)
export const clearIndexedDB = async () => {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
};
