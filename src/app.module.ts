import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { Module } from '@nestjs/common';
import { InternalApiModule } from './api/internal/internal-api.module';
import { PublicApiModule } from './api/public/public-api.module';
import { DB_NAME } from './mikro-orm/const';
import { InquiryEntity } from './mikro-orm/entities/inquiry/inquiry-entity';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      dbName: DB_NAME,
      driver: SqliteDriver,
      allowGlobalContext: true,
      entities: [InquiryEntity],
    }),
    InternalApiModule,
    PublicApiModule,
  ],
})
export class AppModule {}
