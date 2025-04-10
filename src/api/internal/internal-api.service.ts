import { Injectable } from '@nestjs/common';
import { InquiryRepository } from '../../mikro-orm/entities/inquiry/inquiry-repository';

@Injectable()
export class InternalApiService {
  constructor(private readonly inquiryRepository: InquiryRepository) {}

  /**
   * 구매 상담 내역을 조회합니다.
   * @param params 검색 조건 (전화번호, 시작일, 종료일)
   * @param options 페이지네이션 및 정렬 옵션
   * @returns 검색 조건에 맞는 구매 상담 내역 목록
   */
  async getInquiries({ 
    phoneNumber,
    startDate,
    endDate
  }: { 
    phoneNumber?: string;
    startDate?: Date;
    endDate?: Date;
  }, options?: {
    page?: number;
    limit?: number;
    sort?: 'createdAt' | 'id';
    order?: 'ASC' | 'DESC';
  }) {
    let startTimestamp: number | undefined = undefined;
    if (startDate && startDate instanceof Date) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      startTimestamp = Math.floor(start.getTime() / 1000);
    }
    
    let endTimestamp: number | undefined = undefined;
    if (endDate && endDate instanceof Date) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      endTimestamp = Math.floor(end.getTime() / 1000);
    }
  
    const defaultOptions = {
      page: 1,
      limit: 20,
      sort: 'createdAt' as const,
      order: 'DESC' as const,   
    };
  
    const finalOptions = { ...defaultOptions, ...options };
  
    const result = await this.inquiryRepository.findByPhoneNumberAndDateRange({
      phoneNumber,
      startTimestamp,
      endTimestamp,
    }, finalOptions);
    
    return {
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages,
      }
    };
  }
}
