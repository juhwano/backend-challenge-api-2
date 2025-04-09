import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { PhoneNumberValidationPipe } from './pipes/phone-number-validation.pipe';

@ApiTags('Public API')
@Controller('public')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @ApiOperation({ summary: '구매 상담 등록 API' })
  @ApiResponse({ status: 201, description: '구매 상담 등록 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @Post('/inquiry')
  @UsePipes(new ValidationPipe({ transform: true }))
  createInquiry(
    @Body('phoneNumber', new PhoneNumberValidationPipe()) phoneNumber: string,
    @Body() createInquiryDto: CreateInquiryDto
  ) {
    // phoneNumber 값을 createInquiryDto에 할당
    createInquiryDto.phoneNumber = phoneNumber;
    return this.publicApiService.createInquiry(createInquiryDto);
  }
}
