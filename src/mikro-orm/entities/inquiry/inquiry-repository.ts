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
