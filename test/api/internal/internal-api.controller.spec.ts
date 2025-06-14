import { Test, TestingModule } from '@nestjs/testing';
import { InternalApiController } from '../../../src/api/internal/internal-api.controller';
import { InternalApiService } from '../../../src/api/internal/internal-api.service';
import { GetInquiriesRequestDto } from '../../../src/api/internal/dto/get-inquiries-request.dto';

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
    // given
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
      // given
      const phoneNumber = '01012345678';
      const queryParams = new GetInquiriesRequestDto();
      
      // When
      const result = await controller.getInquiries(
        queryParams,
        phoneNumber,
        undefined,
        undefined
      );
      
      // then
      expect(service.getInquiries).toHaveBeenCalledWith(
        { phoneNumber: phoneNumber, startDate: undefined, endDate: undefined },
        { page: 1, limit: 20, sort: 'createdAt', order: 'DESC' }
      );
      
      // then
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].phoneNumber).toBe('01012345678');
    });

    it('날짜 범위로 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // given
      const startDateStr = '2025-03-01';
      const endDateStr = '2025-03-31';
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const queryParams = new GetInquiriesRequestDto();
      
      // when
      const result = await controller.getInquiries(
        queryParams,
        undefined, 
        startDate, 
        endDate
      );
      
      // then
      expect(service.getInquiries).toHaveBeenCalledWith(
        { 
          phoneNumber: undefined, 
          startDate: startDate, 
          endDate: endDate 
        },
        { page: 1, limit: 20, sort: 'createdAt', order: 'DESC' }
      );
      
      // then
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it('페이지네이션 옵션을 적용하여 구매 상담 내역을 조회할 수 있어야 함', async () => {
      // given
      const phoneNumber = '01012345678';
      const page = 2;
      const limit = 10;
      const sort = 'id' as 'createdAt' | 'id';
      const order = 'ASC' as 'ASC' | 'DESC';
      
      const queryParams = new GetInquiriesRequestDto();
      queryParams.page = page;
      queryParams.limit = limit;
      queryParams.sort = sort;
      queryParams.order = order;
      
      // when
      const result = await controller.getInquiries(
        queryParams,
        phoneNumber
      );
      
      // then
      expect(service.getInquiries).toHaveBeenCalledWith(
        { phoneNumber, startDate: undefined, endDate: undefined },
        { page, limit, sort, order }
      );
      
      // then
      expect(result.success).toBe(true);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
    });
  });
});