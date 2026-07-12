import { apiClient } from './apiClient'

export type Policy = {
  id: number
  department_id: number | null
  owner_user_id: number | null
  title: string
  summary: string | null
  content: string | null
  visibility: 'Public' | 'Department' | 'Private'
  status: 'Draft' | 'Under Review' | 'Approved' | 'Archived'
  mandatory: boolean
  effective_date: string | null
  review_date: string | null
  current_version_id: number | null
  created_at: string | null
  updated_at: string | null
}

export type Department = {
  id: number
  name: string
  description: string | null
  created_at: string | null
  updated_at: string | null
}

export type ApprovalItem = {
  id: number
  policy_document_id: number
  policy_version_id: number
  approver_user_id: number
  status: string
  comments: string | null
  action_at: string | null
  created_at: string | null
  updated_at: string | null
  policy_document?: Policy
  approver?: { id: number; name: string; email: string }
  policy_version?: { id: number; title?: string }
}

export type User = {
  id: number
  name: string
  email: string
  role_id?: number | null
  department_id?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export type PaginatedResponse<T> = {
  items: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export const listPolicies = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: PaginatedResponse<Policy> }>('/policies', { params })

export const getPolicy = (id: number, params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: { policy: Policy } }>(`/policies/${id}`, { params })

export const createPolicy = (payload: Partial<Policy>) =>
  apiClient.post<{ status: string; data: { policy: Policy } }>('/policies', payload)

export const updatePolicy = (id: number, payload: Partial<Policy>) =>
  apiClient.put<{ status: string; data: { policy: Policy } }>(`/policies/${id}`, payload)

export const deletePolicy = (id: number) => apiClient.delete<{ status: string }>(`/policies/${id}`)

export const listDepartments = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: PaginatedResponse<Department> }>('/departments', { params })

export const createDepartment = (payload: Pick<Department, 'name' | 'description'>) =>
  apiClient.post<{ status: string; data: { department: Department } }>('/departments', payload)

export const updateDepartment = (id: number, payload: Partial<Department>) =>
  apiClient.put<{ status: string; data: { department: Department } }>(`/departments/${id}`, payload)

export const deleteDepartment = (id: number) => apiClient.delete<{ status: string }>(`/departments/${id}`)

export const listApprovals = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: { items: ApprovalItem[]; meta: { total: number; per_page: number; current_page: number; last_page: number } } }>('/approvals/history', { params })

export const listBookmarks = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: Policy[]; meta: { total: number; per_page: number; current_page: number; last_page: number } }>('/bookmarks', { params })

export const addBookmark = (policyId: number) =>
  apiClient.post<{ status: string; data: { bookmark_id: number } }>('/bookmarks', { policy_id: policyId })

export const removeBookmark = (policyId: number) =>
  apiClient.delete<{ status: string }>(`/bookmarks/${policyId}`)

export const listUsers = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: { items: User[]; meta: { total: number; per_page: number; current_page: number; last_page: number } } }>('/users', { params })

export const createUser = (payload: { name: string; email: string; password: string; role_id: number; department_id?: number | null }) =>
  apiClient.post<{ status: string; data: { user: User } }>('/users', payload)

export const updateUser = (id: number, payload: Partial<User> & { password?: string }) =>
  apiClient.put<{ status: string; data: { user: User } }>(`/users/${id}`, payload)

export const deleteUser = (id: number) => apiClient.delete<{ status: string }>(`/users/${id}`)

export function downloadCsvFile(filename: string, csvContent: string) {

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function policiesToCsv(policies: Policy[]): string {
  const headers = ['ID', 'Title', 'Department ID', 'Visibility', 'Status', 'Mandatory', 'Effective Date', 'Review Date', 'Updated At']
  const rows = policies.map((policy) => [
    policy.id,
    '"' + (policy.title ?? '').replace(/"/g, '""') + '"',
    policy.department_id ?? '',
    policy.visibility,
    policy.status,
    policy.mandatory ? 'Yes' : 'No',
    policy.effective_date ?? '',
    policy.review_date ?? '',
    policy.updated_at ?? '',
  ])
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
}
