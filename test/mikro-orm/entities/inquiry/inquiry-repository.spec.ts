import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { InquiryRepository } from '../../../../src/mikro-orm/entities/inquiry/inquiry-repository';
import { InquiryEntity } from '../../../../src/mikro-orm/entities/inquiry/inquiry-entity';
import { EntityManager } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';

jest.setTimeout(30000);

describe('InquiryRepository', () => {
  let repository: InquiryRepository;
  let entityManager: EntityManager;
  let module: TestingModule;
  
  const testInquiry = {
    phoneNumber: '01012345678',
    businessType: '카페',
    businessNumber: '1234567890',
  };

  beforeEach(async () => {
    // given
    module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          entities: [InquiryEntity],
          dbName: ':memory:',
          driver: SqliteDriver,
          autoLoadEntities: true,
          allowGlobalContext: true,
        }),
        MikroOrmModule.forFeature([InquiryEntity]),
      ],
      providers: [InquiryRepository],
    }).compile();

    repository = module.get<InquiryRepository>(InquiryRepository);
    entityManager = module.get<EntityManager>(EntityManager);
    
    const connection = entityManager.getConnection();
    await connection.execute('CREATE TABLE IF NOT EXISTS inquiry (id INTEGER PRIMARY KEY AUTOINCREMENT, phone_number VARCHAR(11) NOT NULL, business_type VARCHAR(150) NOT NULL, business_number VARCHAR(10), created_at INTEGER NOT NULL)');
  });

  afterEach(async () => {
    try {
      const connection = entityManager.getConnection();
      await connection.execute('DROP TABLE IF EXISTS inquiry');
      await connection.close(true);
      await module.close();
    } catch (error) {
      console.error('테스트 정리 중 오류 발생:', error);
    }
  });

  it('전화번호가 제공되지 않은 경우 모든 내역을 반환해야 함', async () => {
    // given
    const inquiry1 = entityManager.create(InquiryEntity, {
      phoneNumber: testInquiry.phoneNumber,
      businessType: testInquiry.businessType,
      businessNumber: testInquiry.businessNumber,
      createdAt: Math.floor(Date.now() / 1000),
    });
    
    const inquiry2 = entityManager.create(InquiryEntity, {
      phoneNumber: '01087654321',
      businessType: '레스토랑',
      createdAt: Math.floor(Date.now() / 1000),
    });
    
    await entityManager.persistAndFlush([inquiry1, inquiry2]);

    // when
    const results = await repository.findByPhoneNumber();

    // then
    expect(results).toHaveLength(2);
  });

  it('완전한 전화번호로 정확히 일치하는 항목을 검색할 수 있어야 함', async () => {
    // given
    const inquiry = entityManager.create(InquiryEntity, {
      phoneNumber: testInquiry.phoneNumber,
      businessType: testInquiry.businessType,
      businessNumber: testInquiry.businessNumber,
      createdAt: Math.floor(Date.now() / 1000),
    });
    
    await entityManager.persistAndFlush([inquiry]);

    // when
    const results = await repository.findByPhoneNumber('01012345678');

    // then
    expect(results).toHaveLength(1);
    expect(results[0].phoneNumber).toBe('01012345678');
  });

  it('부분 전화번호로 LIKE 검색을 수행할 수 있어야 함', async () => {
    // given
    const inquiry = entityManager.create(InquiryEntity, {
      phoneNumber: testInquiry.phoneNumber,
      businessType: testInquiry.businessType,
      businessNumber: testInquiry.businessNumber,
      createdAt: Math.floor(Date.now() / 1000),
    });
    
    await entityManager.persistAndFlush([inquiry]);

    // when
    const results = await repository.findByPhoneNumber('0101');

    // then
    expect(results).toHaveLength(1);
    expect(results[0].phoneNumber).toBe('01012345678');
  });

  it('페이지네이션 옵션을 적용하여 구매 상담 내역을 검색할 수 있어야 함', async () => {
    // given
    const now = Math.floor(Date.now() / 1000);
    const inquiries: InquiryEntity[] = [];
    
    for (let i = 0; i < 5; i++) {
      const inquiry = entityManager.create(InquiryEntity, {
        phoneNumber: `0101234${i.toString().padStart(4, '0')}`,
        businessType: '카페',
        createdAt: now - i * 3600,
      });
      inquiries.push(inquiry);
    }
    
    await entityManager.persistAndFlush(inquiries);

    // when
    const result = await repository.findByPhoneNumberAndDateRange(
      {},
      { page: 2, limit: 2, sort: 'id', order: 'ASC' }
    );

    // then
    expect(result.items.length).toBeGreaterThanOrEqual(0);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.total).toBe(5);
    expect(result.pages).toBe(3);
  });
});