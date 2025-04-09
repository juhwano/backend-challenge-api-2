import { Injectable } from '@nestjs/common';
import { InquiryRepository } from '../../mikro-orm/entities/inquiry/inquiry-repository';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class PublicApiService {
  constructor(private readonly inquiryRepository: InquiryRepository) {}

  async createInquiry(createInquiryDto: CreateInquiryDto) {
    const inquiry = await this.inquiryRepository.create({
      phoneNumber: createInquiryDto.phoneNumber,
      businessType: createInquiryDto.businessType,
      businessNumber: createInquiryDto.businessNumber,
    });
    
    return {
      success: true,
      id: inquiry.id,
      message: '구매 상담 등록이 완료되었습니다.',
    };
  }
}
