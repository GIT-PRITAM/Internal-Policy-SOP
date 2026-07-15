import { useEffect, useMemo, useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import { useAppData } from '../../context/AppDataContext'

import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { createUser, deleteUser, listDepartments, listUsers, updateUser } from '../../services/api'
import type { Department, PaginatedResponse, User } from '../../services/api'
import { useToast } from '../../hooks/useToast'

type ApiListUsersPayload = {
  items: User[]
  meta: PaginatedResponse<User>['meta']
}


type FormMode = 'create' | 'edit'

type UserFormState = {
  name: string
  email: string
  password: string
  role_id: number | ''
  department_id: number | ''
}

const roleLabelFromId = (roleId: number | null | undefined) => {
  if (roleId === 1) return 'Admin'
  if (roleId === 2) return 'Employee'
  return 'Unknown'
}

export default function AdminUsersPage() {
  const toast = useToast()

  const { state: appData, setState } = useAppData()
  const cached = appData.adminUsers

  const [items, setItems] = useState<User[]>([])
  const [meta, setMeta] = useState<{ total: number; per_page: number; current_page: number; last_page: number } | null>(null)


  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [search, setSearch] = useState('')

  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentsLoading, setDepartmentsLoading] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<UserFormState>({
    name: '',
    email: '',
    password: '',
    role_id: 2,
    department_id: '',
  })

  const canPrev = (meta?.current_page ?? 1) > 1
  const canNext = (meta?.current_page ?? 1) < (meta?.last_page ?? 1)

  const params = useMemo(() => {
    const p: Record<string, unknown> = { per_page: perPage, page }
    if (search.trim()) p.search = search.trim()
    return p
  }, [page, perPage, search])

  async function loadDepartments() {
    setDepartmentsLoading(true)
    try {
      const res = await listDepartments({ per_page: 200 })
      const payload = res.data?.data ?? res.data
      const nextItems = (payload?.items ?? []) as Department[]
      setDepartments(nextItems)
    } catch {
      toast.show({ tone: 'error', title: 'Department load failed', message: 'Could not load departments.' })
    } finally {
      setDepartmentsLoading(false)
    }
  }

  async function loadUsers() {
    // Use cached data on first visit (page=1, no search)
    if (cached && page === 1 && !search) {
      setItems(cached.items)
      setMeta(cached.meta)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await listUsers(params)
      const payload = (res.data as any)?.data ?? (res.data as any)
      const typed = payload as Partial<ApiListUsersPayload>
      const nextItems = typed?.items ?? []
      const nextMeta = (typed?.meta as any) ?? null


      setItems(nextItems)
      setMeta(nextMeta)

      // Store in AppDataContext when on page 1 without search
      if (page === 1 && !search) {
        setState((prev) => ({
          ...prev,
          adminUsers: {
            items: nextItems,
            meta: nextMeta,
          },
        }))
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load users')
      toast.show({ tone: 'error', title: 'Users load failed', message: 'Could not load users.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search])

  function openCreate() {
    setFormMode('create')
    setSelectedUser(null)
    setFormError(null)
    setForm({ name: '', email: '', password: '', role_id: 2, department_id: '' })
    setShowForm(true)
  }

  function openEdit(u: User) {
    setFormMode('edit')
    setSelectedUser(u)
    setFormError(null)
    setForm({
      name: u.name ?? '',
      email: u.email ?? '',
      password: '',
      role_id: u.role_id ?? 2,
      department_id: u.department_id ?? '',
    })
    setShowForm(true)
  }

  async function submitForm() {
    setFormLoading(true)
    setFormError(null)
    try {
      if (formMode === 'create') {
        if (!form.password.trim()) {
          setFormError('Password is required for user creation.')
          return
        }
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role_id: Number(form.role_id),
          department_id: form.department_id === '' ? null : Number(form.department_id),
        }
        await createUser(payload)
        toast.show({ tone: 'success', title: 'User created' })
      } else if (selectedUser) {
        const payload: any = {
          name: form.name.trim(),
          email: form.email.trim(),
          role_id: Number(form.role_id),
          department_id: form.department_id === '' ? null : Number(form.department_id),
        }
        if (form.password.trim()) payload.password = form.password

        await updateUser(selectedUser.id, payload)
        toast.show({ tone: 'success', title: 'User updated' })
      }

      setShowForm(false)
      await loadUsers()
    } catch (e: any) {
      const msg = e?.response?.data?.message
      const details = e?.response?.data?.errors as Record<string, string[]> | undefined
      const firstError = details ? Object.values(details)[0]?.[0] : null
      setFormError(firstError ?? msg ?? 'Validation failed')
      toast.show({ tone: 'error', title: 'Save failed', message: firstError ?? msg ?? 'Validation failed' })
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete(id: number) {
    const ok = window.confirm('Delete this user? This action cannot be undone.')
    if (!ok) return

    try {
      await deleteUser(id)
      toast.show({ tone: 'success', title: 'User deleted' })
      await loadUsers()
    } catch (e: any) {
      toast.show({ tone: 'error', title: 'Delete failed', message: e?.response?.data?.message ?? 'Could not delete user.' })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <div className="text-3xl font-semibold">Users</div>
          <div className="text-slate-400 mt-1">Role-based access control and department ownership.</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">Member directory</div>
              <div className="text-sm text-slate-400 mt-1">Manage roles and access.</div>
            </div>
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-medium rounded-xl shadow-soft hover:opacity-95 transition"
            >
              Invite User
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              placeholder="Search by name or email"
              className="flex-1 min-w-[18rem] px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
            />

            <div className="text-xs text-slate-400">
              {meta ? (
                <span>
                  Page {meta.current_page} of {meta.last_page} • {meta.total} total
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="py-3 px-3 font-semibold">Name</th>
                  <th className="py-3 px-3 font-semibold">Email</th>
                  <th className="py-3 px-3 font-semibold">Role</th>
                  <th className="py-3 px-3 font-semibold">Department</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-3 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="py-8 px-3">
                        <EmptyState title="No users found" description="Try adjusting your search." />
                      </td>
                  </tr>
                ) : (
                  items.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition">
                      <td className="py-3 px-3">{u.name}</td>
                      <td className="py-3 px-3 text-slate-300">{u.email}</td>
                      <td className="py-3 px-3">
                        <Badge tone={u.role_id === 1 ? 'indigo' : 'slate'}>{roleLabelFromId(u.role_id)}</Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {u.department_id
                          ? departments.find((d) => d.id === u.department_id)?.name ?? `#${u.department_id}`
                          : '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-300">Active</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(u)}
                            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-100 hover:bg-white/10 transition"
                          >
                            View/Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-950/30 text-xs text-red-100 hover:bg-red-950/50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              disabled={!canPrev || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <div className="text-sm text-slate-400">{meta ? `Showing page ${meta.current_page}` : ''}</div>

            <button
              disabled={!canNext || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold">
                    {formMode === 'create' ? 'Create User' : `Edit User${selectedUser ? ` #${selectedUser.id}` : ''}`}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {formMode === 'create' ? 'Add a new employee/admin account.' : 'Update name, email, role, and department.'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setFormError(null)
                  }}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-slate-100 hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <label className="space-y-1">
                  <div className="text-sm text-slate-300">Name</div>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-sm text-slate-300">Email</div>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-sm text-slate-300">Password</div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                    placeholder={formMode === 'edit' ? 'Leave blank to keep current' : 'Required'}
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-sm text-slate-300">Role</div>
                  <select
                    value={String(form.role_id)}
                    onChange={(e) => setForm((f) => ({ ...f, role_id: Number(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Employee</option>
                  </select>
                </label>

                <label className="space-y-1">
                  <div className="text-sm text-slate-300">Department</div>
                  <select
                    value={String(form.department_id)}
                    onChange={(e) => {
                      const v = e.target.value
                      setForm((f) => ({ ...f, department_id: v === '' ? '' : Number(v) }))
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                    disabled={departmentsLoading}
                  >
                    <option value="">Unassigned</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>

                {formError ? <div className="text-sm text-red-200">{formError}</div> : null}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setFormError(null)
                    }}
                    disabled={formLoading}
                    className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-100 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitForm}
                    disabled={formLoading}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-medium shadow-soft hover:opacity-95 transition disabled:opacity-40"
                  >
                    {formLoading ? 'Saving...' : formMode === 'create' ? 'Create' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="text-sm text-red-200 bg-red-950/30 border border-red-500/20 rounded-2xl p-4">{error}</div>
        ) : null}
      </div>
    </AppLayout>
  )
}