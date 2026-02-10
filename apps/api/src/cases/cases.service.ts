import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RulesService } from '../rules/rules.service';
import { AddActionDto, CasesQueryDto, CreateCaseDto } from './dto';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rulesService: RulesService,
  ) {}

  async createCase(dto: CreateCaseDto) {
    try {
      const customerId = dto.customerId;
      const loanId = dto.loanId;

      const [customer, loan] = await Promise.all([
        this.prisma.customer.findUnique({ where: { id: customerId } }),
        this.prisma.loan.findUnique({ where: { id: loanId } }),
      ]);

      if (!customer) {
        throw new NotFoundException(`Customer ${dto.customerId} not found`);
      }
      if (!loan) {
        throw new NotFoundException(`Loan ${dto.loanId} not found`);
      }
      if (loan.customerId !== customerId) {
        throw new BadRequestException(
          `Loan ${loanId} does not belong to customer ${customerId}`,
        );
      }

      const dpd = this.computeDpd(loan.dueDate);
      const decision = this.rulesService.evaluateRules({
        dpd,
        riskScore: customer.riskScore,
      });

      const created = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
        const createdCase = await tx.case.create({
          data: {
            customerId,
            loanId,
            dpd,
            stage: decision.stage ?? 'SOFT',
            status: 'OPEN',
            assignedTo: decision.assignedTo ?? null,
          },
        });

        await tx.ruleDecision.create({
          data: {
            caseId: createdCase.id,
            matchedRules: decision.matchedRules,
            reason: decision.reason,
          },
        });

        return createdCase;
        },
      );

      return this.toCaseResponse(created);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create case');
    }
  }

  async findAll(filters: CasesQueryDto, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.stage) where.stage = filters.stage;
    if (filters.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters.dpdMin !== undefined || filters.dpdMax !== undefined) {
      where.dpd = {};
      if (filters.dpdMin !== undefined) (where.dpd as any).gte = filters.dpdMin;
      if (filters.dpdMax !== undefined) (where.dpd as any).lte = filters.dpdMax;
    }

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
        include: {
          customer: { select: { name: true } },
          _count: {
            select: { actionLogs: true },
          },
        },
      }),
      this.prisma.case.count({ where }),
    ]);

    return {
      data: cases.map(
        (c: {
          id: number;
          customerId: number;
          loanId: number;
          dpd: number;
          stage: string;
          status: string;
          assignedTo: string | null;
          createdAt: Date;
          _count: { actionLogs: number };
          customer: { name: string };
        }) => ({
        id: c.id,
        customerId: c.customerId,
        customer: { name: c.customer.name },
        loanId: c.loanId,
        dpd: c.dpd,
        stage: c.stage,
        status: c.status,
        assignedTo: c.assignedTo ?? undefined,
        actionsCount: c._count.actionLogs,
        createdAt: c.createdAt.toISOString(),
        }),
      ),
      page,
      limit,
      offset,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getKpi() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [openCount, resolvedToday, avgDpd] = await this.prisma.$transaction([
      this.prisma.case.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      this.prisma.case.count({
        where: { status: 'RESOLVED', updatedAt: { gte: start, lt: end } },
      }),
      this.prisma.case.aggregate({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
        _avg: { dpd: true },
      }),
    ]);

    return {
      openCount,
      resolvedToday,
      avgDpdOpen: Math.round(avgDpd._avg.dpd ?? 0),
    };
  }

  async findOne(caseId: number) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: {
        customer: true,
        loan: true,
        actionLogs: { orderBy: { createdAt: 'desc' } },
        ruleDecisions: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!caseRecord) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    return caseRecord;
  }

  async addAction(caseId: number, dto: AddActionDto) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true },
    });

    if (!caseRecord) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    return this.prisma.actionLog.create({
      data: {
        caseId: caseRecord.id,
        type: dto.type,
        outcome: dto.outcome,
        notes: dto.notes ?? null,
      },
    });
  }

  async assignCase(caseId: number) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { customer: true },
    });

    if (!caseRecord) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const decision = this.rulesService.evaluateRules({
      dpd: caseRecord.dpd,
      riskScore: caseRecord.customer.riskScore,
    });

    const existingDecision = await this.prisma.ruleDecision.findFirst({
      where: { caseId: caseRecord.id },
      orderBy: { createdAt: 'desc' },
    });

    const shouldCreateDecision =
      !existingDecision ||
      existingDecision.reason !== decision.reason ||
      JSON.stringify(existingDecision.matchedRules) !==
        JSON.stringify(decision.matchedRules);

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.case.update({
        where: { id: caseRecord.id },
        data: {
          stage: decision.stage ?? caseRecord.stage,
          assignedTo: decision.assignedTo ?? caseRecord.assignedTo,
        },
      });

      if (shouldCreateDecision) {
        await tx.ruleDecision.create({
          data: {
            caseId: caseRecord.id,
            matchedRules: decision.matchedRules,
            reason: decision.reason,
          },
        });
      }
    });

    return {
      caseId,
      stage: decision.stage ?? caseRecord.stage,
      assignedTo: decision.assignedTo ?? caseRecord.assignedTo ?? 'Unassigned',
      decision: {
        matchedRules: decision.matchedRules,
        reason: decision.reason,
        assignGroup: decision.assignGroup,
      },
    };
  }

  private computeDpd(dueDate: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - dueDate.getTime();
    if (diffMs <= 0) return 0;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  private toCaseResponse(
    caseRecord: {
    id: number;
    customerId: number;
    loanId: number;
    dpd: number;
    stage: string;
    status: string;
    assignedTo: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
    extras?: { actionsCount?: number },
  ) {
    return {
      id: caseRecord.id,
      customerId: caseRecord.customerId,
      loanId: caseRecord.loanId,
      dpd: caseRecord.dpd,
      stage: caseRecord.stage,
      status: caseRecord.status,
      assignedTo: caseRecord.assignedTo ?? undefined,
      actionsCount: extras?.actionsCount,
      createdAt: caseRecord.createdAt.toISOString(),
      updatedAt: caseRecord.updatedAt.toISOString(),
    };
  }
}
