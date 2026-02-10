type Kpi = {
  openCount: number;
  resolvedToday: number;
  avgDpdOpen: number;
};

type KpiCardsProps = {
  kpi?: Kpi;
  loading: boolean;
};

function KpiCard({
  title,
  value,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  trend?: string;
  color: 'blue' | 'green' | 'orange';
}) {
  const styles = {
    blue: 'bg-blue-500/10 text-blue-700 border-blue-200',
    green: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-500/10 text-orange-700 border-orange-200',
  };

  return (
    <div className={`rounded-xl border px-5 py-4 shadow-sm ${styles[color]}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{title}</span>
        {trend ? (
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold">
            {trend}
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 text-xs text-slate-500">Last 24 hours</div>
    </div>
  );
}

export function KpiCards({ kpi, loading }: KpiCardsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <KpiCard
        title="Open Cases"
        value={loading ? '...' : kpi?.openCount ?? 0}
        trend="+12%"
        color="blue"
      />
      <KpiCard
        title="Resolved Today"
        value={loading ? '...' : kpi?.resolvedToday ?? 0}
        color="green"
      />
      <KpiCard
        title="Avg DPD Open"
        value={loading ? '...' : (kpi?.avgDpdOpen ?? 0).toFixed(1)}
        color="orange"
      />
    </div>
  );
}
