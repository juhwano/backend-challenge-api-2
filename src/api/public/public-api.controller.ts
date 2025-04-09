import { Controller, Get, Post, Query } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Public API')
@Controller('public')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @ApiOperation({ summary: '구매 상담 등록 API' })
  @Post('/inquiry')
  createInquiry() {
    return this.publicApiService.createInquiry({});
  }
}
