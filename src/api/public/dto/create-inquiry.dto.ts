import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({
    description: '상담을 위한 전화번호 (010으로 시작하는 11자리)',
    example: '01012345678',
  })
  @IsNotEmpty({ message: '전화번호는 필수 입력값입니다.' })
  @IsString()
  @Length(11, 11, { message: '전화번호는 11자리여야 합니다.' })
  @Matches(/^010\d{8}$/, { message: '010으로 시작하는 유효한 전화번호를 입력해주세요.' })
  phoneNumber: string;

  @ApiProperty({
    description: '운영 중이거나 준비 중인 업종',
    example: '카페',
  })
  @IsNotEmpty({ message: '업종 정보는 필수 입력값입니다.' })
  @IsString()
  @Length(1, 150, { message: '업종 정보는 150자 이내로 입력해주세요.' })
  businessType: string;

  @ApiPropertyOptional({
    description: '사업자 번호 (선택사항, 숫자 10자리)',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: '사업자 번호는 10자리여야 합니다.' })
  @Matches(/^\d{10}$/, { message: '사업자 번호는 숫자 10자리로 입력해주세요.' })
  businessNumber?: string;
}