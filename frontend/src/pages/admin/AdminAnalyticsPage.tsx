import { useEffect, useMemo, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'
import { listPolicies, listDepartments, Policy } from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

export default function AdminAnalyticsPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [policyRes, deptRes] = await Promise.all([
          listPolicies({ per_page: 100 }),
          listPolicies({ per_page: 100, visibility: 'Public' }),
        ])
        const items = policyRes.data.data.items
        const deptNames = Array.from(new Set(items.map((policy) => String(policy.department_id ?? 'Unassigned'))))
        const counts: Record<string, number> = {}
        items.forEach((policy) => {
          const key = policy.status ?? 'Unknown'
          counts[key] = (counts[key] ?? 0) + 1
        })

        setPolicies(items)
        setDepartments(deptNames)
        setStatusCounts(counts)
      } catch (err) {
        setError('Unable to load analytics data.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const departmentData = useMemo(
    () => ({
      labels: departments,
      datasets: [
        {
          label: 'Departments',
          data: departments.map((name) => policies.filter((policy) => String(policy.department_id ?? 'Unassigned') === name).length),
          backgroundColor: 'rgba(99, 102, 241, 0.75)',
        },
      ],
    }),
    [departments, policies],
  )

  const statusData = useMemo(
    () => ({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: 'Policy status',
          data: Object.values(statusCounts),
          backgroundColor: ['#818cf8', '#ec4899', '#f59e0b', '#22c55e'],
        },
      ],
    }),
    [statusCounts],
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-semibold">Analytics</div>
          <div className="text-slate-400 mt-1">Real-time trends from your policy inventory.</div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading analytics…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">{error}</div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Policy status distribution</h2>
                  <p className="text-sm text-slate-400">Track how your governance content is moving through review.</p>
                </div>
                <Badge tone="indigo">Live</Badge>
              </div>
              <div className="mt-6">
                <Bar data={statusData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">Department health</h2>
                    <p className="text-sm text-slate-400">Policies by department.</p>
                  </div>
                  <Badge tone="green">Updated</Badge>
                </div>
                <div className="mt-5">
                  <Line
                    data={departmentData}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">Latest reports</h2>
                    <p className="text-sm text-slate-400">Last updated policy counts.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="text-sm text-slate-400">Total policies</div>
                    <div className="mt-3 text-3xl font-semibold text-slate-100">{policies.length}</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="text-sm text-slate-400">Departments represented</div>
                    <div className="mt-3 text-3xl font-semibold text-slate-100">{departments.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
