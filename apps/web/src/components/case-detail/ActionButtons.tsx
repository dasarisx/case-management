type ActionButtonsProps = {
  caseId: number;
  isAssigning: boolean;
  onAssign: () => void;
  onAddAction: () => void;
};

export function ActionButtons({
  caseId,
  isAssigning,
  onAssign,
  onAddAction,
}: ActionButtonsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">Quick Actions</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onAssign}
          disabled={isAssigning}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isAssigning ? 'Running...' : 'Run Assignment'}
        </button>
        <a
          href={`/api/cases/${caseId}/notice.pdf`}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm"
        >
          Generate PDF
        </a>
        <button
          onClick={onAddAction}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm"
        >
          Add Action
        </button>
      </div>
    </div>
  );
}
