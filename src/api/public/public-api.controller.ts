import { Body, Controller, Post } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@ApiTags('Public API')
@Controller('public')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @ApiOperation({ summary: '구매 상담 등록 API' })
  @Post('/inquiry')
  createInquiry(@Body() createInquiryDto: CreateInquiryDto) {
    return this.publicApiService.createInquiry(createInquiryDto);
  }
}
