import { Test, TestingModule } from '@nestjs/testing';
import { InternalApiService } from '../../../src/api/internal/internal-api.service';
import { InquiryRepository } from '../../../src/mikro-orm/entities/inquiry/inquiry-repository';

describe('InternalApiService', () => {
  let service: InternalApiService;
  let repository: InquiryRepository;

  const mockInquiryRepository = {
    findByPhoneNumberAndDateRange: jest.fn(),
  };

  const testInquiryResult = {
    items: [
      {
        id: 1,
        phoneNumber: '01012345678',
        businessType: '카페',
        businessNumber: '1234567890',
        createdAt: 1712345678,
      },
    ],
    total: 1,
    page: 1,
    limit: 20,
    pages: 1,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternalApiService,
        {
          provide: InquiryRepository,
          useValue: mockInquiryRepository,
        },
      ],
    }).compile();

    service = module.get<InternalApiService>(InternalApiService);
    repository = module.get<InquiryRepository>(InquiryRepository);
  });

  it('서비스가 정의되어 있어야 함', () => {
    expect(service).toBeDefined();
  });

  describe('getInquiries', () => {
    it('전화번호로 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // given
      mockInquiryRepository.findByPhoneNumberAndDateRange.mockResolvedValue(testInquiryResult);

      // when
      const result = await service.getInquiries({ phoneNumber: '01012345678' });

      // then
      expect(result.success).toBe(true);
      expect(result.data).toEqual(testInquiryResult.items);
      expect(result.pagination.total).toBe(testInquiryResult.total);
      expect(result.pagination.page).toBe(testInquiryResult.page);
      // verify
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledWith(
        { phoneNumber: '01012345678', startTimestamp: undefined, endTimestamp: undefined },
        { page: 1, limit: 20, sort: 'createdAt', order: 'DESC' }
      );
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledTimes(1);
    });

    it('날짜 범위로 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // given
      const startDate = new Date('2025-03-01');
      const endDate = new Date('2025-03-31');
      
      const startWithTime = new Date(startDate);
      startWithTime.setHours(0, 0, 0, 0);
      const expectedStartTimestamp = Math.floor(startWithTime.getTime() / 1000);
      
      const endWithTime = new Date(endDate);
      endWithTime.setHours(23, 59, 59, 999);
      const expectedEndTimestamp = Math.floor(endWithTime.getTime() / 1000);
      
      mockInquiryRepository.findByPhoneNumberAndDateRange.mockResolvedValue(testInquiryResult);
    
      // when
      const result = await service.getInquiries({ 
        startDate, 
        endDate 
      });
    
      // then
      expect(result.success).toBe(true);
      expect(result.data).toEqual(testInquiryResult.items);
      
      // verify
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledWith(
        { 
          phoneNumber: undefined, 
          startTimestamp: expectedStartTimestamp, 
          endTimestamp: expectedEndTimestamp 
        },
        { page: 1, limit: 20, sort: 'createdAt', order: 'DESC' }
      );
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledTimes(1);
    });

    it('페이지네이션 옵션을 적용하여 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // given
      const customOptions = { 
        page: 2, 
        limit: 10, 
        sort: 'id' as 'id' | 'createdAt', 
        order: 'ASC' as 'ASC' | 'DESC' 
      };
      const customResult = {
        ...testInquiryResult,
        page: 2,
        limit: 10,
      };
      
      mockInquiryRepository.findByPhoneNumberAndDateRange.mockResolvedValue(customResult);
    
      // when
      const result = await service.getInquiries(
        { phoneNumber: '01012345678' },
        customOptions
      );
    
      // then
      expect(result.success).toBe(true);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
      
      // verify
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledWith(
        expect.objectContaining({ phoneNumber: '01012345678' }),
        expect.objectContaining(customOptions)
      );
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledTimes(1);
    });
    
    it('리포지토리에서 오류가 발생하면 예외를 전파해야 함', async () => {
      // given
      const errorMessage = '데이터베이스 오류';
      mockInquiryRepository.findByPhoneNumberAndDateRange.mockRejectedValue(new Error(errorMessage));

      // when & then
      await expect(service.getInquiries({ phoneNumber: '01012345678' }))
        .rejects
        .toThrow(errorMessage);
        
      // verify
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledTimes(1);
    });

    it('같은 날짜가 시작일과 종료일로 입력되었을 때 해당 날짜의 전체 시간(00:00:00~23:59:59)을 포함하여 조회해야 함', async () => {
      // given
      const sameDate = new Date('2025-04-08');
      
      const expectedStartTimestamp = Math.floor(new Date(2025, 3, 8, 0, 0, 0).getTime() / 1000);
      
      const expectedEndTimestamp = Math.floor(new Date(2025, 3, 8, 23, 59, 59, 999).getTime() / 1000);
      
      mockInquiryRepository.findByPhoneNumberAndDateRange.mockResolvedValue(testInquiryResult);
    
      // when
      const result = await service.getInquiries({ 
        startDate: sameDate, 
        endDate: sameDate 
      });
    
      // then
      expect(result.success).toBe(true);
      expect(result.data).toEqual(testInquiryResult.items);
      
      // verify
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledWith(
        { 
          phoneNumber: undefined, 
          startTimestamp: expectedStartTimestamp, 
          endTimestamp: expectedEndTimestamp 
        },
        { page: 1, limit: 20, sort: 'createdAt', order: 'DESC' }
      );
      expect(repository.findByPhoneNumberAndDateRange).toHaveBeenCalledTimes(1);
    });
  });
});