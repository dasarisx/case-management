import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { PrismaService } from '../prisma.service';
import { RulesService } from '../rules/rules.service';
import { PdfService } from '../pdf/pdf.service';
import { RedisClientModule } from '../common/redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
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
  controllers: [CasesController],
  providers: [CasesService, PrismaService, RulesService, PdfService],
})
export class CasesModule {}
