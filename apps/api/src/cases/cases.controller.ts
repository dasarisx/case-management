import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  AddActionDto,
  AssignmentResponseDto,
  CaseListItemDto,
  CasesQueryDto,
  CaseResponseDto,
  CreateCaseDto,
  KpiResponseDto,
} from './dto';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { CasesService } from './cases.service';
import { PdfService } from '../pdf/pdf.service';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { CaseStageDto, CaseStatusDto } from './dto/cases.enums';
import { CacheTTL } from '@nestjs/cache-manager';
import { CasesCacheInterceptor } from '../common/interceptors/cases-cache.interceptor';

@ApiTags('Cases')
@Controller('api/cases')
export class CasesController {
  constructor(
    private readonly casesService: CasesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiBody({
    type: CreateCaseDto,
    examples: {
      createCase: {
        summary: 'Create Case',
        value: { customerId: 12, loanId: 77 },
      },
    },
  })
  @ApiResponse({ status: 201, type: CaseResponseDto })
  createCase(@Body() dto: CreateCaseDto) {
    return this.casesService.createCase(dto);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: CaseStatusDto })
  @ApiQuery({ name: 'stage', required: false, enum: CaseStageDto })
  @ApiQuery({ name: 'dpdMin', required: false, type: Number })
  @ApiQuery({ name: 'dpdMax', required: false, type: Number })
  @ApiQuery({ name: 'assignedTo', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(CaseListItemDto)
  @UseInterceptors(CasesCacheInterceptor)
  @CacheTTL(300)
  listCases(@Query() query: CasesQueryDto, @Query() pagination: PaginationDto) {
    return this.casesService.findAll(query, pagination);
  }

  @Get('kpi')
  @ApiOkResponse({ type: KpiResponseDto })
  @UseInterceptors(CasesCacheInterceptor)
  @CacheTTL(300)
  getKpi() {
    return this.casesService.getKpi();
  }

  @Get(':id')
  @ApiOkResponse({ type: CaseResponseDto })
  @UseInterceptors(CasesCacheInterceptor)
  @CacheTTL(300)
  getCase(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.findOne(id);
  }

  @Post(':id/actions')
  @ApiBody({
    type: AddActionDto,
    examples: {
      addAction: {
        summary: 'Add Action',
        value: {
          type: 'CALL',
          outcome: 'PROMISE_TO_PAY',
          notes: 'Customer promised to pay on Friday',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Action added' })
  addAction(@Param('id', ParseIntPipe) id: number, @Body() dto: AddActionDto) {
    return this.casesService.addAction(id, dto);
  }

  @Post(':id/assign')
  @ApiOkResponse({
    type: AssignmentResponseDto,
    schema: {
      example: {
        caseId: 1001,
        stage: 'HARD',
        assignedTo: 'SeniorAgent',
        decision: {
          matchedRules: ['DPD_8_30', 'RISK_GT_80_OVERRIDE'],
          reason: 'dpd=12 -> Tier2; riskScore=92 -> SeniorAgent override',
        },
      },
    },
  })
  assignCase(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.assignCase(id);
  }

  @Get(':id/notice.pdf')
  @ApiProduces('application/pdf')
  async getNotice(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const pdf = await this.pdfService.generateNotice(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
  }
}
