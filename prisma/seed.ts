const { PrismaClient, ActionOutcome, ActionType, CaseStage, CaseStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const targetCustomers = 25;
  const targetLoans = 40;
  const targetCases = 60;

  const existingCustomers = await prisma.customer.count();
  const existingLoans = await prisma.loan.count();
  const existingCases = await prisma.case.count();

  if (existingCustomers < targetCustomers) {
    const toCreate = targetCustomers - existingCustomers;
    for (let i = 1; i <= toCreate; i += 1) {
      const index = existingCustomers + i;
      await prisma.customer.create({
        data: {
          name: `Customer ${index}`,
          phone: `+97150${String(1000000 + index).slice(-7)}`,
          email: `customer.${index}@example.com`,
          country: 'UAE',
          riskScore: 50 + (index % 50),
        },
      });
    }
  }

  const customers = await prisma.customer.findMany({ orderBy: { id: 'asc' } });

  if (existingLoans < targetLoans) {
    const toCreate = targetLoans - existingLoans;
    for (let i = 1; i <= toCreate; i += 1) {
      const index = existingLoans + i;
      const customer = customers[index % customers.length];
      const principal = 10000 + (index % 20) * 2500;
      const outstanding = principal - (index % 5) * 500;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - (index % 60));
      await prisma.loan.create({
        data: {
          customerId: customer.id,
          principal,
          outstanding,
          dueDate,
          status: index % 3 === 0 ? 'DEFAULTED' : 'OPEN',
        },
      });
    }
  }

  const loans = await prisma.loan.findMany({ orderBy: { id: 'asc' } });

  if (existingCases < targetCases) {
    const toCreate = targetCases - existingCases;
    for (let i = 1; i <= toCreate; i += 1) {
      const index = existingCases + i;
      const loan = loans[index % loans.length];
      const dpd = (index * 3) % 65;
      const stage =
        dpd > 30 ? CaseStage.LEGAL : dpd > 7 ? CaseStage.HARD : CaseStage.SOFT;
      const status =
        index % 7 === 0
          ? CaseStatus.RESOLVED
          : index % 5 === 0
            ? CaseStatus.IN_PROGRESS
            : CaseStatus.OPEN;
      const assignedTo =
        stage === CaseStage.LEGAL
          ? 'legal.uae'
          : `agent.${String(index % 5).padStart(2, '0')}`;

      const createdCase = await prisma.case.create({
        data: {
          customerId: loan.customerId,
          loanId: loan.id,
          dpd,
          stage,
          status,
          assignedTo,
        },
      });

      if (index % 2 === 0) {
        await prisma.actionLog.create({
          data: {
            caseId: createdCase.id,
            type: ActionType.CALL,
            outcome: ActionOutcome.PROMISE_TO_PAY,
            notes: 'Auto-seeded action log.',
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
