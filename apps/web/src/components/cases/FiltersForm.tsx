import type { UseFormRegister } from 'react-hook-form';

type FiltersFormValues = {
  status: string;
  stage: string;
  dpdMin: string;
  dpdMax: string;
  assignedTo: string;
};

type FiltersFormProps = {
  register: UseFormRegister<FiltersFormValues>;
  onSubmit: () => void;
  onClear: () => void;
};

export function FiltersForm({ register, onSubmit, onClear }: FiltersFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <select
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          {...register('status')}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          {...register('stage')}
        >
          <option value="">All Stages</option>
          <option value="SOFT">SOFT</option>
          <option value="HARD">HARD</option>
          <option value="LEGAL">LEGAL</option>
        </select>

        <input
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="DPD min"
          type="number"
          {...register('dpdMin')}
        />

        <input
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="DPD max"
          type="number"
          {...register('dpdMax')}
        />

        <input
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Assigned to"
          {...register('assignedTo')}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

export type { FiltersFormValues };
