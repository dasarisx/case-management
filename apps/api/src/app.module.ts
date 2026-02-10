import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { CasesModule } from './cases/cases.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisClientModule } from './common/redis/redis.module';

@Module({
  imports: [
    PrismaModule.forRoot(),
    CasesModule,
    RedisClientModule,
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: 'redis',
        port: 6379,
        ttl: 300,
      }),
    }),
  ],
})
export class AppModule {}
