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
                <div className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5" />
                <div className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5" />

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
          <section className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.12)]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-violet-300/30 bg-violet-500/10">🛡</span>
              Secure Enterprise Environment
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">Welcome to the Corporate Policy & SOP Portal</h1>
            <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
              Access official internal assessment guidelines, standard operating procedures, and company policies securely within our enterprise environment.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => nav('/login')}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(147,51,234,0.25)] hover:opacity-95 transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              >
                <span className="text-base">Employee Login</span>
                <span aria-hidden className="text-white/90 font-bold">→</span>
              </button>

              <div className="text-sm text-slate-400 max-w-xs">Secure authentication via internal Single Sign-On.</div>
            </div>

            <div className="mt-8 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-100">Mandatory Security Awareness</div>
                  <div className="mt-1 text-xs text-slate-400">By continuing, you acknowledge internal governance policies.</div>
                </div>
                <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  Always On
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
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
          </section>

          {/* Feature cards row */}
          <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
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
          </section>

          {/* Security strip */}
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <IconBadge label={'🟢'} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-emerald-500/10" />
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

