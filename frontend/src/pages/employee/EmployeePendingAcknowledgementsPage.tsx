import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { listCompletedAcknowledgements, type AcknowledgementPolicyItem, type AcknowledgementsMeta } from '../../services/acknowledgementsApi'
import { useAppData } from '../../context/AppDataContext'

// NOTE: This file intentionally keeps the same UI layout as the old pending page,
// but now renders completed acknowledgement history.



export default function EmployeePendingAcknowledgementsPage() {
  const navigate = useNavigate()

  const { state: appData, setState } = useAppData()
  const cached = appData.employeeAcknowledgementsCompleted

  const [items, setItems] = useState<AcknowledgementPolicyItem[]>([])
  const [meta, setMeta] = useState<AcknowledgementsMeta | null>(null)
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const perPage = 10

  useEffect(() => {
    let cancelled = false

    async function load() {
      // First visit: fetch + skeleton.
      // Revisit: immediately render cached data from AppDataContext (no API call).
      if (cached) {
        setItems(cached.items)
        setMeta(cached.meta)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const res = await listCompletedAcknowledgements({ per_page: perPage, page })
        if (cancelled) return
        const data = res.data
        const nextItems: AcknowledgementPolicyItem[] = Array.isArray(data.data) ? data.data : (data.data as any)?.items ?? []
        setItems(nextItems)
        setMeta(data.meta ?? null)

        // Store only first-page result for fast revisits.
        if (page === 1) {
          setState((prev) => ({
            ...prev,
            employeeAcknowledgementsCompleted: {
              items: nextItems,
              meta: data.meta,
            },
          }))
        }
      } catch {
        if (!cancelled) setError('Unable to load acknowledgement history.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page, cached, setState])



  const handleWithdrawAcknowledgement = async (policyId: number) => {
    // TODO: Backend support for withdrawing/revoking acknowledgements.
    // Until then, this button remains disabled.
    void policyId
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-semibold">Acknowledgement History</div>
          <div className="text-slate-400 mt-1">Policies you have already acknowledged.</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">Acknowledged Policies</div>
              <div className="text-sm text-slate-400 mt-1">Your acknowledgement records.</div>
            </div>
            {meta ? <Badge tone="green">{meta.total} acknowledged</Badge> : null}
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
          ) : null}

          <div className="mt-5 space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : items.length === 0 ? (
              <EmptyState title="No acknowledgements yet" description="You haven't acknowledged any policies yet." />
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => navigate(`/employee/policies/${item.id}`)}
                        className="font-semibold text-slate-100 hover:text-indigo-300 text-left"
                      >
                        {item.title}
                      </button>
                      {item.summary ? (
                        <div className="text-sm text-slate-400 mt-1 line-clamp-2">{item.summary}</div>
                      ) : null}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge tone={item.mandatory ? 'amber' : 'slate'}>
                          {item.mandatory ? 'Mandatory' : 'Optional'}
                        </Badge>
                        <Badge tone="indigo">{item.visibility}</Badge>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={true}
                      onClick={() => handleWithdrawAcknowledgement(item.id)}
                      className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 shadow-soft transition hover:bg-white/10 disabled:opacity-50"
                    >
                      Withdraw Acknowledgement
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {meta && meta.last_page > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm text-slate-400">Page {page} of {meta.last_page}</div>
              <button
                type="button"
                disabled={page >= meta.last_page || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  )
}