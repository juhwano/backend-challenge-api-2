import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { InternalApiModule } from './api/internal/internal-api.module';
import { PublicApiModule } from './api/public/public-api.module';
import { DB_NAME } from './mikro-orm/const';
import { InquiryEntity } from './mikro-orm/entities/inquiry/inquiry-entity';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      dbName: DB_NAME,
      driver: SqliteDriver,
      allowGlobalContext: true,
      entities: [InquiryEntity],
      // 읽기 전용 복제본 설정
      preferReadReplicas: true,
      replicas: [
        { name: 'read-1', host: 'localhost', dbName: `${DB_NAME}-replica-1` },
      ],
    }),
    AppCacheModule, // 캐시 모듈 추가
    InternalApiModule,
    PublicApiModule,
  ],
})
export class AppModule {}
