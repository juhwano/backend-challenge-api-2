import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InternalApiService } from './internal-api.service';
import { PhoneNumberValidationPipe } from '../public/pipes/phone-number-validation.pipe';
import { DateValidationPipe } from './pipes/date-validation.pipe';
import { GetInquiriesRequestDto } from './dto/get-inquiries-request.dto';

@ApiTags('Internal API')
@Controller('internal')
export class InternalApiController {
  constructor(private readonly internalApiService: InternalApiService) {}

  @ApiOperation({ summary: '구매 상담 조회 API' })
  @Get('/inquiries')
  getInquiries(
    @Query() queryParams: GetInquiriesRequestDto,
    @Query('phoneNumber', new PhoneNumberValidationPipe({ optional: true })) phoneNumber?: string,
    @Query('startDate', new DateValidationPipe({ optional: true })) startDate?: Date,
    @Query('endDate', new DateValidationPipe({ optional: true })) endDate?: Date,
  ) {
    return this.internalApiService.getInquiries(
      { 
        phoneNumber, 
        startDate, 
        endDate 
      },
      { 
        page: queryParams.page || 1,
        limit: queryParams.limit || 20,
        sort: queryParams.sort || 'createdAt',
        order: queryParams.order || 'DESC'
      }
    );
  }
}
