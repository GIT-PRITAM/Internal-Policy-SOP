import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center">
              <div className="h-3.5 w-3.5 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(129,140,248,0.6)]" />
            </div>
            <div>
              <div className="font-semibold leading-tight">Corporate Policy & SOP</div>
              <div className="text-xs text-slate-400">Internal Compliance Platform</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a className="hover:text-white transition" href="#">
              Secure Access
            </a>
            <a className="hover:text-white transition" href="#">
              Official Guidelines
            </a>
            <a className="hover:text-white transition" href="#">
              Smart Repository
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="hidden md:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
              href="#"
            >
              Secure Access
            </a>

            <button
              type="button"
              onClick={() => nav('/login')}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs text-indigo-200">
              Secure Internal Network
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
              Welcome to the Corporate Policy & SOP Portal
            </h1>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Access official internal assessment guidelines, standard operating procedures, and company policies
              securely within our enterprise environment.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                type="button"
                onClick={() => nav('/login')}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 font-semibold text-white hover:opacity-95 transition shadow-[0_0_30px_rgba(147,51,234,0.25)]"
              >
                Sign in
              </button>

              <div className="text-sm text-slate-400">Secure authentication via internal Single Sign-On.</div>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-200 font-semibold">Mandatory Security Awareness</div>
                  <div className="mt-1 text-xs text-slate-400">By continuing, you acknowledge internal governance policies.</div>
                </div>
                <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  Always On
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: 'Secure Access',
                desc: 'Role-based access with controlled visibility for each department.',
              },
              {
                title: 'Official Guidelines',
                desc: 'Up-to-date internal SOPs and assessment standards.',
              },
              {
                title: 'Smart Repository',
                desc: 'Search, version history, acknowledgements, and approvals in one place.',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft hover:bg-white/10 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/25 border border-white/10 flex items-center justify-center">
                    <div className="h-3.5 w-3.5 rounded-full bg-indigo-300 group-hover:scale-110 transition" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">{c.title}</div>
                    <div className="mt-1 text-sm text-slate-300 leading-relaxed">{c.desc}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-100">Systems Operational</div>
                  <div className="mt-1 text-xs text-slate-400">Secure access services are running normally.</div>
                </div>
                <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  Live
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-14 pb-10">
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} Corporate Policy & SOP Portal. Unauthorized access is prohibited.
          </div>
        </footer>
      </main>
    </div>
  )
}

