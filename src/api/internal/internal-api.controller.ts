import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InternalApiService } from './internal-api.service';
import { PhoneNumberValidationPipe } from '../public/pipes/phone-number-validation.pipe';
import { DateValidationPipe } from './pipes/date-validation.pipe';

@ApiTags('Internal API')
@Controller('internal')
export class InternalApiController {
  constructor(private readonly internalApiService: InternalApiService) {}

  @ApiOperation({ summary: '구매 상담 조회 API' })
  @ApiQuery({
    name: 'phoneNumber',
    required: false,
    description: '전화번호로 필터링',
    example: '01012345678',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: '시작 날짜 (YYYY-MM-DD)',
    example: '2025-03-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: '종료 날짜 (YYYY-MM-DD)',
    example: '2025-03-31',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 항목 수 (기본값: 20)',
    example: 20,
    type: Number,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: '정렬 기준 필드 (기본값: createdAt)',
    example: 'createdAt',
    enum: ['createdAt', 'id'],
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: '정렬 방향 (기본값: DESC)',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @Get('/inquiries')
  getInquiries(
    @Query('phoneNumber', new PhoneNumberValidationPipe({ optional: true })) phoneNumber?: string,
    @Query('startDate', new DateValidationPipe()) startDate?: Date,
    @Query('endDate', new DateValidationPipe()) endDate?: Date,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort: 'createdAt' | 'id' = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.internalApiService.getInquiries(
      { phoneNumber, startDate, endDate },
      { 
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        sort,
        order
      }
    );
  }
}
