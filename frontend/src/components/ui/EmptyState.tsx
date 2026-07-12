import { CubeIcon } from '@heroicons/react/24/outline'

export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl border border-white/10 bg-slate-950/30 flex items-center justify-center">
          <CubeIcon className="h-5 w-5 text-indigo-200" />
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          {description ? <div className="mt-1 text-sm text-slate-400">{description}</div> : null}
        </div>
      </div>
    </div>
  )
}

