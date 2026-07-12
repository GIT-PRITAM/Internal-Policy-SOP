import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import AppNavbar from '../../components/auth/AppNavbar'

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
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
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
      {/* Background (shared identity with Landing Page) */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.14),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(99,102,241,0.10),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative">
        {/* Reuse Landing Page navbar style */}
        <AppNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-10">
          <div className="flex items-start justify-center">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7 shadow-soft backdrop-blur-md">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
                  Secure Sign-In
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight text-white">Welcome back</div>
                <div className="mt-1 text-slate-300">Sign in to continue</div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <div className="mb-1 text-sm text-slate-300">Email</div>
                  <input
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </label>
                <label className="block">
                  <div className="mb-1 text-sm text-slate-300">Password</div>
                  <input
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </label>

                {error ? <div className="text-sm text-red-300">{error}</div> : null}

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-2.5 font-medium text-white hover:opacity-95 disabled:opacity-60 transition transform-gpu hover:scale-[1.01]"
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

