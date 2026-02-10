import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => new Redis({ host: 'redis', port: 6379 }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisClientModule {}
