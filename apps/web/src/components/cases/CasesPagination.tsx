type CasesPaginationProps = {
  page: number;
  totalPages?: number;
  totalCount?: number;
  rangeStart: number;
  rangeEnd: number;
  hasNextPage: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function CasesPagination({
  page,
  totalPages,
  totalCount,
  rangeStart,
  rangeEnd,
  hasNextPage,
  onPrev,
  onNext,
}: CasesPaginationProps) {
  const summary =
    typeof totalCount === 'number'
      ? `Showing ${rangeStart}-${rangeEnd} of ${totalCount}`
      : `Page ${page}`;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
      <div className="text-slate-500">
        {summary}
        {typeof totalPages === 'number' ? ` (Page ${page} of ${totalPages})` : ''}
      </div>
      <nav className="flex items-center gap-2">
        <button
          className="rounded-md border border-slate-200 px-3 py-1 disabled:opacity-50"
          onClick={onPrev}
          disabled={page === 1}
        >
          &lt;
        </button>
        <span className="rounded-md bg-slate-900 px-3 py-1 text-white">
          {page}
        </span>
        <button
          className="rounded-md border border-slate-200 px-3 py-1 disabled:opacity-50"
          onClick={onNext}
          disabled={!hasNextPage}
        >
          &gt;
        </button>
      </nav>
    </div>
  );
}
