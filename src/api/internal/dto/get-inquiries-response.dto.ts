import { ApiProperty } from '@nestjs/swagger';
import { InquiryEntity } from '../../../mikro-orm/entities/inquiry/inquiry-entity';

class PaginationDto {
  @ApiProperty({
    description: '전체 항목 수',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: '현재 페이지 번호',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '페이지당 항목 수',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: '전체 페이지 수',
    example: 5,
  })
  pages: number;
}

class InquiryDto {
  @ApiProperty({
    description: '구매 상담 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
  })
  phoneNumber: string;

  @ApiProperty({
    description: '업종',
    example: '카페',
  })
  businessType: string;

  @ApiProperty({
    description: '사업자 번호',
    example: '1234567890',
    required: false,
  })
  businessNumber?: string;

  @ApiProperty({
    description: '생성 시간 (유닉스 타임스탬프)',
    example: 1744280658,
  })
  createdAt: number;
}

export class GetInquiriesResponseDto {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '구매 상담 내역 목록',
    type: [InquiryDto],
  })
  data: InquiryEntity[];

  @ApiProperty({
    description: '페이지네이션 정보',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}