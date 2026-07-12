export function StatCard({
  title,
  value,
  description,
  delta,
  tone = 'indigo',
}: {
  title: string
  value: string | number
  description?: string
  delta?: string
  tone?: 'indigo' | 'fuchsia' | 'amber' | 'green'
}) {
  const toneCls =
    tone === 'indigo'
      ? 'border-indigo-400/25 bg-indigo-500/10 text-indigo-100'
      : tone === 'fuchsia'
        ? 'border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-100'
        : tone === 'amber'
          ? 'border-amber-400/25 bg-amber-500/10 text-amber-100'
          : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100'

  return (
    <div
      className={`rounded-2xl border ${toneCls} p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col`}
    > 
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-3xl font-semibold text-slate-100">{value}</div>
        {delta ? (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
            {delta}
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-300 flex-1">
        {description ? description : <span className="opacity-0">—</span>}
      </div>
    </div>
  )
}

