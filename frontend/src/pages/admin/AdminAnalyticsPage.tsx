import { useEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'
import { StatCard } from '../../components/widgets/StatCard'
import { ChartCard } from '../../components/widgets/ChartCard'
import {
  SkeletonChartBlock,
  SkeletonStatGrid,
} from '../../components/skeletons/EnterpriseSkeletons'
import { PolicyCard } from '../../components/widgets/PolicyCard'
import type { AdminDashboardResponse } from '../../services/dashboardApi'
import { getAdminDashboard } from '../../services/dashboardApi'
import { useNavigate } from 'react-router-dom'
import { useCachedAsync } from '../../hooks/useCachedAsync'


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null)

  const navigate = useNavigate()

  const { data: cachedDashboard, loading: cachedLoading, error: cachedError } = useCachedAsync<AdminDashboardResponse>(
    'dashboard:admin',
    async () => {
      const res = await getAdminDashboard()
      return res.data.data
    },
    { staleTimeMs: 60_000, returnStaleImmediately: true },
  )

  useEffect(() => {
    setDashboard(cachedDashboard)
    setLoading(cachedLoading)
    setError(cachedError)
  }, [cachedDashboard, cachedLoading, cachedError])

  const stats = dashboard?.stats ?? []

  const pendingReviews = dashboard?.pendingReviews ?? []
  const topPolicies = dashboard?.topPolicies ?? []
  const departmentAnalytics = dashboard?.departmentAnalytics ?? []
  const chart = dashboard?.chart ?? null

  const statusBarData = useMemo(() => {
    // DashboardService provides status counts only indirectly via `stats` deltas.
    // For a meaningful chart without duplicating backend logic, we reuse the
    // available stats titles/values (Draft/Under Review/Approved/Archived).
    // If those titles are missing, we fall back to department progress.
    const labelMap: Record<string, string> = {
      Draft: 'Draft',
      'Under Review': 'Under Review',
      Approved: 'Approved',
      Archived: 'Archived',
    }

    const items = stats
      .filter((s) => Object.keys(labelMap).includes(s.title))
      .map((s) => ({ label: labelMap[s.title] ?? s.title, value: s.value }))

    if (items.length === 0) {
      // fallback: show department progress distribution as bars
      return {
        labels: departmentAnalytics.map((d) => d.name),
        datasets: [
          {
            label: 'Department progress',
            data: departmentAnalytics.map((d) => d.progress),
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
          },
        ],
      }
    }

    const palette = ['#818cf8', '#ec4899', '#f59e0b', '#22c55e']
    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          label: 'Policy status',
          data: items.map((i) => Number(i.value ?? 0)),
          backgroundColor: palette.slice(0, items.length),
        },
      ],
    }
  }, [departmentAnalytics, stats])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-semibold">Analytics</div>
          <div className="text-slate-400 mt-1">Policy governance insights powered by live dashboard data.</div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-6">
            <SkeletonStatGrid count={4} />
            <SkeletonChartBlock heightClass="h-64" />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="h-5 w-64 bg-white/10 rounded" />
                  <div className="mt-2 h-3 w-96 bg-white/10 rounded" />
                </div>
                <div className="h-7 w-24 bg-white/10 rounded-full" />
              </div>
              <div className="mt-6 h-44 bg-white/5 rounded" />
            </div>
          </div>
        ) : (
          <>
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,340px)] items-start">
              <div className="min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <StatCard
                      key={stat.title}
                      title={stat.title}
                      value={stat.value}
                      description={stat.description}
                      delta={stat.delta}
                      tone={stat.tone}
                    />
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100">Policy status distribution</h2>
                      <p className="text-sm text-slate-400">Draft, review, approved, and archived counts.</p>
                    </div>
                    <Badge tone="indigo">Live</Badge>
                  </div>
                  <div className="mt-6">
                    <Bar
                      data={statusBarData}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                </div>
              </div>

              <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">Acknowledgement progress</h2>
                    <p className="text-sm text-slate-400">Activity trend (last 6 weeks).</p>
                  </div>
                  <Badge tone="green">Tracked</Badge>
                </div>
                <div className="mt-6">
                  <ChartCard chart={chart} />
                </div>
              </aside>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100">Pending approvals</h2>
                      <p className="text-sm text-slate-400">Policies awaiting action.</p>
                    </div>
                    <Badge tone="amber">{pendingReviews.length} open</Badge>
                  </div>
                  <div className="mt-5 space-y-3">
                    {pendingReviews.length === 0 ? (
                      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">
                        No pending approvals at the moment.
                      </div>
                    ) : (
                      pendingReviews.slice(0, 5).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigate('/admin/review-board')}
                          className="w-full rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-left transition-all duration-200 hover:border-amber-400/40 hover:bg-slate-900/80"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-100">Policy #{item.policy_document_id}</p>
                              <p className="text-sm text-slate-400">
                                Approver: {item.approver?.name ?? item.approver_user_id}
                              </p>
                            </div>
                            <Badge tone="amber">{item.status}</Badge>
                          </div>
                          <div className="mt-3 text-sm text-slate-500">
                            {item.comments ?? 'Awaiting reviewer comments.'}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100">Policies by department</h2>
                      <p className="text-sm text-slate-400">Compliance pulse (relative distribution).</p>
                    </div>
                    <Badge tone="fuchsia">Pulse</Badge>
                  </div>
                  <div className="mt-5 space-y-4">
                    {departmentAnalytics.length === 0 ? (
                      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">
                        No department analytics available yet.
                      </div>
                    ) : (
                      departmentAnalytics.map((department) => (
                        <div key={department.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>{department.name}</span>
                            <span>{department.progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                              style={{ width: `${department.progress}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100">Recent policy updates</h2>
                      <p className="text-sm text-slate-400">Most recently updated items.</p>
                    </div>
                    <Badge tone="indigo">Top</Badge>
                  </div>
                  <div className="mt-5 space-y-3">
                    {topPolicies.length === 0 ? (
                      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">
                        No policies available yet.
                      </div>
                    ) : (
                      topPolicies.map((policy) => (
                        <button
                          key={policy.id}
                          type="button"
                          onClick={() => navigate('/admin/policies')}
                          className="w-full text-left rounded-3xl border border-white/10 bg-slate-950/60 p-4 transition hover:-translate-y-0.5 hover:bg-slate-900/80"
                        >
                          <PolicyCard
                            title={policy.title}
                            badge={policy.status}
                            description={policy.summary ?? 'No summary provided.'}
                          />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  )
}

