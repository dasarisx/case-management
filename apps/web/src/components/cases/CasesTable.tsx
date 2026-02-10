type CaseListItem = {
  id: number;
  customer: { name: string };
  dpd: number;
  stage: string;
  status: string;
  assignedTo?: string | null;
  actionsCount: number;
};

type CasesTableProps = {
  cases: CaseListItem[];
  loading: boolean;
  onRowClick: (id: number) => void;
};

export function CasesTable({ cases, loading, onRowClick }: CasesTableProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">DPD</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  <td className="px-4 py-3" colSpan={7}>
                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : cases.length > 0 ? (
              cases.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => onRowClick(row.id)}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    #{row.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {row.customer.name}
                  </td>
                  <td className="px-4 py-3">{row.dpd}</td>
                  <td className="px-4 py-3">{row.stage}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">{row.assignedTo ?? 'Unassigned'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {row.actionsCount}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-6 text-center text-slate-500"
                  colSpan={7}
                >
                  No cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`card-${i}`}
              className="h-28 animate-pulse rounded-lg bg-slate-100"
            />
          ))
        ) : cases.length > 0 ? (
          cases.map((row) => (
            <button
              key={row.id}
              onClick={() => onRowClick(row.id)}
              className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Case #{row.id}</div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  {row.actionsCount} actions
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-700">
                {row.customer.name}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>DPD {row.dpd}</span>
                <span>{row.stage}</span>
                <span>{row.status}</span>
                <span>{row.assignedTo ?? 'Unassigned'}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500">
            No cases found.
          </div>
        )}
      </div>
    </div>
  );
}

export type { CaseListItem };
