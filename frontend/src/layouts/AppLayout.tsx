import { PropsWithChildren, useMemo, useState } from 'react'
import {
  Bars3Icon,
  BellIcon,
  BookmarkIcon,
  BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router-dom'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles?: Array<'Admin' | 'Employee'>
}

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Squares2X2Icon, roles: ['Admin'] },
  { href: '/admin/departments', label: 'Departments', icon: BuildingOffice2Icon, roles: ['Admin'] },
  { href: '/admin/policies', label: 'Policies', icon: DocumentTextIcon, roles: ['Admin'] },
  { href: '/admin/review-board', label: 'Review board', icon: BellIcon, roles: ['Admin'] },
  { href: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon, roles: ['Admin'] },
  { href: '/admin/users', label: 'Users', icon: UsersIcon, roles: ['Admin'] },
]

const employeeNav: NavItem[] = [
  { href: '/employee/dashboard', label: 'Dashboard', icon: Squares2X2Icon, roles: ['Employee'] },
  { href: '/employee/policies', label: 'Policies', icon: DocumentTextIcon, roles: ['Employee'] },
  { href: '/employee/search', label: 'Search', icon: MagnifyingGlassIcon, roles: ['Employee'] },
  { href: '/employee/bookmarks', label: 'Bookmarks', icon: BookmarkIcon, roles: ['Employee'] },
]

export default function AppLayout({ children }: PropsWithChildren) {
  const { user, role, logout } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)

  const navItems = useMemo(() => {
    if (!role) return []
    return role === 'Admin' ? adminNav : employeeNav
  }, [role])

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="sm:flex">
        <aside
          className={`hidden sm:flex ${collapsed ? 'w-20' : 'w-80'} flex-col border-r border-white/10 bg-slate-950/90 shadow-soft backdrop-blur-xl transition-all duration-300`}
          aria-label="Sidebar"
        >
          <div className="flex h-20 items-center justify-between gap-4 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_20px_50px_rgba(139,92,246,0.18)]">
                <Squares2X2Icon className="h-6 w-6 text-white" />
              </div>
              <div className={`${collapsed ? 'hidden' : 'block'}`}>
                <div className="font-semibold">PolicyOps</div>
                <div className="text-xs text-slate-400">Governance hub</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const active = location.pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                      active ? 'bg-indigo-500/15 text-indigo-100' : 'text-slate-300 hover:bg-white/5 hover:text-slate-100'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span className={`${collapsed ? 'hidden' : 'block'}`}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="sticky bottom-0 px-5 pb-5 pt-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-slate-100">
                  <UserCircleIcon className="h-6 w-6" />
                </div>
                <div className={`${collapsed ? 'hidden' : 'block'}`}>
                  <div className="font-medium text-slate-100">{user?.name ?? 'Team Member'}</div>
                  <div className="text-xs text-slate-400">{role ?? 'Guest'}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 py-4 shadow-sm sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 sm:hidden"
                  aria-label="Open navigation menu"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
                <div>
                  <div className="text-sm font-medium text-slate-300">Welcome back</div>
                  <div className="text-lg font-semibold text-slate-100">{user?.name ?? 'Team Member'}</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(role === 'Admin' ? '/admin/policies' : '/employee/search')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  Search policies
                </button>
                <button
                  type="button"
                  onClick={() => navigate(role === 'Admin' ? '/admin/policies/new' : '/employee/policies')}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 text-sm font-medium text-white shadow-soft transition hover:opacity-95"
                >
                  New policy
                </button>
              </div>

              <div className="flex items-center gap-3">
                {role === 'Admin' ? (
                  <button
                    type="button"
                    onClick={() => navigate('/admin/analytics')}
                    className="hidden sm:inline-flex h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    Analytics
                  </button>
                ) : null}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAlertsOpen((value) => !value)}
                    className="relative p-3 rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                    aria-label="Notifications"
                  >
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute -right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-fuchsia-500 ring-2 ring-slate-950" />
                  </button>
                  {alertsOpen ? (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-soft backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-100">
                        <span>Notifications</span>
                        <button
                          type="button"
                          onClick={() => setAlertsOpen(false)}
                          className="text-slate-400 hover:text-slate-100"
                        >
                          Close
                        </button>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <p className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                          Notifications are not available because backend notification endpoints are not exposed in this build.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {mobileOpen ? (
            <div className="fixed inset-0 z-40 bg-slate-950/95 p-5 sm:hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="font-semibold text-slate-100">Navigation</div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                  aria-label="Close navigation menu"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const active = location.pathname.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center gap-3 rounded-3xl px-4 py-4 text-sm font-medium transition ${
                        active ? 'bg-indigo-500/15 text-indigo-100' : 'text-slate-300 hover:bg-white/5'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          ) : null}

          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

