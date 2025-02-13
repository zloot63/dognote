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

// ✅ GPS 데이터 저장 (5m 이상 이동 시)
export const saveToIndexedDB = async (location: { lat: number; lng: number; timestamp: string }) => {
  try {
    const db = await dbPromise;
    await db.add(STORE_NAME, location);
  } catch (error) {
    console.error("🔥 IndexedDB 저장 실패:", error);
  }
};

// ✅ IndexedDB에서 모든 GPS 데이터 가져오기
export const getWalkFromIndexedDB = async () => {
  try {
    const db = await dbPromise;
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error("🔥 IndexedDB 조회 실패:", error);
    return [];
  }
};

// ✅ IndexedDB 초기화 (산책 종료 시 기존 데이터 삭제)
export const clearIndexedDB = async () => {
  try {
    const db = await dbPromise;
    await db.clear(STORE_NAME);
  } catch (error) {
    console.error("🔥 IndexedDB 초기화 실패:", error);
  }
};
