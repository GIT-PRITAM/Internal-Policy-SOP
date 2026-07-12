import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'
import { PolicyCard } from '../../components/widgets/PolicyCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { listBookmarks, removeBookmark, type Policy } from '../../services/api'
import { useToast } from '../../hooks/useToast'

export default function EmployeeBookmarksPage() {
  const navigate = useNavigate()
  const { show } = useToast()

  const [bookmarks, setBookmarks] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await listBookmarks({ per_page: 50 })
        if (cancelled) return
        const data = res.data
        const items = Array.isArray(data.data) ? data.data : (data.data as any)?.items ?? []
        setBookmarks(items)
      } catch {
        if (!cancelled) setError('Unable to load bookmarks.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleRemove = async (policyId: number) => {
    setRemovingIds((prev) => new Set(prev).add(policyId))
    try {
      await removeBookmark(policyId)
      setBookmarks((prev) => prev.filter((b) => b.id !== policyId))
      show({ tone: 'success', title: 'Bookmark removed' })
    } catch {
      show({ tone: 'error', title: 'Failed', message: 'Unable to remove bookmark.' })
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(policyId)
        return next
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-semibold">Bookmarks</div>
          <div className="text-slate-400 mt-1">Your saved policies for quick access.</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge tone="fuchsia">{bookmarks.length} saved</Badge>
              <div className="text-sm text-slate-300">Keep track of what matters.</div>
            </div>
            <div className="text-xs text-slate-400">Syncs with your account</div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
          ) : null}

          <div className="mt-4 space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : bookmarks.length === 0 ? (
              <EmptyState title="No bookmarks yet" description="Browse policies and bookmark them for quick access." />
            ) : (
              bookmarks.map((policy) => (
                <div key={policy.id} className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => navigate(`/employee/policies/${policy.id}`)}
                        className="font-semibold text-slate-100 hover:text-indigo-300 text-left"
                      >
                        {policy.title}
                      </button>
                      {policy.summary ? (
                        <div className="text-sm text-slate-400 mt-1 line-clamp-2">{policy.summary}</div>
                      ) : null}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge tone="fuchsia">Bookmarked</Badge>
                        <Badge tone={policy.visibility === 'Public' ? 'green' : policy.visibility === 'Department' ? 'indigo' : 'slate'}>
                          {policy.visibility}
                        </Badge>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={removingIds.has(policy.id)}
                      onClick={() => handleRemove(policy.id)}
                      className="shrink-0 rounded-xl border border-red-500/20 bg-red-950/30 px-3 py-2 text-xs text-red-100 transition hover:bg-red-950/50 disabled:opacity-60"
                    >
                      {removingIds.has(policy.id) ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}