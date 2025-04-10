import { Test, TestingModule } from '@nestjs/testing';
import { InternalApiController } from '../../../src/api/internal/internal-api.controller';
import { InternalApiService } from '../../../src/api/internal/internal-api.service';
import { DateValidationPipe } from '../../../src/api/internal/pipes/date-validation.pipe';

// DateValidationPipe 클래스 모킹
jest.mock('../../../src/api/internal/pipes/date-validation.pipe', () => {
  return {
    DateValidationPipe: jest.fn().mockImplementation(() => ({
      transform: jest.fn().mockImplementation((value) => {
        if (!value) return undefined;
        return new Date(value);
      }),
    })),
  };
});

describe('InternalApiController', () => {
  let controller: InternalApiController;
  let service: InternalApiService;

  // 모의 서비스 객체 생성
  const mockInternalApiService = {
    getInquiries: jest.fn().mockImplementation((params, options) => {
      return {
        success: true,
        data: [
          {
            id: 1,
            phoneNumber: '01012345678',
            businessType: '카페',
            businessNumber: '1234567890',
            createdAt: 1712345678,
          },
        ],
        pagination: {
          total: 1,
          page: options?.page || 1,
          limit: options?.limit || 20,
          pages: 1,
        },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalApiController],
      providers: [
        {
          provide: InternalApiService,
          useValue: mockInternalApiService,
        },
      ],
    }).compile();

    controller = module.get<InternalApiController>(InternalApiController);
    service = module.get<InternalApiService>(InternalApiService);
  });

  it('컨트롤러가 정의되어 있어야 함', () => {
    expect(controller).toBeDefined();
  });

  describe('getInquiries', () => {
    it('전화번호로 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // 테스트 실행
      const result = await controller.getInquiries('01012345678');
      
      // 서비스 메서드가 올바른 파라미터로 호출되었는지 확인
      expect(service.getInquiries).toHaveBeenCalledWith(
        { phoneNumber: '01012345678', startDate: undefined, endDate: undefined },
        { page: 1, limit: 20, sort: 'createdAt', order: 'DESC' }
      );
      
      // 결과 확인
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].phoneNumber).toBe('01012345678');
    });

    it('날짜 범위로 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // 테스트용 날짜 문자열
      const startDateStr = '2025-03-01';
      const endDateStr = '2025-03-31';
      
      // 테스트 실행 - 문자열 대신 Date 객체 전달
      const result = await controller.getInquiries(
        undefined, 
        new Date(startDateStr), 
        new Date(endDateStr)
      );
      
      // 서비스 메서드가 올바른 파라미터로 호출되었는지 확인
      expect(service.getInquiries).toHaveBeenCalledWith(
        { 
          phoneNumber: undefined, 
          startDate: new Date(startDateStr), 
          endDate: new Date(endDateStr) 
        },
        { page: 1, limit: 20, sort: 'createdAt', order: 'DESC' }
      );
      
      // 결과 확인
      expect(result.success).toBe(true);
    });

    it('페이지네이션 옵션을 적용하여 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // 테스트 실행
      const result = await controller.getInquiries(
        undefined, 
        undefined, 
        undefined,
        '2',
        '10',
        'id',
        'ASC'
      );
      
      // 서비스 메서드가 올바른 파라미터로 호출되었는지 확인
      expect(service.getInquiries).toHaveBeenCalledWith(
        { phoneNumber: undefined, startDate: undefined, endDate: undefined },
        { page: 2, limit: 10, sort: 'id', order: 'ASC' }
      );
      
      // 결과 확인
      expect(result.success).toBe(true);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
    });
  });
});