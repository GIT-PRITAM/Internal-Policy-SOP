import { useEffect, useMemo, useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import AdminPageContainer from '../../components/admin/AdminPageContainer'

import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { createDepartment, deleteDepartment, listDepartments, updateDepartment, Department } from '../../services/api'
import { SkeletonDepartmentList } from '../../components/skeletons/EnterpriseSkeletons'

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [updating, setUpdating] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadDepartments = async () => {
    setLoading(true)
    try {
      const res = await listDepartments({ per_page: 100 })
      setDepartments(res.data.data.items)
    } catch (err) {
      setError('Unable to load departments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const resetForm = () => {
    setName('')
    setDescription('')
    setEditId(null)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Enter a department name.')
      return
    }

    setSaving(true)
    try {
      if (editId) {
        await updateDepartment(editId, { name, description })
      } else {
        await createDepartment({ name, description })
      }
      resetForm()
      await loadDepartments()
    } catch (err) {
      setError('Unable to save department.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (department: Department) => {
    setEditId(department.id)
    setName(department.name)
    setDescription(department.description ?? '')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this department?')) return
    setUpdating(true)
    try {
      await deleteDepartment(id)
      await loadDepartments()
    } catch (err) {
      setError('Unable to delete department.')
    } finally {
      setUpdating(false)
    }
  }

  const sortedDepartments = useMemo(
    () => [...departments].sort((a, b) => a.name.localeCompare(b.name)),
    [departments],
  )

  return (
<AppLayout>
      <AdminPageContainer>
        <div className="min-w-0">

          <div className="text-3xl font-semibold">Departments</div>
          <div className="text-slate-400 mt-1">Manage policy ownership and team structure.</div>
        </div>


        <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)] min-w-0">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{editId ? 'Edit department' : 'Add department'}</div>
                <div className="text-sm text-slate-400 mt-1">Create or update how policies are grouped.</div>
              </div>
              {editId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <div className="text-sm text-slate-300 mb-2">Department name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                  placeholder="e.g. Human Resources"
                />
              </label>
              <label className="block">
                <div className="text-sm text-slate-300 mb-2">Description</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/30 border border-white/10 px-3 py-2 outline-none focus:border-indigo-400"
                  rows={4}
                  placeholder="Short summary of department goals"
                />
              </label>
              {error ? <div className="text-sm text-red-300">{error}</div> : null}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-medium text-white shadow-soft transition hover:opacity-95 disabled:opacity-60"
              >
                {editId ? 'Save changes' : 'Create department'}
              </button>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Department list</div>
                  <div className="text-sm text-slate-400 mt-1">Departments are used when assigning policy scope.</div>
                </div>
                <Badge tone="indigo">{departments.length}</Badge>
              </div>

              {loading ? (
                <div className="mt-5" aria-busy="true" aria-live="polite">
                  <div className="text-slate-300 text-sm mb-3">Preparing department data…</div>
                  <SkeletonDepartmentList count={5} />
                </div>
              ) : sortedDepartments.length === 0 ? (

                <div className="mt-5">
                  <EmptyState title="No departments yet" description="Create a department to group policies and owners." />
                </div>
              ) : (
            <div className="mt-5 space-y-3 min-w-0">

                  {sortedDepartments.map((department) => (
                    <div key={department.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-semibold text-slate-100">{department.name}</div>
                          <div className="text-sm text-slate-400 mt-1">{department.description || 'No description provided.'}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(department)}
                            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(department.id)}
                            disabled={updating}
                            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminPageContainer>
    </AppLayout>
  )
}

