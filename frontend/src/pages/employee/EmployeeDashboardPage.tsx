import { useEffect, useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import { StatCard } from '../../components/widgets/StatCard'
import { ChartCard } from '../../components/widgets/ChartCard'
import { PolicyCard } from '../../components/widgets/PolicyCard'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  SkeletonChartBlock,
  SkeletonPolicyCardGrid,
} from '../../components/skeletons/EnterpriseSkeletons'

import { getEmployeeDashboard, type EmployeeDashboardResponse } from '../../services/dashboardApi'
import { NotificationsPanel } from '../../components/sections/NotificationsPanel'


export default function EmployeeDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<EmployeeDashboardResponse | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      try {
        const res = await getEmployeeDashboard()
        setDashboard(res.data.data)
      } catch {
        setError('Unable to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stats = dashboard?.stats ?? []
  const pendingAcknowledgements = dashboard?.pendingAcknowledgements ?? []
  const recentUpdates = dashboard?.recentUpdates ?? []
  const bookmarkedPolicies = dashboard?.bookmarkedPolicies ?? []
  const chart = dashboard?.chart ?? null

  const quickActions = [
    { label: 'Review pending acknowledgements', tone: 'amber' as const },
    { label: 'Browse policy library', tone: 'indigo' as const },
    { label: 'Save bookmark', tone: 'fuchsia' as const },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_minmax(280px,0.8fr)] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/70">Employee hub</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Your policy workspace</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Stay on top of required acknowledgements, policy updates, and bookmarked documents with a single view.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className={`rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-slate-100 transition hover:bg-white/10 ${
                    action.tone === 'amber'
                      ? 'from-amber-500/10 border-amber-400/15'
                      : action.tone === 'indigo'
                        ? 'from-indigo-500/10 border-indigo-400/15'
                        : 'from-fuchsia-500/10 border-fuchsia-400/15'
                  }`}
                >
                  <span className="font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} title={stat.title} value={stat.value} description={stat.description} delta={stat.delta} tone={stat.tone} />
              ))}
            </div>
          )}


          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Pending acknowledgements</h2>
                  <p className="text-sm text-slate-400">Action items from your policy queue</p>
                </div>
                <Badge tone="amber">{pendingAcknowledgements.length} due</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {loading ? (
                  <>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </>
                ) : pendingAcknowledgements.length === 0 ? (

                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">No pending acknowledgements.</div>
                ) : (
                  pendingAcknowledgements.slice(0, 3).map((item) => (
                    <div key={item.policy_document_id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-100">{item.policy_title ?? 'Untitled policy'}</p>
                          <p className="text-sm text-slate-400">{item.policy_summary ?? ''}</p>
                        </div>
                        <Badge tone={item.badgeTone}>{item.badge}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications */}
            {/* <div className="rounded-2xl border border-white/10 bg-white/5 p-0 shadow-soft overflow-hidden">
              <NotificationsPanel />
            </div> */}
          </div>

        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Recent policy updates</h2>
                <p className="text-sm text-slate-400">Latest documents you should know</p>
              </div>
              <Badge tone="indigo">Fresh</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                </>
              ) : recentUpdates.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">No recent policy updates.</div>
              ) : (
                recentUpdates.map((policy) => (
                  <PolicyCard
                    key={policy.policy_document_id}
                    title={policy.title}
                    badge={policy.badge}
                    badgeTone={policy.badgeTone}
                    description={policy.description}
                  />
                ))
              )}
            </div>

          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Bookmarked policies</h2>
                  <p className="text-sm text-slate-400">Saved for later review</p>
                </div>
                <Badge tone="fuchsia">{bookmarkedPolicies.length} items</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {loading ? (
                  <>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </>
                ) : bookmarkedPolicies.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">No bookmarks yet.</div>
                ) : (
                  bookmarkedPolicies.slice(0, 5).map((policy) => (
                    <div key={policy.policy_document_id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="font-semibold text-slate-100">{policy.title}</div>
                      <div className="text-sm text-slate-400 mt-1">Shared by {policy.shared_by}</div>
                    </div>
                  ))
                )}
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Team pulse</h2>
                  <p className="text-sm text-slate-400">Acknowledgement momentum</p>
                </div>
                <Badge tone="green">Healthy</Badge>
              </div>
              <div className="mt-5">
                {loading ? <Skeleton className="h-44 w-full" /> : <ChartCard chart={chart} />}

              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

