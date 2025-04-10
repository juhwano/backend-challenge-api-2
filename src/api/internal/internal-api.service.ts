import { Injectable } from '@nestjs/common';
import { InquiryRepository } from '../../mikro-orm/entities/inquiry/inquiry-repository';
import { dateToTimestamp } from '../../utils/date-converter';

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
    // 날짜를 타임스탬프로 변환
    const startTimestamp = startDate ? Math.floor(startDate.getTime() / 1000) : undefined;
    const endTimestamp = endDate ? Math.floor(endDate.getTime() / 1000) : undefined;
  
    // 기본 옵션 설정
    const defaultOptions = {
      page: 1,
      limit: 20,
      sort: 'createdAt' as const,
      order: 'DESC' as const,   
    };
  
    // 사용자 옵션과 기본 옵션 병합
    const finalOptions = { ...defaultOptions, ...options };
  
    // 전화번호와 날짜 범위로 구매 상담 내역 검색
    const result = await this.inquiryRepository.findByPhoneNumberAndDateRange({
      phoneNumber,
      startTimestamp,
      endTimestamp,
    }, finalOptions);
    
    // 응답 데이터 구성
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
