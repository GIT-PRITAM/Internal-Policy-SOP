import { useEffect, useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'
import { listApprovals, ApprovalItem } from '../../services/api'
import { decideApproval } from '../../services/approvalsApi'
import { useToast } from '../../hooks/useToast'
import AdminReviewApprovalCard from './AdminReviewApprovalCard'


export default function AdminReviewBoardPage() {
  const { show } = useToast()
  const [items, setItems] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const response = await listApprovals({ per_page: 20, status: 'Pending' })
        setItems(response.data.data.items)
      } catch (err) {
        setError('Unable to load review board.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

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
                    show({ tone: 'success', title: 'Decision saved', message: decision === 'Approved' ? 'Policy approved.' : 'Policy rejected.' })

                    // Refresh board automatically
                    const refreshed = await listApprovals({ per_page: 20, status: 'Pending' })
                    setItems(refreshed.data.data.items)
                  } catch {
                    show({ tone: 'error', title: 'Unable to save decision', message: 'Please try again.' })
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
