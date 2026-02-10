type ActionLog = {
  id: number;
  type: string;
  outcome: string;
  notes?: string | null;
  createdAt: string;
};

type ActionsTableProps = {
  actions: ActionLog[];
};

export function ActionsTable({ actions }: ActionsTableProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
        Recent Actions
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Outcome</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {actions.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-center text-slate-500" colSpan={4}>
                  No actions recorded yet.
                </td>
              </tr>
            ) : (
              actions.map((action) => (
                <tr key={action.id}>
                  <td className="px-4 py-3">
                    {new Date(action.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{action.type}</td>
                  <td className="px-4 py-3">{action.outcome}</td>
                  <td className="px-4 py-3">{action.notes ?? 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { ActionLog };
