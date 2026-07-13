import { useNavigate } from 'react-router-dom'

function IconBadge({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={
        className ??
        'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/15 shadow-[0_0_30px_rgba(147,51,234,0.12)]'
      }
    >
      <span className="text-xs font-semibold text-white/90">{label}</span>
    </div>
  )
}

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen text-slate-100">
      {/* Premium layered background (no external CSS) */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute top-40 -left-20 h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />

        {/* subtle grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:46px_46px]"
        />

        <header className="sticky top-0 z-20">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur px-4 py-3">
              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/20 flex items-center justify-center">
                  <div className="h-3.5 w-3.5 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(129,140,248,0.6)]" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">Corporate Policy & SOP</div>
                  <div className="text-xs text-slate-400">Internal Compliance Platform</div>
                </div>
              </div>

              {/* Center */}
              <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
                <a className="transition hover:text-white" href="#">
                  Secure Access
                </a>
                <a className="transition hover:text-white" href="#">
                  Official Guidelines
                </a>
                <a className="transition hover:text-white" href="#">
                  Smart Repository
                </a>
              </nav>

              {/* Right */}
              <div className="flex items-center gap-2 sm:gap-3">
                

                <button
                  type="button"
                  onClick={() => nav('/login')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(168,85,247,0.25)] ring-1 ring-white/10 hover:brightness-110 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                >
                  Employee Login
                  <span aria-hidden className="text-white/90 font-bold">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-12 pt-10">
          {/* Hero */}
          <section className="relative">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 lg:grid-cols-12 items-center" style={{ minHeight: '70vh' }}>
                {/* LEFT */}
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.12)]">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-violet-300/30 bg-violet-500/10">🛡</span>
                    Zero-Trust Governance Environment
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Enterprise-grade Policy & SOP Management
                  </h1>

                  <p className="mt-4 max-w-xl text-slate-300 leading-relaxed">
                    Securely create, review, and acknowledge internal policies with role-based visibility, version history, and audit-ready workflows.
                  </p>

                  <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => nav('/login')}
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(147,51,234,0.25)] hover:opacity-95 transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                    >
                      <span className="text-base">Employee Login</span>
                      <span aria-hidden className="text-white/90 font-bold">→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => nav('/login')}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10 active:scale-[0.99]"
                    >
                      Request Access
                    </button>

                    <div className="text-sm text-slate-400 max-w-xs">SSO-friendly authentication. Admin review workflows.</div>
                  </div>

                  {/* trust indicators */}
                  <div className="mt-7 flex flex-wrap items-center gap-2">
                    {[
                      { label: 'Policies', tone: 'indigo' },
                      { label: 'Employees', tone: 'fuchsia' },
                      { label: 'Departments', tone: 'violet' },
                    ].map((t) => (
                      <div
                        key={t.label}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_16px_rgba(129,140,248,0.45)]" />
                        <span className="text-xs font-semibold text-slate-200">{t.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* condensed awareness card (keeps content) */}
                  <div className="mt-7 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="text-left">
                        <div className="text-sm font-semibold text-slate-100">Mandatory Security Awareness</div>
                        <div className="mt-1 text-xs text-slate-400">By continuing, you acknowledge governance policies and SOP compliance requirements.</div>
                      </div>
                      <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                        Always On
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                  <div className="mt-6 flex flex-col gap-4 min-w-[340px]">
            {[
              {
                title: 'Secure Access',
                desc: 'Role-based access with controlled visibility for each department.',
                badge: '🔒',
              },
              {
                title: 'Official Guidelines',
                desc: 'Up-to-date internal SOPs and assessment standards.',
                badge: '📘',
              },
              {
                title: 'Smart Repository',
                desc: 'Search, version history, acknowledgements, and approvals in one place.',
                badge: '🗄️',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <IconBadge label={c.badge} />
                  <div>
                    <div className="text-base font-semibold text-white/95">{c.title}</div>
                    <div className="mt-2 text-sm text-slate-300 leading-relaxed">{c.desc}</div>
                  </div>
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl transition group-hover:opacity-100 opacity-80"
                />
              </div>
            ))}
          </div>

                {/* <div className="lg:col-span-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-4 px-2 py-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-100">Dashboard Preview</div>
                        <div className="text-xs text-slate-400 mt-1">Role-aware governance at a glance</div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/20 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.45)]" />
                        <span className="text-xs font-semibold text-emerald-200">Operational</span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-200">Policy Compliance Pulse</div>
                        <div className="text-xs text-slate-400">Last 6 weeks</div>
                      </div>
                      <div className="mt-4 grid grid-cols-6 gap-2">
                        {[68, 74, 79, 71, 83, 88].map((v, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2">
                            <div
                              className="w-full rounded-xl bg-gradient-to-b from-indigo-500/70 to-fuchsia-500/30 border border-white/10"
                              style={{ height: `${Math.max(12, v)}px` }}
                            />
                            <div className="text-[10px] text-slate-500">W{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        {
                          title: 'Active Policies',
                          value: '312',
                          sub: 'Approved & live',
                          icon: '📄',
                          tone: 'indigo',
                        },
                        {
                          title: 'Pending Reviews',
                          value: '18',
                          sub: 'Awaiting approval',
                          icon: '⏳',
                          tone: 'amber',
                        },
                        {
                          title: 'Acknowledgements',
                          value: '2,941',
                          sub: 'Signed this period',
                          icon: '✅',
                          tone: 'emerald',
                        },
                        {
                          title: 'Security Status',
                          value: 'Strong',
                          sub: 'Zero-Trust enabled',
                          icon: '🛡️',
                          tone: 'fuchsia',
                        },
                        {
                          title: 'Department Activity',
                          value: '14',
                          sub: 'Updates today',
                          icon: '🏢',
                          tone: 'violet',
                        },
                        {
                          title: 'Audit Ready',
                          value: 'Yes',
                          sub: 'Version tracking',
                          icon: '🧾',
                          tone: 'slate',
                        },
                      ].map((c) => (
                        <div
                          key={c.title}
                          className="rounded-2xl border border-white/10 bg-slate-950/20 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[11px] font-semibold text-slate-400">{c.title}</div>
                              <div className="mt-2 text-2xl font-semibold text-white/95 leading-none">{c.value}</div>
                              <div className="mt-2 text-xs text-slate-400">{c.sub}</div>
                            </div>
                            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-lg">
                              {c.icon}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Recent Policy Updates</div>
                          <div className="text-[11px] text-slate-500 mt-1">A preview of workflow activity</div>
                        </div>
                        <div className="text-[11px] text-slate-400">Today</div>
                      </div>
                      <div className="mt-3 space-y-2">
                        {[
                          { label: 'HR Policy v5', status: 'Approved', accent: 'emerald' },
                          { label: 'Finance SOP v12', status: 'Pending', accent: 'amber' },
                          { label: 'IT Security v3', status: 'Draft', accent: 'violet' },
                        ].map((r) => (
                          <div key={r.label} className="flex items-center justify-between gap-3">
                            <div className="text-sm text-slate-200">{r.label}</div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  r.accent === 'emerald'
                                    ? 'bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.45)]'
                                    : r.accent === 'amber'
                                      ? 'bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.35)]'
                                      : 'bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.25)]'
                                }`}
                              />
                              <span className="text-[11px] font-semibold text-slate-300">{r.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </section>

          {/* Statistics */}
          {/* <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '15K+', label: 'Policies' },
              { value: '99.98%', label: 'Availability' },
              { value: 'AES-256', label: 'Encryption' },
              { value: '24/7', label: 'Monitoring' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
                <div className="text-lg font-semibold text-white/95">{s.value}</div>
                <div className="mt-1 text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </section> */}

          {/* Feature cards row */}
        

          {/* Security strip */}
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <IconBadge
                  label={'🟢'}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-emerald-500/10"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-100">Mandatory Security Awareness</div>
                  <div className="text-xs text-slate-400">Unauthorized access is prohibited.</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.45)]" />
                <span className="text-xs font-semibold text-emerald-200">Systems Operational</span>
              </div>
            </div>
          </section>

          <footer className="mt-10 pb-6">
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Corporate Policy & SOP Portal. Unauthorized access is prohibited. Version 1.0.0
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

