import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import { PolicyCard } from '../../components/widgets/PolicyCard'
import { SearchBar } from '../../components/sections/SearchBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { Policy, Department, listPolicies, listDepartments, PaginatedResponse } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { useAppData } from '../../context/AppDataContext'

export default function EmployeeSearchPage() {
  const navigate = useNavigate()
  const { show } = useToast()

  const { state: appData, setState } = useAppData()

  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [perPage] = useState(8)

  const [departments, setDepartments] = useState<Department[]>([])
  const deptMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d.name])), [departments])

  const [policies, setPolicies] = useState<Policy[]>([])
  const [meta, setMeta] = useState({ total: 0, per_page: perPage, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDeps() {
      if (appData.adminDepartments) {
        setDepartments(appData.adminDepartments)
        return
      }

      try {
        const res = await listDepartments({ per_page: 100 })
        const items = res.data.data.items
        setDepartments(items)
        setState((prev) => ({ ...prev, adminDepartments: items }))
      } catch {
        // non-blocking
      }
    }
    loadDeps()
  }, [appData.adminDepartments, setState])

  useEffect(() => {
    let cancelled = false

    async function run() {
      // Use cached employeePolicies on initial visit (page=1, no search)
      if (page === 1 && !q && appData.employeePolicies) {
        setPolicies(appData.employeePolicies.items)
        setMeta(appData.employeePolicies.meta)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const res = await listPolicies({
          page,
          per_page: perPage,
          search: q.trim() ? q.trim() : undefined,
        })
        if (cancelled) return

        const payload = res.data.data
        const items = (payload as PaginatedResponse<Policy>).items
        const nextMeta = (payload as PaginatedResponse<Policy>).meta
        setPolicies(items)
        setMeta(nextMeta)

        // Cache in AppDataContext when on page 1 without search
        if (page === 1 && !q) {
          setState((prev) => ({
            ...prev,
            employeePolicies: {
              items,
              meta: nextMeta,
            },
          }))
        }
      } catch {
        if (cancelled) return
        setError('Unable to search policies.')
        show({ tone: 'error', title: 'Search failed', message: 'Unable to fetch search results from server.' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [q, page, perPage, show, appData.employeePolicies, setState])

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <div className="text-3xl font-semibold">Policy Search</div>
          <div className="text-slate-400 mt-1">Search policies across departments.</div>
        </div>

        <SearchBar
          value={q}
          onChange={(next) => {
            setPage(1)
            setQ(next)
          }}
          placeholder="Search by title or keyword…"
        />

        {error ? <div className="text-sm text-red-300">{error}</div> : null}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-slate-300">Searching…</div>
        ) : policies.length === 0 ? (
          <EmptyState title="No results" description="Try a different keyword." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-400">
            Showing {policies.length} of {meta.total}
          </div>
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
    </AppLayout>
  )
}