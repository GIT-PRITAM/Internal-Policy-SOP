import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { ApprovalItem } from '../../services/api'

export default function AdminReviewApprovalCard({
  approval,
  onDecide,
  isApprover,
}: {
  approval: ApprovalItem
  onDecide: (decision: 'Approved' | 'Rejected', comments: string | null) => Promise<void>
  isApprover: boolean
}) {

  const [comments, setComments] = useState<string>(approval.comments ?? '')
  const [submitting, setSubmitting] = useState(false)

  const canAct = approval.status === 'Pending' && isApprover

  const handle = async (decision: 'Approved' | 'Rejected') => {
    if (!canAct || submitting) return
    setSubmitting(true)
    try {
      await onDecide(decision, comments.trim() ? comments.trim() : null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCommentOnly = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await onDecide('Approved', comments.trim() ? comments.trim() : null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <div className="text-2xl font-semibold text-slate-100 leading-tight">Policy #{approval.policy_document_id}</div>
            <div className="text-lg font-semibold text-indigo-200/90">• {((approval as any).policy_document_title ?? (approval as any).policy_document?.title ?? 'Policy title')}</div>
          </div>
          <div className="text-sm text-slate-400">Approver: {approval.approver?.name ?? `User #${approval.approver_user_id}`}</div>
          {!isApprover && approval.status === 'Pending' ? (
            <div className="text-xs text-amber-400 mt-1">You can comment but only the assigned approver can decide.</div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="amber">{approval.status}</Badge>
          <span className="text-sm text-slate-400">{approval.action_at ? new Date(approval.action_at).toLocaleString() : 'Awaiting action'}</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-200">
          {isApprover ? 'Reviewer comments' : 'Add a comment'}
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="mt-2 w-full min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500/50"
          placeholder="Add notes for the decision (optional)."
          disabled={submitting}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isApprover ? (
          <>
            <button
              type="button"
              onClick={() => handle('Approved')}
              disabled={!canAct || submitting}
              className="rounded-2xl bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-200 border border-emerald-400/20 transition hover:bg-emerald-500/25 disabled:opacity-60"
            >
              {submitting ? 'Approving…' : 'Approve'}
            </button>
            <button
              type="button"
              onClick={() => handle('Rejected')}
              disabled={!canAct || submitting}
              className="rounded-2xl bg-red-500/15 px-5 py-2.5 text-sm font-semibold text-red-200 border border-red-400/20 transition hover:bg-red-500/25 disabled:opacity-60"
            >
              {submitting ? 'Rejecting…' : 'Reject'}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleCommentOnly}
            disabled={submitting || !comments.trim()}
            className="rounded-2xl bg-emerald-500/15 border border-emerald-400/20 px-5 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Comment'}
          </button>
        )}
      </div>
    </div>
  )
}

