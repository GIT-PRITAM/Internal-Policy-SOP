import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="mb-6">
          <div className="text-2xl font-semibold">Internal Policy & SOP</div>
          <div className="mt-1 text-slate-300">Sign in to continue</div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <div className="mb-1 text-sm text-slate-300">Email</div>
            <input
              className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <label className="block">
            <div className="mb-1 text-sm text-slate-300">Password</div>
            <input
              className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>

          {error ? <div className="text-sm text-red-300">{error}</div> : null}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-2.5 font-medium text-white hover:opacity-95 disabled:opacity-60 transition"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

