import { Badge } from '@/components/common/Badge';

type Customer = {
  name: string;
  email: string;
  phone?: string | null;
  riskScore: number;
};

type Loan = {
  id: number;
  principal: number;
  outstanding: number;
  dueDate: string;
  status: string;
};

type SummaryCardsProps = {
  customer: Customer;
  loan: Loan;
  stage: string;
  status: string;
  assignedTo?: string | null;
  createdAt: string;
  riskTone: 'slate' | 'blue' | 'amber' | 'emerald';
};

export function SummaryCards({
  customer,
  loan,
  stage,
  status,
  assignedTo,
  createdAt,
  riskTone,
}: SummaryCardsProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Customer</h3>
        <div className="mt-3 text-lg font-semibold">{customer.name}</div>
        <div className="mt-2 text-sm text-slate-600">{customer.email}</div>
        <div className="mt-1 text-sm text-slate-600">
          {customer.phone ?? 'No phone'}
        </div>
        <div className="mt-3">
          <Badge label={`Risk ${customer.riskScore}`} tone={riskTone} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Loan</h3>
        <div className="mt-3 text-sm text-slate-600">ID #{loan.id}</div>
        <div className="mt-2 text-lg font-semibold">
          ${loan.outstanding.toLocaleString()}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Principal: ${loan.principal.toLocaleString()}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Due: {new Date(loan.dueDate).toLocaleDateString()}
        </div>
        <div className="mt-1 text-sm text-slate-600">Status: {loan.status}</div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Case Status</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge label={stage} tone="blue" />
          <Badge label={status} tone="slate" />
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Assigned: {assignedTo ?? 'Unassigned'}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Created: {new Date(createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
