import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60 * 30, // 30분 캐시 유효 시간
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}