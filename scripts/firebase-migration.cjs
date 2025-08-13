#!/usr/bin/env node

/**
 * Firebase 데이터베이스 마이그레이션 스크립트
 * 
 * 사용법:
 * node scripts/firebase-migration.cjs [command]
 * 
 * Commands:
 * - check: 현재 데이터 상태 확인
 * - migrate: 마이그레이션 실행
 * - rollback: 롤백 실행
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteField,
  writeBatch,
  query,
  where,
  serverTimestamp
} = require('firebase/firestore');

// Firebase 설정 (환경변수에서 가져오기)
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class FirebaseMigration {
  constructor() {
    this.db = db;
  }

  /**
   * 현재 데이터 상태 확인
   */
  async checkCurrentState() {
    console.log('🔍 현재 데이터베이스 상태 확인 중...\n');

    try {
      // Users 컬렉션 확인
      const usersSnapshot = await getDocs(collection(this.db, 'users'));
      console.log(`👥 Users: ${usersSnapshot.size}개`);
      
      let usersWithDogsArray = 0;
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.dogs && Array.isArray(data.dogs)) {
          usersWithDogsArray++;
        }
      });
      console.log(`   - dogs 배열이 있는 사용자: ${usersWithDogsArray}개`);

      // Dogs 컬렉션 확인
      const dogsSnapshot = await getDocs(collection(this.db, 'dogs'));
      console.log(`🐕 Dogs: ${dogsSnapshot.size}개`);
      
      let dogsWithoutUserId = 0;
      let dogsWithTimestampIssues = 0;
      dogsSnapshot.forEach(doc => {
        const data = doc.data();
        if (!data.userId) {
          dogsWithoutUserId++;
        }
        if (typeof data.createdAt === 'string') {
          dogsWithTimestampIssues++;
        }
      });
      console.log(`   - userId가 없는 강아지: ${dogsWithoutUserId}개`);
      console.log(`   - Timestamp 타입 문제: ${dogsWithTimestampIssues}개`);

      // Walks 컬렉션 확인
      const walksSnapshot = await getDocs(collection(this.db, 'walks'));
      console.log(`🚶 Walks: ${walksSnapshot.size}개`);

      // 인덱스 상태 확인 (간접적으로)
      try {
        const testQuery = query(
          collection(this.db, 'dogs'),
          where('userId', '==', 'test')
        );
        await getDocs(testQuery);
        console.log('✅ 기본 쿼리 작동 정상');
      } catch (error) {
        console.log('❌ 쿼리 오류:', error.message);
      }

    } catch (error) {
      console.error('❌ 데이터 확인 중 오류:', error);
    }
  }

  /**
   * 마이그레이션 1: users.dogs 배열 제거
   */
  async migration001_removeDogsArray() {
    console.log('🔄 Migration 001: users.dogs 배열 제거 시작...');

    try {
      const usersSnapshot = await getDocs(collection(this.db, 'users'));
      const batch = writeBatch(this.db);
      let updateCount = 0;

      usersSnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        if (userData.dogs && Array.isArray(userData.dogs)) {
          batch.update(userDoc.ref, {
            dogs: deleteField(),
            updatedAt: serverTimestamp()
          });
          updateCount++;
        }
      });

      if (updateCount > 0) {
        await batch.commit();
        console.log(`✅ ${updateCount}개 사용자의 dogs 배열 제거 완료`);
      } else {
        console.log('ℹ️  제거할 dogs 배열이 없습니다.');
      }

    } catch (error) {
      console.error('❌ Migration 001 실패:', error);
      throw error;
    }
  }

  /**
   * 전체 마이그레이션 실행
   */
  async runMigrations() {
    console.log('🚀 Firebase 데이터베이스 마이그레이션 시작\n');

    try {
      // 현재 상태 확인
      await this.checkCurrentState();
      console.log('\n' + '='.repeat(50) + '\n');

      // 마이그레이션 실행
      await this.migration001_removeDogsArray();
      console.log('');

      // 마이그레이션 후 상태 확인
      console.log('🔍 마이그레이션 후 상태 확인\n');
      await this.checkCurrentState();

      console.log('\n✅ 모든 마이그레이션이 성공적으로 완료되었습니다!');

    } catch (error) {
      console.error('\n❌ 마이그레이션 실패:', error);
      process.exit(1);
    }
  }

  /**
   * 데이터 백업 생성
   */
  async createBackup() {
    console.log('💾 데이터 백업 생성 중...');
    
    const backup = {
      timestamp: new Date().toISOString(),
      collections: {}
    };

    try {
      const collections = ['users', 'dogs', 'walks'];
      
      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(this.db, collectionName));
        backup.collections[collectionName] = [];
        
        snapshot.forEach(doc => {
          backup.collections[collectionName].push({
            id: doc.id,
            data: doc.data()
          });
        });
      }

      // 백업 파일 저장
      const fs = require('fs');
      const backupPath = `./backups/backup-${Date.now()}.json`;
      
      // backups 디렉토리 생성
      if (!fs.existsSync('./backups')) {
        fs.mkdirSync('./backups');
      }
      
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      console.log(`✅ 백업 완료: ${backupPath}`);
      
      return backupPath;

    } catch (error) {
      console.error('❌ 백업 실패:', error);
      throw error;
    }
  }
}

// CLI 실행
async function main() {
  const command = process.argv[2] || 'check';
  const migration = new FirebaseMigration();

  switch (command) {
    case 'check':
      await migration.checkCurrentState();
      break;
    
    case 'backup':
      await migration.createBackup();
      break;
    
    case 'migrate':
      console.log('⚠️  마이그레이션을 실행하기 전에 백업을 생성합니다...\n');
      await migration.createBackup();
      console.log('\n' + '='.repeat(50) + '\n');
      await migration.runMigrations();
      break;
    
    default:
      console.log('사용법: node scripts/firebase-migration.cjs [check|backup|migrate]');
      break;
  }

  process.exit(0);
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FirebaseMigration };
