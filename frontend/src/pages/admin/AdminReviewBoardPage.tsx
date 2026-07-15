import { useEffect, useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import { listApprovals, ApprovalItem } from '../../services/api'
import { decideApproval } from '../../services/approvalsApi'
import { useToast } from '../../hooks/useToast'
import AdminReviewApprovalCard from './AdminReviewApprovalCard'
import { useAppData } from '../../context/AppDataContext'

export default function AdminReviewBoardPage() {
  const { show } = useToast()
  const { state: appData, setState } = useAppData()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const items = appData.adminReviewBoard?.items ?? []
  const hasData = Boolean(appData.adminReviewBoard)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (hasData) return
      setLoading(true)
      try {
        const response = await listApprovals({ per_page: 20, status: 'Pending' })
        if (cancelled) return
        setState((prev) => ({
          ...prev,
          adminReviewBoard: { items: response.data.data.items },
        }))
      } catch {
        if (cancelled) return
        setError('Unable to load review board.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [hasData, setState])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-semibold">Review board</div>
          <div className="text-slate-400 mt-1">Pending approvals and review actions in one place.</div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading pending approvals…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">No pending approvals were found.</div>
        ) : (
          <div className="space-y-4">
            {items.map((approval) => (
              <AdminReviewApprovalCard
                key={approval.id}
                approval={approval}
                onDecide={async (decision, comments) => {
                  const ok = window.confirm(
                    decision === 'Approved'
                      ? 'Approve this policy? This will update its status to Approved.'
                      : 'Reject this policy? This will update its status back to Draft.'
                  )
                  if (!ok) return

                  try {
                    await decideApproval(approval.id, { decision, comments })
                    show({
                      tone: 'success',
                      title: 'Decision saved',
                      message:
                        decision === 'Approved'
                          ? 'Policy approved.'
                          : 'Policy rejected.',
                    })

                    // Update context immediately; do not refetch.
                    setState((prev) => {
                      const current = prev.adminReviewBoard?.items ?? []
                      return {
                        ...prev,
                        adminReviewBoard: {
                          items: current.filter((i) => i.id !== approval.id),
                        },
                      }
                    })
                  } catch {
                    show({
                      tone: 'error',
                      title: 'Unable to save decision',
                      message: 'Please try again.',
                    })
                  }
                }}
              />
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  )
}

