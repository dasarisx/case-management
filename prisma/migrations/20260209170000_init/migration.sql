-- Create enums
CREATE TYPE "CaseStage" AS ENUM ('SOFT', 'HARD', 'LEGAL');
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE "ActionType" AS ENUM ('CALL', 'SMS', 'EMAIL', 'WHATSAPP');
CREATE TYPE "ActionOutcome" AS ENUM ('NO_ANSWER', 'PROMISE_TO_PAY', 'PAID', 'WRONG_NUMBER');

-- Create tables
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "riskScore" SMALLINT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "principal" DECIMAL(14,2) NOT NULL,
    "outstanding" DECIMAL(14,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "loanId" INTEGER NOT NULL,
    "dpd" SMALLINT NOT NULL,
    "stage" "CaseStage" NOT NULL,
    "status" "CaseStatus" NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActionLog" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "type" "ActionType" NOT NULL,
    "outcome" "ActionOutcome" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RuleDecision" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "matchedRules" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuleDecision_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE INDEX "Case_status_stage_dpd_idx" ON "Case"("status", "stage", "dpd");
CREATE INDEX "Case_assignedTo_idx" ON "Case"("assignedTo");
CREATE INDEX "ActionLog_caseId_createdAt_idx" ON "ActionLog"("caseId", "createdAt");

-- Foreign keys
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Case" ADD CONSTRAINT "Case_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Case" ADD CONSTRAINT "Case_loanId_fkey"
    FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ActionLog" ADD CONSTRAINT "ActionLog_caseId_fkey"
    FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RuleDecision" ADD CONSTRAINT "RuleDecision_caseId_fkey"
    FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
