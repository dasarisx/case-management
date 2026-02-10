type BadgeTone = 'slate' | 'blue' | 'amber' | 'emerald';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
};

export function Badge({ label, tone = 'slate' }: BadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}
