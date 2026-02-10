import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { PrismaService } from '../prisma.service';
import { RulesService } from '../rules/rules.service';
import { PdfService } from '../pdf/pdf.service';

@Module({
  controllers: [CasesController],
  providers: [CasesService, PrismaService, RulesService, PdfService],
})
export class CasesModule {}
