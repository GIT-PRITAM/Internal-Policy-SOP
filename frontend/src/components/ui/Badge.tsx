export function Badge({
  children,
  tone = 'indigo',
}: {
  children: React.ReactNode
  tone?: 'indigo' | 'green' | 'amber' | 'red' | 'fuchsia' | 'slate'
}) {

  const cls =
    tone === 'indigo'
      ? 'bg-indigo-500/15 text-indigo-200 border-indigo-400/20'
      : tone === 'green'
        ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20'
        : tone === 'amber'
          ? 'bg-amber-500/15 text-amber-200 border-amber-400/20'
          : tone === 'red'
            ? 'bg-red-500/15 text-red-200 border-red-400/20'
            : 'bg-slate-500/10 text-slate-200 border-slate-500/20'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${cls}`}>
      {children}
    </span>
  )
}

