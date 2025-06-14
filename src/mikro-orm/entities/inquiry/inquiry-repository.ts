import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InquiryEntity } from './inquiry-entity';
import { validatePhoneNumber } from '../../../utils/phone-number-validator';

@Injectable()
export class InquiryRepository {
  constructor(
    @InjectRepository(InquiryEntity)
    private readonly writeRepository: EntityRepository<InquiryEntity>,
    private readonly em: EntityManager,
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
    
    await this.writeRepository.getEntityManager().persistAndFlush(newInquiry);
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
    
    if (!phoneNumber) {
      console.log('전화번호가 제공되지 않아 모든 내역을 반환합니다.');
      return await this.findAll();
    }

    const cleanedPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
    
    // 전화번호 유효성 검증
    try {
      if (!validatePhoneNumber(cleanedPhoneNumber)) {
        throw new BadRequestException('유효하지 않은 전화번호 형식입니다.');
      }
    } catch (error) {
      throw new BadRequestException('유효하지 않은 전화번호 형식입니다.');
    }

    return await this.writeRepository.find({ phoneNumber: cleanedPhoneNumber });
  }
  
  /**
   * 전화번호와 날짜 범위로 구매 상담 내역을 검색합니다.
   * @param params 검색 조건 (전화번호, 시작 타임스탬프, 종료 타임스탬프)
   * @param options 페이지네이션 및 정렬 옵션
   * @returns 검색 조건에 맞는 구매 상담 내역 목록
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
      sort?: 'createdAt' | 'id';
      order?: 'ASC' | 'DESC';
      connectionType?: 'read' | 'write';
      consistentRead?: boolean; // 일관성 있는 읽기 옵션 추가
    } = {}
  ) {
    console.log('검색 요청 파라미터:', params);
    console.log('페이지네이션 옵션:', options);
    
    // 기본 옵션 설정
    const page = options.page || 1;
    const limit = options.limit || 20;
    const sort = options.sort || 'createdAt';
    const order = options.order || 'DESC';
    
    // 데이터 정합성이 중요한 경우 마스터 DB 사용
    let connectionType = options.connectionType || 'read';
    
    // 일관성 있는 읽기가 필요하거나 최근 데이터를 조회하는 경우 마스터 DB 사용
    if (options.consistentRead === true || 
        (params.startTimestamp && params.startTimestamp > Math.floor(Date.now() / 1000) - 300)) { // 최근 5분 이내 데이터
      connectionType = 'write';
    }
    
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
    
    // 정렬 옵션 설정
    const orderBy = { [sort]: order };
    
    // 읽기 전용 복제본 연결 사용
    const em = this.em.fork();
    const connection = em.getConnection(connectionType);
    
    // 페이지네이션 적용하여 조회
    const [items, total] = await this.writeRepository.findAndCount(where, {
      limit,
      offset: (page - 1) * limit,
      orderBy,
      connectionType, // 연결 타입 명시
    });
    
    // 총 페이지 수 계산
    const pages = Math.ceil(total / limit);
    
    return {
      items,
      total,
      page,
      limit,
      pages,
    };
  }
}
