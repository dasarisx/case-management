import type { UseFormRegister } from 'react-hook-form';

type CreateCaseForm = {
  customerId: string;
  loanId: string;
};

type CreateCaseModalProps = {
  isOpen: boolean;
  error: string | null;
  isSubmitting: boolean;
  register: UseFormRegister<CreateCaseForm>;
  onSubmit: () => void;
  onClose: () => void;
};

export function CreateCaseModal({
  isOpen,
  error,
  isSubmitting,
  register,
  onSubmit,
  onClose,
}: CreateCaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Case</h2>
          <button onClick={onClose} className="text-slate-500">
            x
          </button>
        </div>
        {error && (
          <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Customer ID"
            type="number"
            {...register('customerId', { required: true })}
          />
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Loan ID"
            type="number"
            {...register('loanId', { required: true })}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export type { CreateCaseForm };
