import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { CasesModule } from './cases/cases.module';

@Module({
  imports: [PrismaModule.forRoot(), CasesModule],
})
export class AppModule {}
