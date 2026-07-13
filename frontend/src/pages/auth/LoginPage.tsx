import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import AppNavbar from '../../components/auth/AppNavbar'
import EnterpriseBackground from '../../components/auth/EnterpriseBackground'


function resolveDashboardPath(user: any) {
  const role = typeof user?.role === 'string' ? user.role : user?.role?.name
  if (role === 'Admin') return '/admin/dashboard'
  if (role === 'Employee') return '/employee/dashboard'
  if (user?.role_id === 1) return '/admin/dashboard'
  if (user?.role_id === 2) return '/employee/dashboard'
  return '/'
}

export default function LoginPage() {
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const user = await login(email, password)
      const destination = (location.state as { from?: string })?.from ?? resolveDashboardPath(user)
      nav(destination, { replace: true })
    } catch {
      setError('Unable to login. Check credentials.')
    }
  }

  return (
    <div className="min-h-screen">
      {/* EXACT SAME premium background as Landing */}
      <EnterpriseBackground />

      <div className="relative">
        <AppNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-10">
          <div className="grid place-items-center min-h-[calc(100vh-96px-40px)]">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7 shadow-soft backdrop-blur-md">

              <div className="mb-6">

                <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs text-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.12)]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-violet-300/30 bg-violet-500/10">
                    🛡
                  </span>
                  Secure Sign-In
                </div>
                <div className="mt-4 text-3xl font-semibold tracking-tight text-white">Welcome back</div>
                <div className="mt-1 text-slate-300 text-sm">Sign in to continue</div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <div className="mb-1 text-sm text-slate-300">Email</div>
                  <input
                    className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your working email"
                    required
                  />
                </label>
                <label className="block">
                  <div className="mb-1 text-sm text-slate-300">Password</div>
                  <input
                    className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </label>

                {error ? <div className="text-sm text-red-300">{error}</div> : null}

                <button
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-fuchsia-500 px-8 py-3.5 font-semibold text-white shadow-[0_0_40px_rgba(147,51,234,0.25)] hover:opacity-95 disabled:opacity-60 transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>

                <div className="pt-2 text-xs text-slate-400">
                  By signing in, you agree to follow internal policy governance procedures.
                </div>
              </form>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

