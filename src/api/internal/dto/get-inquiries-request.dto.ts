import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetInquiriesRequestDto {
  @ApiProperty({
    required: false,
    description: '전화번호로 필터링 (하이픈 없이 11자리 숫자만 입력)',
    example: '01012345678',
  })
  @IsOptional()
  @IsString()
  @Matches(/^010\d{8}$/, { message: '010으로 시작하는 11자리 숫자만 입력해주세요 (하이픈 없이)' })
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    description: '시작 날짜 (YYYY-MM-DD)',
    example: '2025-03-01',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    required: false,
    description: '종료 날짜 (YYYY-MM-DD)',
    example: '2025-03-31',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({
    required: false,
    description: '페이지 번호 (기본값: 1)',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  page?: number;

  @ApiProperty({
    required: false,
    description: '페이지당 항목 수 (기본값: 20)',
    example: 20,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 20))
  limit?: number;

  @ApiProperty({
    required: false,
    description: '정렬 기준 필드 (기본값: createdAt)',
    example: 'createdAt',
    enum: ['createdAt', 'id'],
  })
  @IsOptional()
  @IsEnum(['createdAt', 'id'])
  sort?: 'createdAt' | 'id' = 'createdAt';

  @ApiProperty({
    required: false,
    description: '정렬 방향 (기본값: DESC)',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}