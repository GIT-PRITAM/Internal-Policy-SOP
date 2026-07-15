import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { PolicyCard } from '../../components/widgets/PolicyCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Policy, Department, listPolicies, listDepartments, PaginatedResponse } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { useAppData } from '../../context/AppDataContext'


export default function EmployeePoliciesPage() {
  const navigate = useNavigate()
  const { show } = useToast()

  const { state: appData, setState } = useAppData()
  const cached = appData.employeePolicies

  const [policies, setPolicies] = useState<Policy[]>([])
  const [departments, setDepartments] = useState<Department[]>([])


  const [page, setPage] = useState(1)
  const [perPage] = useState(6)
  const [meta, setMeta] = useState({ total: 0, per_page: perPage, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const deptMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d.name])), [departments])

  useEffect(() => {
    async function boot() {
      try {
        // department list is used only for label mapping; if policy list is cached,
        // we still fetch departments once to keep display correct.
        const [deptRes] = await Promise.all([listDepartments({ per_page: 100 })])
        setDepartments(deptRes.data.data.items)
      } catch {
        // Non-blocking
      }
    }
    boot()
  }, [])


  useEffect(() => {
    async function load() {
      // If we already have cached policies, do not refetch on revisit.
      if (cached && page === 1) {
        setPolicies(cached.items)
        setMeta(cached.meta)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const res = await listPolicies({ page, per_page: perPage })
        const payload = res.data.data as PaginatedResponse<Policy>
        setPolicies(payload.items)
        setMeta(payload.meta)

        if (page === 1) {
          setState((prev) => ({
            ...prev,
            employeePolicies: {
              items: payload.items,
              meta: payload.meta,
            },
          }))
        }
      } catch {
        setError('Unable to load policies.')
        show({ tone: 'error', title: 'Load failed', message: 'Unable to fetch policies from server.' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, perPage, show, cached, setState])


  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <div className="text-3xl font-semibold">Policies</div>
          <div className="text-slate-400 mt-1">Browse the latest internal SOP policies.</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">Policy Library</div>
              <div className="text-xs text-slate-400 mt-1">Latest policies you have access to.</div>
            </div>
            <div className="text-sm text-slate-300">Live</div>
          </div>

          {error ? <div className="mt-4 text-sm text-red-300">{error}</div> : null}

          {loading ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-slate-300">
              Loading policies…
            </div>
          ) : policies.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No policies found" description="Try switching to Search for more results." />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {policies.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(`/employee/policies/${p.id}`)}
                  className="text-left transition hover:-translate-y-0.5"
                >
                  <PolicyCard
                    title={p.title}
                    badge={p.status === 'Approved' ? 'Approved' : 'Active'}
                    badgeTone={p.status === 'Approved' ? 'green' : 'indigo'}
                    description={p.department_id ? `Department: ${deptMap[p.department_id] ?? 'Unknown'}` : undefined}
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-300">Tip: use the Search page for full-text search and filters.</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= meta.last_page || loading}
                  onClick={() => setPage((prev) => Math.min(meta.last_page, prev + 1))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}


