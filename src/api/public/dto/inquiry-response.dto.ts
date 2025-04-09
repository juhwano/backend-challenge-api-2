import { ApiProperty } from '@nestjs/swagger';

export class InquiryResponseDto {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '등록된 문의 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '응답 메시지',
    example: '구매 상담 등록이 완료되었습니다.',
  })
  message: string;
}