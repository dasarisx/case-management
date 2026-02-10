'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiFetch } from '@/lib/api';
import { CaseHeader } from '@/components/case-detail/CaseHeader';
import { SummaryCards } from '@/components/case-detail/SummaryCards';
import { ActionButtons } from '@/components/case-detail/ActionButtons';
import { ActionsTable, type ActionLog } from '@/components/case-detail/ActionsTable';
import { AddActionModal, type ActionForm } from '@/components/case-detail/AddActionModal';

const fetcher = <T,>(url: string) => apiFetch<T>(url);

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

type CaseDetail = {
  id: number;
  dpd: number;
  stage: string;
  status: string;
  assignedTo?: string | null;
  createdAt: string;
  customer: Customer;
  loan: Loan;
  actionLogs: ActionLog[];
};

export default function CaseDetailsPage() {
  const params = useParams();
  const caseId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [isAssigning, setIsAssigning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, error, mutate } = useSWR<CaseDetail>(
    caseId ? `/cases/${caseId}` : null,
    fetcher,
  );

  const { register, handleSubmit, reset, formState } = useForm<ActionForm>({
    defaultValues: { type: '', outcome: '', notes: '' },
  });

  const riskTone = useMemo(() => {
    const score = data?.customer.riskScore ?? 0;
    if (score >= 80) return 'amber';
    if (score >= 60) return 'blue';
    return 'emerald';
  }, [data?.customer.riskScore]);

  const onAssign = async () => {
    if (!caseId) return;
    setIsAssigning(true);
    setActionError(null);
    try {
      await apiFetch(`/cases/${caseId}/assign`, { method: 'POST' });
      await mutate();
    } catch (err) {
      setActionError('Failed to run assignment.');
    } finally {
      setIsAssigning(false);
    }
  };

  const onAddAction = handleSubmit(async (values) => {
    if (!caseId) return;
    setActionError(null);
    try {
      await apiFetch(`/cases/${caseId}/actions`, {
        method: 'POST',
        body: JSON.stringify({
          type: values.type,
          outcome: values.outcome,
          notes: values.notes || undefined,
        }),
      });
      reset();
      setIsModalOpen(false);
      await mutate();
    } catch (err) {
      setActionError('Failed to add action.');
    }
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Unable to load case details.
        </div>
      </main>
    );
  }

  const actions = data.actionLogs?.slice(0, 10) ?? [];

  return (
    <main className="mx-auto max-w-4xl p-8">
      <CaseHeader
        id={data.id}
        customerName={data.customer.name}
        dpd={data.dpd}
        stage={data.stage}
        status={data.status}
        assignedTo={data.assignedTo}
      />

      {actionError && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </div>
      )}

      <SummaryCards
        customer={data.customer}
        loan={data.loan}
        stage={data.stage}
        status={data.status}
        assignedTo={data.assignedTo}
        createdAt={data.createdAt}
        riskTone={riskTone}
      />

      <div className="mt-4">
        <ActionButtons
          caseId={data.id}
          isAssigning={isAssigning}
          onAssign={onAssign}
          onAddAction={() => setIsModalOpen(true)}
        />
      </div>

      <ActionsTable actions={actions} />

      <AddActionModal
        isOpen={isModalOpen}
        error={actionError}
        isSubmitting={formState.isSubmitting}
        register={register}
        onSubmit={onAddAction}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
