import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import { StatCard } from "../../components/widgets/StatCard";
import { ChartCard } from "../../components/widgets/ChartCard";
import { Skeleton } from "../../components/ui/Skeleton";
import {
  SkeletonChartBlock,
  SkeletonStatGrid,
} from "../../components/skeletons/EnterpriseSkeletons";

import {
  getAdminDashboard,
  type AdminDashboardResponse,
} from "../../services/dashboardApi";

import { PolicyCard } from "../../components/widgets/PolicyCard";
import { Badge } from "../../components/ui/Badge";
import { useAppData } from "../../context/AppDataContext";

import {
  downloadCsvFile,
  policiesToCsv,
  listPolicies,
} from "../../services/api";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null)


  const navigate = useNavigate()

  const { state: appData, setState } = useAppData()
  const cachedDashboard = appData.adminDashboard
  const hasData = Boolean(appData.adminDashboard)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (hasData) return
      setLoading(true)
      setError(null)
      try {
        const res = await getAdminDashboard()
        if (cancelled) return
        setState((prev) => ({
          ...prev,
          adminDashboard: res.data.data,
        }))
      } catch {
        if (cancelled) return
        setError('Unable to load dashboard data. Please try again.')
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [hasData, setState])

  useEffect(() => {
    if (!cachedDashboard) return
    setDashboard(cachedDashboard)
  }, [cachedDashboard])


  const stats = dashboard?.stats ?? []
  const departmentAnalytics = dashboard?.departmentAnalytics ?? []
  const pendingReviews = dashboard?.pendingReviews ?? []
  const topPolicies = dashboard?.topPolicies ?? []
  const chart = dashboard?.chart ?? null


  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await listPolicies({ per_page: 100 });
      const csv = policiesToCsv(response.data.data.items);
      downloadCsvFile("policies-report.csv", csv);
    } finally {
      setLoading(false);
    }
  };

  const displayedPendingReviews = pendingReviews.slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/70">
                Admin dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white">
                Policy governance at a glance
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor approvals, acknowledgements, and department health with
                live policy data.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* <button
                type="button"
                onClick={handleExport}
                disabled={loading}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:bg-white/10 disabled:opacity-60"
              >
                Export report
              </button> */}
              <button
                type="button"
                onClick={() => navigate("/admin/policies/new")}
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
              >
                New policy
              </button>
              {/* <button
                type="button"
                onClick={() => navigate('/admin/review-board')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:bg-white/10"
              >
                Review board
              </button> */}
              <button
                type="button"
                onClick={handleExport}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-slate-800 hover:border-slate-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowDownTrayIcon className="h-5 w-5 text-slate-300" />
                {loading ? "Exporting..." : "Export Report"}
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,340px)] items-start">
          <div className="min-w-0">
            {loading ? (
              <SkeletonStatGrid count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
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
            )}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">
                  Department analytics{" "}
                </h2>
              </div>
              <Badge tone="indigo">Live</Badge>
            </div>
            <div className="mt-5 h-[90px] overflow-y-auto pr-2 no-scrollbar">
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  ))
                ) : departmentAnalytics.length === 0 ? (
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
          </aside>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">
                  Policy activity
                </h2>
                <p className="text-sm text-slate-400">
                  Recent adoption and engagement trends
                </p>
              </div>
              <Badge tone="green">Tracked</Badge>
            </div>
            <div className="mt-6">
              {loading ? <SkeletonChartBlock /> : <ChartCard chart={chart} />}
            </div>
          </div>
          {/* 
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Pending reviews</h2>
                  <p className="text-sm text-slate-400">Policies awaiting approvals</p>
                </div>
                <Badge tone="amber">{pendingReviews.length} open</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {pendingReviews.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">No pending approvals at the moment.</div>
                ) : (
                  pendingReviews.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-100">Policy #{item.policy_document_id}</p>
                          <p className="text-sm text-slate-400">Approver: {item.approver?.name ?? item.approver_user_id}</p>
                        </div>
                        <Badge tone="amber">{item.status}</Badge>
                      </div>
                      <div className="mt-3 text-sm text-slate-500">{item.comments ?? 'Awaiting reviewer comments.'}</div>
                    </div>
                  ))
                )}
              </div>
            </div> */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Pending reviews
                  </h2>
                  <p className="text-sm text-slate-400">
                    Policies awaiting approvals
                  </p>
                </div>
                <Badge tone="amber">{pendingReviews.length} open</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {displayedPendingReviews.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-slate-300">
                    No pending approvals at the moment.
                  </div>
                ) : (
                  displayedPendingReviews.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate("/admin/review-board")}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-left transition-all duration-200 hover:border-amber-400/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-amber-500/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-100">
                            Policy #{item.policy_document_id}
                          </p>
                          <p className="text-sm text-slate-400">
                            Approver:{" "}
                            {item.approver?.name ?? item.approver_user_id}
                          </p>
                        </div>

                        <Badge tone="amber">{item.status}</Badge>
                      </div>

                      <div className="mt-3 text-sm text-slate-500">
                        {item.comments ?? "Awaiting reviewer comments."}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                New policies
              </h2>
              <p className="text-sm text-slate-400">
                Most recently updated policies
              </p>
            </div>
            <Badge tone="indigo">Top 3</Badge>
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
                  onClick={() => navigate("/admin/policies")}
                  className="w-full text-left rounded-3xl border border-white/10 bg-slate-950/60 p-4 transition hover:-translate-y-0.5 hover:bg-slate-900/80"
                >
                  <PolicyCard
                    title={policy.title}
                    badge={policy.status}
                    description={policy.summary ?? "No summary provided."}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
