import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InquiryEntity } from './inquiry-entity';
import { validatePhoneNumber } from '../../../utils/phone-number-validator';

@Injectable()
export class InquiryRepository {
  constructor(
    @InjectRepository(InquiryEntity)
    private readonly writeRepository: EntityRepository<InquiryEntity>,
  ) {}

  async create(inquiry: {
    phoneNumber: string;
    businessType: string;
    businessNumber?: string;
  }): Promise<InquiryEntity> {
    const newInquiry = this.writeRepository.create({
      phoneNumber: inquiry.phoneNumber,
      businessType: inquiry.businessType,
      businessNumber: inquiry.businessNumber,
      createdAt: Math.floor(Date.now() / 1000),
    });
    
    await this.writeRepository.getEntityManager().flush();
    return newInquiry;
  }

  async findAll() {
    return await this.writeRepository.findAll();
  }

  /**
   * 전화번호로 구매 상담 내역을 검색합니다.
   * @param phoneNumber 검색할 전화번호 (선택 사항)
   * @returns 검색 조건에 맞는 구매 상담 내역 목록
   */
  async findByPhoneNumber(phoneNumber?: string) {
    console.log('검색 요청된 전화번호:', phoneNumber);
    
    // 전화번호가 제공되지 않은 경우 모든 내역 반환
    if (!phoneNumber) {
      console.log('전화번호가 제공되지 않아 모든 내역을 반환합니다.');
      return await this.writeRepository.findAll();
    }

    // 전화번호 유효성 검사 (하이픈이 있는 경우도 처리)
    const cleanedPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
    
    // 완전한 전화번호인 경우 유효성 검사 수행
    if (cleanedPhoneNumber.length === 11) {
      try {
        // 전화번호 유효성 검사
        if (!validatePhoneNumber(cleanedPhoneNumber)) {
          throw new BadRequestException('유효하지 않은 전화번호 형식입니다.');
        }
      } catch (error) {
        console.error('전화번호 유효성 검사 실패:', error.message);
        throw new BadRequestException('유효하지 않은 전화번호 형식입니다.');
      }
    }
    
    console.log('정제된 전화번호:', cleanedPhoneNumber);

    // 검색 방식 결정 (정확히 일치하는 경우와 부분 검색)
    if (cleanedPhoneNumber.length === 11) {
      // 11자리 완전한 전화번호인 경우 정확히 일치하는 항목 검색
      console.log('완전한 전화번호로 정확히 일치하는 항목을 검색합니다.');
      const exactMatches = await this.writeRepository.find({ phoneNumber: cleanedPhoneNumber });
      console.log('정확히 일치하는 검색 결과 개수:', exactMatches.length);
      return exactMatches;
    } else {
      // 부분 전화번호인 경우 LIKE 검색 수행
      console.log('부분 전화번호로 LIKE 검색을 수행합니다.');
      // SQL 쿼리를 사용하여 LIKE 검색 수행
      const em = this.writeRepository.getEntityManager();
      // where 조건을 첫 번째 인자로 전달하고, 옵션을 두 번째 인자로 전달
      const partialMatches = await em.find(InquiryEntity, { phoneNumber: { $like: `%${cleanedPhoneNumber}%` } }, {
        filters: false,
        populate: []
      });
      console.log('부분 일치하는 검색 결과 개수:', partialMatches.length);
      return partialMatches;
    }
  }
  
  /**
   * 전화번호와 날짜 범위로 구매 상담 내역을 검색합니다.
   * @param params 검색 조건 (전화번호, 시작 타임스탬프, 종료 타임스탬프)
   * @param options 페이지네이션 및 정렬 옵션
   * @returns 검색 조건에 맞는 구매 상담 내역 목록과 총 개수
   */
  async findByPhoneNumberAndDateRange(
    params: {
      phoneNumber?: string;
      startTimestamp?: number;
      endTimestamp?: number;
    },
    options: {
      page?: number;
      limit?: number;
      orderBy?: 'createdAt' | 'id';
      orderDir?: 'ASC' | 'DESC';
    } = {
      page: 1,
      limit: 20,
      orderBy: 'createdAt',
      orderDir: 'DESC',
    }
  ) {
    console.log('검색 요청 파라미터:', params);
    console.log('페이지네이션 옵션:', options);
    const em = this.writeRepository.getEntityManager();
    const where: any = {};
    
    // 전화번호 조건 추가
    if (params.phoneNumber) {
      where.phoneNumber = params.phoneNumber;
    }
    
    // 시작일 조건 추가
    if (params.startTimestamp) {
      where.createdAt = where.createdAt || {};
      where.createdAt.$gte = params.startTimestamp;
    }
    
    // 종료일 조건 추가
    if (params.endTimestamp) {
      where.createdAt = where.createdAt || {};
      where.createdAt.$lte = params.endTimestamp;
    }
    
    // 페이지네이션 계산
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;
    
    // 정렬 옵션 설정
    const orderBy = options.orderBy || 'createdAt';
    const orderDir = options.orderDir || 'DESC';
    
    // 총 개수 조회 (카운트 쿼리 최적화)
    const totalCount = await em.count(InquiryEntity, where);
    
    // 조건이 없는 경우에도 페이지네이션과 정렬 적용
    const findOptions = {
      filters: false,
      populate: [],
      limit,
      offset,
      orderBy: { [orderBy]: orderDir },
    };
    
    console.log('실행될 쿼리 조건:', where);
    console.log('쿼리 옵션:', findOptions);
    
    // 결과 조회 - where 조건을 첫 번째 인자로 전달
    const results = await em.find(InquiryEntity, where, findOptions);
    
    return {
      items: results,
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    };
  }
}
