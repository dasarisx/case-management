import { Badge } from '@/components/common/Badge';

type CaseHeaderProps = {
  id: number;
  customerName: string;
  dpd: number;
  stage: string;
  status: string;
  assignedTo?: string | null;
};

export function CaseHeader({
  id,
  customerName,
  dpd,
  stage,
  status,
  assignedTo,
}: CaseHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">
        Case #{id} - {customerName} - DPD {dpd}
      </h1>
      <div className="flex flex-wrap gap-2 text-sm text-slate-600">
        <Badge label={stage} tone="blue" />
        <Badge label={status} tone="slate" />
        <span>{assignedTo ?? 'Unassigned'}</span>
      </div>
    </div>
  );
}
