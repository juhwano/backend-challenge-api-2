import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { InquiryEntity } from '../entities/inquiry/inquiry-entity';
import { DB_NAME } from '../const';

async function main() {
  // MikroORM 초기화
  const orm = await MikroORM.init({
    dbName: DB_NAME,
    driver: SqliteDriver,
    entities: [InquiryEntity],
  });

  try {
    const em = orm.em.fork();
    
    // 4월 5일부터 4월 9일까지의 날짜 생성
    const dates = [
      new Date('2025-04-05'),
      new Date('2025-04-06'),
      new Date('2025-04-07'),
      new Date('2025-04-08'),
      new Date('2025-04-09'),
    ];
    
    // 전화번호 배열
    const phoneNumbers = [
      '01012345678',
      '01023456789',
      '01034567890',
      '01045678901',
      '01056789012'
    ];
    
    // 비즈니스 타입 배열
    const businessTypes = [
      '카페',
      '레스토랑',
      '베이커리',
      '편의점',
      '마트'
    ];
    
    // 비즈니스 번호 배열
    const businessNumbers = [
      '1234567890',
      '2345678901',
      '3456789012',
      '4567890123',
      '5678901234'
    ];
    
    console.log('데이터 추가 시작...');
    
    // 각 날짜별로 5개의 데이터 생성
    for (const date of dates) {
      for (let i = 0; i < 5; i++) {
        // 각 날짜에 시간을 랜덤하게 설정 (0시~23시 사이)
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        const seconds = Math.floor(Math.random() * 60);
        
        date.setHours(hours, minutes, seconds);
        
        // 유닉스 타임스탬프(초 단위)로 변환
        const timestamp = Math.floor(date.getTime() / 1000);
        
        // 데이터 생성
        const inquiry = em.create(InquiryEntity, {
          phoneNumber: phoneNumbers[i],
          businessType: businessTypes[i],
          businessNumber: businessNumbers[i],
          createdAt: timestamp,
        });
        
        await em.persistAndFlush(inquiry);
        
        const formattedDate = new Date(timestamp * 1000).toLocaleString('ko-KR');
        console.log(`데이터 추가됨: ${formattedDate}, ${phoneNumbers[i]}, ${businessTypes[i]}`);
      }
    }
    
    console.log('총 25개의 데이터가 성공적으로 추가되었습니다.');
  } catch (error) {
    console.error('데이터 추가 중 오류 발생:', error);
  } finally {
    await orm.close(true);
  }
}

main();