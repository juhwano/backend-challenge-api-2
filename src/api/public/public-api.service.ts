import { Injectable } from '@nestjs/common';
import { InquiryRepository } from '../../mikro-orm/entities/inquiry/inquiry-repository';

@Injectable()
export class PublicApiService {
  constructor(private readonly inquiryRepository: InquiryRepository) {}

  async createInquiry({}: {}) {
    await this.inquiryRepository.create({});
    /**
     * TODO : 구현 필요
     */
  }
}
