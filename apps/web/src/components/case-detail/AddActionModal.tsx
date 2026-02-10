import type { UseFormRegister } from 'react-hook-form';

type ActionForm = {
  type: string;
  outcome: string;
  notes: string;
};

type AddActionModalProps = {
  isOpen: boolean;
  error: string | null;
  isSubmitting: boolean;
  register: UseFormRegister<ActionForm>;
  onSubmit: () => void;
  onClose: () => void;
};

export function AddActionModal({
  isOpen,
  error,
  isSubmitting,
  register,
  onSubmit,
  onClose,
}: AddActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Action</h2>
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
          <select
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            {...register('type', { required: true })}
          >
            <option value="">Select type</option>
            <option value="CALL">CALL</option>
            <option value="SMS">SMS</option>
            <option value="EMAIL">EMAIL</option>
            <option value="WHATSAPP">WHATSAPP</option>
          </select>
          <select
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            {...register('outcome', { required: true })}
          >
            <option value="">Select outcome</option>
            <option value="NO_ANSWER">NO_ANSWER</option>
            <option value="PROMISE_TO_PAY">PROMISE_TO_PAY</option>
            <option value="PAID">PAID</option>
            <option value="WRONG_NUMBER">WRONG_NUMBER</option>
          </select>
          <textarea
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Notes"
            rows={3}
            {...register('notes')}
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
              {isSubmitting ? 'Saving...' : 'Add Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export type { ActionForm };
