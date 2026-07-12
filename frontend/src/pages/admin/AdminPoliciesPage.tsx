import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { SearchBar } from '../../components/sections/SearchBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import { deletePolicy, listPolicies, listDepartments, Policy, Department } from '../../services/api'

export default function AdminPoliciesPage() {
  const navigate = useNavigate()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState<number | ''>('')
  const [visibility, setVisibility] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, per_page: 10, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDepartments = async () => {
    const res = await listDepartments({ per_page: 100 })
    setDepartments(res.data.data.items)
  }

  const loadPolicies = async () => {
    setLoading(true)
    try {
      const res = await listPolicies({
        per_page: 10,
        page,
        search: search.trim() || undefined,
        department_id: departmentId || undefined,
        visibility: visibility || undefined,
        status: status || undefined,
      })
      setPolicies(res.data.data.items)
      setMeta(res.data.data.meta)
    } catch (err) {
      setError('Unable to load policies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    loadPolicies()
  }, [page, search, departmentId, visibility, status])

  const departmentMap = useMemo(
    () => Object.fromEntries(departments.map((dept) => [dept.id, dept.name])),
    [departments],
  )

  const handleDelete = async (policyId: number) => {
    if (!window.confirm('Delete this policy?')) return
    setLoading(true)
    try {
      await deletePolicy(policyId)
      await loadPolicies()
    } catch (err) {
      setError('Unable to delete policy.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-3xl font-semibold">Policies</div>
            <div className="text-slate-400 mt-1">Create, review, and maintain the policy catalog.</div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/policies/new')}
            className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
          >
            New Policy
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_320px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium text-slate-100">Policy pipeline</div>
                <div className="text-sm text-slate-400 mt-1">Search, filter and manage live documents.</div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <SearchBar value={search} onChange={(value) => { setPage(1); setSearch(value) }} placeholder="Search policies…" />
                <select
                  value={departmentId}
                  onChange={(e) => { setPage(1); setDepartmentId(e.target.value ? Number(e.target.value) : '') }}
                  className="rounded-2xl bg-slate-950/30 border border-white/10 px-3 py-3 text-slate-100 outline-none focus:border-indigo-400"
                >
                  <option value="">All departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <select
                  value={status}
                  onChange={(e) => { setPage(1); setStatus(e.target.value) }}
                  className="rounded-2xl bg-slate-950/30 border border-white/10 px-3 py-3 text-slate-100 outline-none focus:border-indigo-400"
                >
                  <option value="">Any status</option>
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {error ? <div className="mt-4 text-sm text-red-300">{error}</div> : null}

            <div className="mt-5 overflow-x-auto">
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-slate-300">Loading policies…</div>
              ) : policies.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No policies found"
                    description="Try broader filters or create a new policy to get started."
                  />
                </div>
              ) : (
                <table className="min-w-full text-sm text-left">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-3 px-3 font-semibold">Title</th>
                      <th className="py-3 px-3 font-semibold">Department</th>
                      <th className="py-3 px-3 font-semibold">Visibility</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold">Updated</th>
                      <th className="py-3 px-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {policies.map((policy) => (
                      <tr key={policy.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/policies/${policy.id}/edit`)}
                            className="text-left text-slate-100 hover:text-indigo-300"
                          >
                            {policy.title}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{departmentMap[policy.department_id ?? -1] ?? 'Unassigned'}</td>
                        <td className="py-3 px-3 text-slate-300">{policy.visibility}</td>
                        <td className="py-3 px-3">
                          <Badge tone={policy.status === 'Approved' ? 'green' : policy.status === 'Draft' ? 'slate' : policy.status === 'Under Review' ? 'amber' : 'indigo'}>
                            {policy.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{policy.updated_at ? new Date(policy.updated_at).toLocaleDateString() : '-'}</td>
                        <td className="py-3 px-3 space-x-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/policies/${policy.id}/edit`)}
                            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(policy.id)}
                            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
              <span>
                Showing {policies.length} of {meta.total} policies
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((prev) => Math.min(meta.last_page, prev + 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="font-medium text-slate-100">Quick summary</div>
            <div className="mt-4 space-y-3 text-slate-300">
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <span>Total policies</span>
                <span>{meta.total}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <span>Current page</span>
                <span>{meta.current_page}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <span>Departments</span>
                <span>{departments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
