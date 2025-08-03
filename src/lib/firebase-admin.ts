import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

// Firebase Admin SDK 초기화를 위한 인터페이스 정의
interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  [key: string]: string;
}

// Firebase Admin SDK 초기화 - 환경 변수 또는 JSON 파일에서 설정 로드
let firebaseAdminConfig: FirebaseAdminConfig;

// 환경 변수에서 설정 로드 시도
if (process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_CLIENT_EMAIL && 
    process.env.FIREBASE_PRIVATE_KEY) {
  firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
  console.log('Firebase Admin SDK: 환경 변수에서 설정을 로드했습니다.');
} else {
  // 환경 변수가 없으면 JSON 파일에서 로드 시도
  try {
    const serviceAccountPath = path.join(process.cwd(), 'dognote-dev-firebase-adminsdk.json');
    const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
    firebaseAdminConfig = JSON.parse(serviceAccountJson) as FirebaseAdminConfig;
    console.log('Firebase Admin SDK: JSON 파일에서 설정을 로드했습니다.');
  } catch (error) {
    console.error('Firebase Admin SDK 설정을 로드할 수 없습니다:', error);
    throw new Error('Firebase Admin SDK 설정을 로드할 수 없습니다. 환경 변수 또는 JSON 파일을 확인하세요.');
  }
}

// 이미 초기화된 앱이 없으면 초기화
const apps = getApps();
if (!apps.length) {
  try {
    initializeApp({
      credential: cert(firebaseAdminConfig),
    });
    console.log('Firebase Admin SDK 초기화 성공');
  } catch (error) {
    console.error('Firebase Admin SDK 초기화 실패:', error);
    throw new Error('Firebase Admin SDK 초기화에 실패했습니다. 설정을 확인하세요.');
  }
}

// Firestore와 Auth 인스턴스 내보내기
export const adminDb = getFirestore();
export const adminAuth = getAuth();
