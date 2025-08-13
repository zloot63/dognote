#!/usr/bin/env node

/**
 * Firebase Admin SDK를 사용한 데이터베이스 마이그레이션 스크립트
 * 관리자 권한으로 Firestore에 직접 접근
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Firebase Admin 초기화 (서비스 계정 키 필요)
// 또는 Firebase CLI 인증 사용
if (!admin.apps.length) {
  try {
    // 방법 1: 서비스 계정 키 파일 사용
    // const serviceAccount = require('./path/to/serviceAccountKey.json');
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    // });

    // 방법 2: Firebase CLI 인증 사용 (권장)
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
  } catch (error) {
    console.error('Firebase Admin 초기화 실패:', error.message);
    console.log('\n해결 방법:');
    console.log('1. Firebase CLI로 로그인: firebase login');
    console.log('2. 프로젝트 설정: firebase use --add');
    console.log('3. 또는 서비스 계정 키 파일 설정');
    process.exit(1);
  }
}

const db = admin.firestore();

class FirebaseAdminMigration {
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
      const usersSnapshot = await this.db.collection('users').get();
      console.log(`👥 Users: ${usersSnapshot.size}개`);
      
      let usersWithDogsArray = 0;
      let userDetails = [];
      
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        userDetails.push({
          id: doc.id,
          email: data.email || 'N/A',
          displayName: data.displayName || 'N/A',
          hasDogs: data.dogs && Array.isArray(data.dogs)
        });
        
        if (data.dogs && Array.isArray(data.dogs)) {
          usersWithDogsArray++;
        }
      });
      
      console.log(`   - dogs 배열이 있는 사용자: ${usersWithDogsArray}개`);
      
      // 사용자 상세 정보 출력
      if (userDetails.length > 0) {
        console.log('\n📋 사용자 목록:');
        userDetails.forEach(user => {
          console.log(`   - ${user.displayName} (${user.email}) ${user.hasDogs ? '[dogs 배열 있음]' : ''}`);
        });
      }

      // Dogs 컬렉션 확인
      const dogsSnapshot = await this.db.collection('dogs').get();
      console.log(`\n🐕 Dogs: ${dogsSnapshot.size}개`);
      
      let dogsWithoutUserId = 0;
      let dogsWithTimestampIssues = 0;
      let dogDetails = [];
      
      dogsSnapshot.forEach(doc => {
        const data = doc.data();
        dogDetails.push({
          id: doc.id,
          name: data.name || 'N/A',
          userId: data.userId || null,
          createdAt: data.createdAt
        });
        
        if (!data.userId) {
          dogsWithoutUserId++;
        }
        if (typeof data.createdAt === 'string') {
          dogsWithTimestampIssues++;
        }
      });
      
      console.log(`   - userId가 없는 강아지: ${dogsWithoutUserId}개`);
      console.log(`   - Timestamp 타입 문제: ${dogsWithTimestampIssues}개`);
      
      // 강아지 상세 정보 출력
      if (dogDetails.length > 0) {
        console.log('\n🐾 강아지 목록:');
        dogDetails.forEach(dog => {
          console.log(`   - ${dog.name} (소유자: ${dog.userId || '없음'})`);
        });
      }

      // Walks 컬렉션 확인
      const walksSnapshot = await this.db.collection('walks').get();
      console.log(`\n🚶 Walks: ${walksSnapshot.size}개`);

      // 데이터 일관성 검사
      console.log('\n🔍 데이터 일관성 검사:');
      
      // 고아 강아지 검사
      const orphanDogs = dogDetails.filter(dog => !dog.userId);
      if (orphanDogs.length > 0) {
        console.log(`❌ 소유자가 없는 강아지: ${orphanDogs.length}개`);
        orphanDogs.forEach(dog => {
          console.log(`   - ${dog.name} (ID: ${dog.id})`);
        });
      } else {
        console.log('✅ 모든 강아지에 소유자가 있습니다.');
      }

      // 양방향 참조 일관성 검사
      for (const user of userDetails) {
        if (user.hasDogs) {
          const userDoc = await this.db.collection('users').doc(user.id).get();
          const userData = userDoc.data();
          const userDogIds = userData.dogs || [];
          
          // 실제 강아지 문서 확인
          const actualDogs = dogDetails.filter(dog => dog.userId === user.id);
          
          if (userDogIds.length !== actualDogs.length) {
            console.log(`⚠️  ${user.displayName}: dogs 배열(${userDogIds.length})과 실제 강아지(${actualDogs.length}) 수 불일치`);
          }
        }
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
      const usersSnapshot = await this.db.collection('users').get();
      const batch = this.db.batch();
      let updateCount = 0;

      usersSnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        if (userData.dogs && Array.isArray(userData.dogs)) {
          batch.update(userDoc.ref, {
            dogs: admin.firestore.FieldValue.delete(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          updateCount++;
          console.log(`   - ${userData.displayName || userData.email}: dogs 배열 제거 예정`);
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
   * 마이그레이션 2: 강아지 데이터 정규화
   */
  async migration002_normalizeDogData() {
    console.log('🔄 Migration 002: 강아지 데이터 정규화 시작...');

    try {
      const dogsSnapshot = await this.db.collection('dogs').get();
      const batch = this.db.batch();
      let updateCount = 0;

      dogsSnapshot.forEach(dogDoc => {
        const dogData = dogDoc.data();
        const updates = {};

        // isActive 필드 추가 (기본값: true)
        if (dogData.isActive === undefined) {
          updates.isActive = true;
        }

        // stats 필드 초기화
        if (!dogData.stats) {
          updates.stats = {
            totalWalks: 0,
            totalDistance: 0,
            averageWalkDuration: 0,
            lastWalkDate: null
          };
        }

        // 빈 배열 필드 초기화
        if (!dogData.temperament) updates.temperament = [];
        if (!dogData.allergies) updates.allergies = [];
        if (!dogData.medicalConditions) updates.medicalConditions = [];

        // 업데이트할 내용이 있으면 배치에 추가
        if (Object.keys(updates).length > 0) {
          updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
          batch.update(dogDoc.ref, updates);
          updateCount++;
          console.log(`   - ${dogData.name}: 데이터 정규화 예정`);
        }
      });

      if (updateCount > 0) {
        await batch.commit();
        console.log(`✅ ${updateCount}개 강아지 데이터 정규화 완료`);
      } else {
        console.log('ℹ️  정규화할 데이터가 없습니다.');
      }

    } catch (error) {
      console.error('❌ Migration 002 실패:', error);
      throw error;
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
        const snapshot = await this.db.collection(collectionName).get();
        backup.collections[collectionName] = [];
        
        snapshot.forEach(doc => {
          backup.collections[collectionName].push({
            id: doc.id,
            data: doc.data()
          });
        });
        
        console.log(`   - ${collectionName}: ${snapshot.size}개 문서 백업`);
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

  /**
   * 전체 마이그레이션 실행
   */
  async runMigrations() {
    console.log('🚀 Firebase Admin 데이터베이스 마이그레이션 시작\n');

    try {
      // 현재 상태 확인
      await this.checkCurrentState();
      console.log('\n' + '='.repeat(50) + '\n');

      // 사용자 확인
      console.log('⚠️  마이그레이션을 실행하시겠습니까? (y/N)');
      
      // 실제 운영에서는 사용자 입력 받기
      // const readline = require('readline');
      // const rl = readline.createInterface({
      //   input: process.stdin,
      //   output: process.stdout
      // });
      
      // 지금은 자동 실행 (테스트용)
      console.log('자동 실행 모드: 마이그레이션을 시작합니다...\n');

      // 마이그레이션 실행
      await this.migration001_removeDogsArray();
      console.log('');
      
      await this.migration002_normalizeDogData();
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
}

// CLI 실행
async function main() {
  const command = process.argv[2] || 'check';
  const migration = new FirebaseAdminMigration();

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
      console.log('사용법: node scripts/firebase-admin-migration.cjs [check|backup|migrate]');
      break;
  }

  process.exit(0);
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FirebaseAdminMigration };
