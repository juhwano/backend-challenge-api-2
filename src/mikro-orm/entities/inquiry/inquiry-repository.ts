import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { InquiryEntity } from './inquiry-entity';

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
    if (!inquiry.phoneNumber || !inquiry.businessType) {
      throw new Error('필수 필드가 누락되었습니다.');
    }

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
}
