import { Module } from '@nestjs/common';
import { InternalApiController } from './internal-api.controller';
import { InternalApiService } from './internal-api.service';
import { InquiryRepositoryModule } from '../../mikro-orm/entities/inquiry/inquiry-repository.module';

@Module({
  imports: [InquiryRepositoryModule],
  controllers: [InternalApiController],
  providers: [InternalApiService],
})
export class InternalApiModule {}
