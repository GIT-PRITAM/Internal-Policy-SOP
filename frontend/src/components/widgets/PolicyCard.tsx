import { Badge } from '../ui/Badge'

export function PolicyCard({
  title,
  badge,
  badgeTone = 'indigo',
  description,
  details,
}: {
  title: string
  badge: string
  badgeTone?: 'indigo' | 'green' | 'amber' | 'red' | 'slate' | 'fuchsia'
  description?: string
  details?: string
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/20 p-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-slate-900/70">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="font-semibold text-slate-100">{title}</div>
          {description ? <p className="text-sm text-slate-400">{description}</p> : null}
        </div>
        <Badge tone={badgeTone}>{badge}</Badge>
      </div>
      {details ? <div className="text-xs text-slate-500">{details}</div> : null}
    </div>
  )
}

