import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { createPolicy, listDepartments, Department } from '../../services/api'
import { useToast } from '../../hooks/useToast'

const visibilityOptions = ['Public', 'Department', 'Private'] as const
const statusOptions = ['Draft', 'Under Review', 'Approved', 'Archived'] as const

export default function AdminCreatePolicyPage() {
  const navigate = useNavigate()
  const { show } = useToast()
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

  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await listDepartments({ per_page: 100 })
        setDepartments(res.data.data.items)
      } catch {
        setError('Unable to load departments.')
      } finally {
        setLoading(false)
      }
    }

    loadDepartments()
  }, [])

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || (visibility === 'Department' && !departmentId)) {
      setError(visibility === 'Department' && !departmentId ? 'A department is required for Department visibility.' : 'Title and content are required.')
      return
    }
    setSaving(true)
    try {
      await createPolicy({
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
      show({ tone: 'success', title: 'Policy created' })
      navigate('/admin/policies')
    } catch {
      setError('Unable to create policy.')
      show({ tone: 'error', title: 'Policy was not created', message: 'Please review the form and try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <div className="text-3xl font-semibold">Create Policy</div>
          <div className="text-slate-400 mt-1">Draft a new policy and submit it for review.</div>
        </div>

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
                  placeholder="Write the full SOP content here..."
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
                  Create policy
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/policies')}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-100 transition hover:bg-white/10"
                >
                  Cancel
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
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
