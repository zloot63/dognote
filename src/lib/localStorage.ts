// ✅ LocalStorage에 산책 ID 저장
export const saveWalkIdToStorage = (walkId: string) => {
  localStorage.setItem('currentWalkId', walkId);
};

// ✅ 저장된 산책 ID 불러오기
export const getWalkIdFromStorage = (): string | null => {
  return localStorage.getItem('currentWalkId');
};

// ✅ 산책 ID 삭제 (산책 종료 시 호출)
export const removeWalkIdFromStorage = () => {
  localStorage.removeItem('currentWalkId');
};

// ✅ 현재 진행 중인 산책 ID 저장 (localStorage)
export const saveCurrentWalkToDB = (walkId: string) => {
  localStorage.setItem('currentWalkId', walkId);
  console.warn('📥 LocalStorage에 walkId 저장 완료:', walkId);
};

// ✅ 현재 진행 중인 산책 ID 가져오기
export const getCurrentWalkFromDB = (): string | null => {
  const walkId = localStorage.getItem('currentWalkId');
  console.warn('🧐 LocalStorage에서 walkId 가져옴:', walkId);
  return walkId;
};

// ✅ 현재 진행 중인 산책 ID 삭제
export const removeCurrentWalkFromDB = () => {
  localStorage.removeItem('currentWalkId');
  console.warn('🗑 LocalStorage에서 walkId 삭제 완료');
};

// ✅ GPS 데이터 저장 (localStorage 사용)
export const saveGPSToStorage = (location: {
  lat: number;
  lng: number;
  timestamp: string;
}) => {
  const existingData = JSON.parse(localStorage.getItem('gpsData') || '[]');
  existingData.push(location);
  localStorage.setItem('gpsData', JSON.stringify(existingData));
  console.warn('📍 LocalStorage에 GPS 데이터 저장 완료:', location);
};

// ✅ GPS 데이터 가져오기
export const getGPSFromStorage = (): {
  lat: number;
  lng: number;
  timestamp: string;
}[] => {
  const data = JSON.parse(localStorage.getItem('gpsData') || '[]');
  console.warn('📍 LocalStorage에서 GPS 데이터 가져오기 완료:', data);
  return data;
};

// ✅ GPS 데이터 삭제
export const removeGPSFromStorage = () => {
  localStorage.removeItem('gpsData');
  console.warn('🗑 LocalStorage에서 GPS 데이터 삭제 완료');
};
