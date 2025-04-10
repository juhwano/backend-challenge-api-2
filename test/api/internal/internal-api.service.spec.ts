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
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);
      
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
          startTimestamp, 
          endTimestamp 
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
  });
});