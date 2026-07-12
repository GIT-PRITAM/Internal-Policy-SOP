import { useEffect, useState } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { listPolicyVersions, type PolicyVersion } from '../../services/versionsApi'
import { Skeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { Badge } from '../ui/Badge'

type Props = {
  policyId: number
  refreshKey?: number
}

export function PolicyVersionHistory({ policyId, refreshKey = 0 }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [versions, setVersions] = useState<PolicyVersion[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 10

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await listPolicyVersions(policyId, { per_page: perPage, page, sort_by: 'version_number', sort_dir: 'desc' })
        if (cancelled) return
        const data = res.data
        // Handle both wrapped and unwrapped responses
        const items = Array.isArray(data) ? data : (data as any).data ?? []
        const meta = (data as any).meta ?? null
        setVersions(items)
        if (meta) setTotal(meta.total)
      } catch {
        if (cancelled) return
        setError('Unable to load version history.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [policyId, page, refreshKey])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Version History</div>
          <div className="text-sm text-slate-400 mt-1">Track changes and approvals over time.</div>
        </div>
        <div className="h-10 w-10 rounded-xl border border-white/10 bg-slate-950/30 flex items-center justify-center">
          <ClockIcon className="h-5 w-5 text-indigo-200" />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      ) : null}

      <div className="mt-4 space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : versions.length === 0 ? (
          <EmptyState title="No versions yet" description="Version history will appear here after the first update." />
        ) : (
          versions.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-white/10 bg-slate-950/20">
              <div>
                <div className="font-medium">v{v.version_number}{v.title ? ` — ${v.title}` : ''}</div>
                <div className="text-xs text-slate-400">
                  {v.approved_at ? 'Approved' : 'Draft'} • {v.creator?.name ?? `User #${v.created_by}`}
                  {v.change_summary ? ` • ${v.change_summary}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {v.approved_at ? <Badge tone="green">Approved</Badge> : <Badge tone="slate">Draft</Badge>}
                <div className="text-sm text-slate-300">
                  {v.created_at ? new Date(v.created_at).toLocaleDateString() : '—'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {total > perPage ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm text-slate-400">Page {page} of {Math.ceil(total / perPage)}</div>
          <button
            type="button"
            disabled={loading || page >= Math.ceil(total / perPage)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}