'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { KpiCards } from '@/components/cases/KpiCards';
import { FiltersForm, type FiltersFormValues } from '@/components/cases/FiltersForm';
import { CasesTable, type CaseListItem } from '@/components/cases/CasesTable';
import { CasesPagination } from '@/components/cases/CasesPagination';
import { CreateCaseModal, type CreateCaseForm } from '@/components/cases/CreateCaseModal';

const PAGE_SIZE = 10;

type Kpi = {
  openCount: number;
  resolvedToday: number;
  avgDpdOpen: number;
};

type CasesResponse = {
  data: CaseListItem[];
  page: number;
  limit: number;
  offset: number;
  total?: number;
  totalPages?: number;
};

const fetcher = <T,>(url: string) => apiFetch<T>(url);

export default function CasesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FiltersFormValues>({
    status: '',
    stage: '',
    dpdMin: '',
    dpdMax: '',
    assignedTo: '',
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: filters,
  });

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: createState,
  } = useForm<CreateCaseForm>({
    defaultValues: { customerId: '', loanId: '' },
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.stage) params.set('stage', filters.stage);
    if (filters.assignedTo) params.set('assignedTo', filters.assignedTo);
    if (filters.dpdMin) params.set('dpdMin', filters.dpdMin);
    if (filters.dpdMax) params.set('dpdMax', filters.dpdMax);
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    return params.toString();
  }, [filters, page]);

  const {
    data: kpi,
    isLoading: kpiLoading,
    error: kpiError,
  } = useSWR<Kpi>('/cases/kpi', fetcher, { refreshInterval: 30000 });

  const {
    data: casesData,
    isLoading: casesLoading,
    error: casesError,
    mutate: mutateCases,
  } = useSWR<CasesResponse>(`/cases?${queryString}`, fetcher);

  const onApply = handleSubmit((values) => {
    setFilters(values);
    setPage(1);
  });

  const onClear = () => {
    const cleared: FiltersFormValues = {
      status: '',
      stage: '',
      dpdMin: '',
      dpdMax: '',
      assignedTo: '',
    };
    reset(cleared);
    setFilters(cleared);
    setPage(1);
  };

  const onCreateCase = handleCreateSubmit(async (values) => {
    setCreateError(null);
    try {
      await apiFetch('/cases', {
        method: 'POST',
        body: JSON.stringify({
          customerId: Number(values.customerId),
          loanId: Number(values.loanId),
        }),
      });
      resetCreate();
      setIsCreateOpen(false);
      await mutateCases();
    } catch (err) {
      setCreateError('Failed to create case.');
    }
  });

  const cases = casesData?.data ?? [];
  const totalPages = casesData?.totalPages;
  const totalCount = casesData?.total;
  const hasNextPage =
    typeof totalPages === 'number' ? page < totalPages : cases.length === PAGE_SIZE;
  const rangeStart = totalCount ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = totalCount ? Math.min(page * PAGE_SIZE, totalCount) : 0;

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Collections Dashboard</h1>
          <p className="text-sm text-slate-500">
            Track delinquency performance and assign cases instantly.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Create Case
        </button>
      </div>

      {(kpiError || casesError) && (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load dashboard data. Please refresh.
        </div>
      )}

      <KpiCards kpi={kpi} loading={kpiLoading} />

      <FiltersForm register={register} onSubmit={onApply} onClear={onClear} />

      <CasesTable
        cases={cases}
        loading={casesLoading}
        onRowClick={(id) => router.push(`/cases/${id}`)}
      />

      <CasesPagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        hasNextPage={hasNextPage}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <CreateCaseModal
        isOpen={isCreateOpen}
        error={createError}
        isSubmitting={createState.isSubmitting}
        register={registerCreate}
        onSubmit={onCreateCase}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateError(null);
        }}
      />
    </main>
  );
}
