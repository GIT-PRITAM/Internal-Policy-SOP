import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { getPolicy, listDepartments, updatePolicy, deletePolicy, Department, Policy } from '../../services/api'
import { createPolicyVersion } from '../../services/versionsApi'
import { PolicyVersionHistory } from '../../components/sections/PolicyVersionHistory'
import { submitPolicyForReview } from '../../services/approvalsApi'
import { useToast } from '../../hooks/useToast'

const visibilityOptions = ['Public', 'Department', 'Private'] as const
const statusOptions = ['Draft', 'Under Review', 'Approved', 'Archived'] as const

export default function AdminEditPolicyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [departmentId, setDepartmentId] = useState<number | ''>('')
  const [visibility, setVisibility] = useState<typeof visibilityOptions[number]>('Department')
  const [status, setStatus] = useState<typeof statusOptions[number]>('Draft')
  const [mandatory, setMandatory] = useState(false)
  const [effectiveDate, setEffectiveDate] = useState('')
  const [reviewDate, setReviewDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [versionRefreshKey, setVersionRefreshKey] = useState(0)
  const [changeSummary, setChangeSummary] = useState('')
  const [creatingVersion, setCreatingVersion] = useState(false)
  const [submittingForReview, setSubmittingForReview] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [policyRes, departmentsRes] = await Promise.all([
          getPolicy(Number(id), { include_content: 1 }),
          listDepartments({ per_page: 100 }),
        ])
        const nextPolicy = policyRes.data.data.policy
        setPolicy(nextPolicy)
        setTitle(nextPolicy.title)
        setSummary(nextPolicy.summary ?? '')
        setContent(nextPolicy.content ?? '')
        setDepartmentId(nextPolicy.department_id ?? '')
        setVisibility(nextPolicy.visibility)
        setStatus(nextPolicy.status)
        setMandatory(nextPolicy.mandatory)
        setEffectiveDate(nextPolicy.effective_date ?? '')
        setReviewDate(nextPolicy.review_date ?? '')
        setDepartments(departmentsRes.data.data.items)
      } catch {
        setError('Unable to load policy details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])

  const handleSubmit = async () => {
    if (!id || !title.trim() || !content.trim() || (visibility === 'Department' && !departmentId)) {
      setError(visibility === 'Department' && !departmentId ? 'A department is required for Department visibility.' : 'Title and content are required.')
      return
    }
    setSaving(true)
    try {
      await updatePolicy(Number(id), {
        title,
        summary,
        content,
        department_id: departmentId || null,
        visibility,
        status,
        mandatory,
        effective_date: effectiveDate || null,
        review_date: reviewDate || null,
      })
      show({ tone: 'success', title: 'Policy updated' })
      navigate('/admin/policies')
    } catch {
      setError('Unable to save policy changes.')
      show({ tone: 'error', title: 'Policy was not updated' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !window.confirm('Delete this policy?')) return
    setSaving(true)
    try {
      await deletePolicy(Number(id))
      show({ tone: 'success', title: 'Policy deleted' })
      navigate('/admin/policies')
    } catch {
      setError('Unable to delete policy.')
      show({ tone: 'error', title: 'Policy was not deleted' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <div className="text-3xl font-semibold">Edit Policy</div>
          <div className="text-slate-400 mt-1">Update policy content and publication settings.</div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading policy…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">{error}</div>
        ) : policy ? (
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="space-y-4">
                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Title</div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                    placeholder="Policy title"
                  />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Summary</div>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                    rows={4}
                    placeholder="Brief summary of the policy"
                  />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Content</div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[18rem] w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                    placeholder="Update the policy content here..."
                  />
                </label>

                {error ? <div className="text-sm text-red-300">{error}</div> : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:opacity-60"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-100 transition hover:bg-white/10 disabled:opacity-60"
                  >
                    Delete policy
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="font-medium text-slate-100">Policy settings</div>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Department</div>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                  >
                    <option value="">Unassigned</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Visibility</div>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as typeof visibilityOptions[number])}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                  >
                    {visibilityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Status</div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as typeof statusOptions[number])}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                    <span>Mandatory</span>
                    <input
                      type="checkbox"
                      checked={mandatory}
                      onChange={(e) => setMandatory(e.target.checked)}
                      className="h-5 w-5 rounded border-white/10 bg-slate-900 text-indigo-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Effective date</div>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                  />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Review date</div>
                  <input
                    type="date"
                    value={reviewDate}
                    onChange={(e) => setReviewDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                  />
                </label>

                {status === 'Draft' ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={submittingForReview}
                      onClick={async () => {
                        if (!id) return
                        const ok = window.confirm('Submit this policy for review? It will be moved to "Under Review" status.')
                        if (!ok) return
                        setSubmittingForReview(true)
                        try {
                          await submitPolicyForReview(Number(id), { change_summary: '' })
                          show({ tone: 'success', title: 'Submitted for review' })

                          // Update local state immediately; avoid refetching policy content.
                          // Backend is known (from UX copy) to move Draft -> Under Review.
                          const nextStatus = 'Under Review' as typeof statusOptions[number]
                          setStatus(nextStatus)
                          setPolicy((prev) => (prev ? { ...prev, status: nextStatus } : prev))
                        } catch {
                          show({ tone: 'error', title: 'Failed', message: 'Unable to submit policy for review.' })
                        } finally {
                          setSubmittingForReview(false)
                        }
                      }}
                      className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:opacity-60"
                    >
                      {submittingForReview ? 'Submitting…' : 'Submit For Review'}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {policy && (
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <PolicyVersionHistory policyId={policy.id} refreshKey={versionRefreshKey} />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="font-medium text-slate-100">Create New Version</div>
              <div className="text-sm text-slate-400 mt-1">Snapshot current content as a new version.</div>
              <div className="mt-4">
                <label className="block">
                  <div className="text-sm text-slate-300 mb-2">Change summary</div>
                  <textarea
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                    rows={3}
                    placeholder="Describe what changed in this version..."
                  />
                </label>
                <button
                  type="button"
                  disabled={creatingVersion || !changeSummary.trim()}
                  onClick={async () => {
                    if (!id) return
                    setCreatingVersion(true)
                    try {
                      await createPolicyVersion(Number(id), {
                        title,
                        content,
                        change_summary: changeSummary,
                      })
                      show({ tone: 'success', title: 'Version created' })
                      setChangeSummary('')
                      setVersionRefreshKey((k) => k + 1)
                    } catch {
                      show({ tone: 'error', title: 'Failed', message: 'Unable to create version.' })
                    } finally {
                      setCreatingVersion(false)
                    }
                  }}
                  className="mt-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:opacity-60"
                >
                  {creatingVersion ? 'Creating…' : 'Create Version'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
