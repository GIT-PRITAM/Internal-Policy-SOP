import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { ApprovalItem } from '../../services/api'

export default function AdminReviewApprovalCard({
  approval,
  onDecide,
}: {
  approval: ApprovalItem
  onDecide: (decision: 'Approved' | 'Rejected', comments: string | null) => Promise<void>
}) {
  const [comments, setComments] = useState<string>(approval.comments ?? '')
  const [submitting, setSubmitting] = useState(false)

  const canAct = approval.status === 'Pending'

  const handle = async (decision: 'Approved' | 'Rejected') => {
    if (!canAct || submitting) return
    setSubmitting(true)
    try {
      await onDecide(decision, comments.trim() ? comments.trim() : null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="text-lg font-semibold text-slate-100">Policy #{approval.policy_document_id}</div>
          <div className="text-sm text-slate-400">Approver: {approval.approver?.name ?? approval.approver_user_id}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="amber">{approval.status}</Badge>
          <span className="text-sm text-slate-400">{approval.action_at ? new Date(approval.action_at).toLocaleString() : 'Awaiting action'}</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-200">Reviewer comments</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="mt-2 w-full min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500/50"
          placeholder="Add notes for the decision (optional)."
          disabled={!canAct || submitting}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handle('Approved')}
          disabled={!canAct || submitting}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
        >
          {submitting ? 'Approving…' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => handle('Rejected')}
          disabled={!canAct || submitting}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
        >
          {submitting ? 'Rejecting…' : 'Reject'}
        </button>
      </div>
    </div>
  )
}

