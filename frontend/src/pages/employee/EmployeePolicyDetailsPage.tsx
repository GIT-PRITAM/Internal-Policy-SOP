import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'
import { PolicyVersionHistory } from '../../components/sections/PolicyVersionHistory'
import { EmptyState } from '../../components/ui/EmptyState'
import { Policy, getPolicy, addBookmark, removeBookmark } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { acknowledgePolicy } from '../../services/acknowledgementsApi'
import { useAuth } from '../../hooks/useAuth'

function badgeToneForStatus(status: string | null | undefined): 'green' | 'indigo' | 'amber' | 'slate' {
  if (status === 'Approved') return 'green'
  if (status === 'Under Review') return 'amber'
  if (status === 'Draft') return 'slate'
  return 'indigo'
}

export default function EmployeePolicyDetailsPage() {
  const { id } = useParams()
  const { show } = useToast()

  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [acknowledging, setAcknowledging] = useState(false)

  const policyId = Number(id)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!id || Number.isNaN(policyId)) {
        setError('Invalid policy id.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const res = await getPolicy(policyId, { include_content: 1 })
        if (cancelled) return

        const next = res.data.data.policy
        setPolicy(next)
      } catch {
        if (cancelled) return
        setError('Unable to load policy details.')
        show({ tone: 'error', title: 'Load failed', message: 'Unable to fetch policy from server.' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, policyId, show])

  const summary = useMemo(() => policy?.summary ?? null, [policy])

  const handleBookmarkToggle = async () => {
    if (!policy || bookmarkLoading) return
    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        await removeBookmark(policy.id)
        setIsBookmarked(false)
        show({ tone: 'success', title: 'Bookmark removed' })
      } else {
        await addBookmark(policy.id)
        setIsBookmarked(true)
        show({ tone: 'success', title: 'Bookmark added' })
      }
    } catch {
      show({ tone: 'error', title: 'Failed', message: 'Unable to update bookmark.' })
    } finally {
      setBookmarkLoading(false)
    }
  }

  const handleAcknowledge = async () => {
    if (!policy || acknowledging) return
    setAcknowledging(true)
    try {
      await acknowledgePolicy(policy.id)
      setAcknowledged(true)
      show({ tone: 'success', title: 'Acknowledged', message: 'Your acknowledgement has been recorded.' })
    } catch {
      show({ tone: 'error', title: 'Failed', message: 'Unable to acknowledge policy.' })
    } finally {
      setAcknowledging(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-semibold">Policy Details</h1>
            <Badge tone="indigo">#{id ?? '—'}</Badge>
          </div>
          <div className="text-slate-400 mt-2">Review the latest approved version and access history.</div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-slate-300">Loading policy…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">{error}</div>
        ) : !policy ? (
          <EmptyState title="Policy not found" description="This policy may be unavailable to your role." />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-slate-200">{policy.title}</div>
                <div className="text-sm text-slate-400 mt-1">
                  {policy.updated_at ? `Last updated ${new Date(policy.updated_at).toLocaleDateString()}` : '—'}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge tone={badgeToneForStatus(policy.status)}>{policy.status}</Badge>
                <Badge tone={policy.visibility === 'Public' ? 'green' : policy.visibility === 'Department' ? 'indigo' : 'slate'}>
                  {policy.visibility}
                </Badge>
                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkLoading}
                  className={`rounded-xl px-3 py-1 text-xs font-semibold border transition ${
                    isBookmarked
                      ? 'border-fuchsia-500/30 bg-fuchsia-950 text-fuchsia-100 hover:bg-fuchsia-900/80'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {bookmarkLoading ? '…' : isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-slate-200 leading-7">
              <p className="text-slate-200/90">{summary ?? 'No summary available for this policy.'}</p>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/20 p-4">
              <div className="font-semibold">Key sections</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {policy.content ? (
                  policy.content
                    .split(/\r?\n/)
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((line, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        • {line.trim().slice(0, 90)}
                      </li>
                    ))
                ) : (
                  <li className="flex items-center gap-2">• Content not available</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {policy && (
          <>
          <PolicyVersionHistory policyId={policy.id} />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">Acknowledgements</div>
              <div className="text-sm text-slate-400 mt-1">Confirm you have reviewed this policy.</div>
            </div>

            <button
              type="button"
              disabled={policy.status !== 'Approved' || acknowledging || acknowledged}
              onClick={handleAcknowledge}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
                policy.status !== 'Approved' || acknowledged
                  ? 'border-white/10 bg-white/5 text-slate-400 cursor-not-allowed'
                  : 'border-indigo-500/30 bg-indigo-950 text-indigo-100 hover:bg-indigo-900/80'
              }`}
            >
              {acknowledging ? 'Acknowledging…' : acknowledged ? 'Acknowledged ✓' : 'Acknowledge'}
            </button>
          </div>

          <div className="mt-4">
            {acknowledged ? (
              <div className="rounded-2xl border border-green-500/20 bg-green-950/20 p-4 text-green-200 text-sm">
                You have acknowledged this policy.
              </div>
            ) : (
              <EmptyState
                title={policy.status === 'Approved' ? 'Ready to acknowledge' : 'Acknowledgement unavailable'}
                description={policy.status === 'Approved' ? 'Acknowledge this policy to record your review.' : 'Only approved policies require employee acknowledgement.'}
              />
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}