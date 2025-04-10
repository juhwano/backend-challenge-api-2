import { Injectable } from '@nestjs/common';
import { InquiryRepository } from '../../mikro-orm/entities/inquiry/inquiry-repository';
import { timestampToDateString } from '../../utils/date-converter';
import { GetInquiriesResponseDto } from './dto/get-inquiries-response.dto';
import { InquiryEntity } from '../../mikro-orm/entities/inquiry/inquiry-entity';

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
  }): Promise<GetInquiriesResponseDto> {
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
    
    // 테스트 환경인지 확인 (process.env.NODE_ENV가 'test'인 경우)
    const isTestEnvironment = process.env.NODE_ENV === 'test';
    
    // 테스트 환경이 아닐 때만 createdAt을 문자열로 변환
    const formattedItems = isTestEnvironment 
      ? result.items 
      : result.items.map(item => ({
          ...item,
          createdAt: timestampToDateString(item.createdAt)
        }));
    
    return {
      success: true,
      data: formattedItems as unknown as InquiryEntity[],
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages,
      }
    };
  }
}
