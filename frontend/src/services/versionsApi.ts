import { apiClient } from './apiClient'

export type PolicyVersion = {
  id: number
  policy_document_id: number
  version_number: number
  title: string | null
  content: string | null
  change_summary: string | null
  created_by: number
  approved_by: number | null
  approved_at: string | null
  created_at: string | null
  updated_at: string | null
  creator?: { id: number; name: string; email: string } | null
  approver?: { id: number; name: string; email: string } | null
}

export type PolicyVersionMeta = {
  total: number
  per_page: number
  current_page: number
  last_page: number
}

export const listPolicyVersions = (policyId: number, params: Record<string, unknown> = {}) =>
  apiClient.get<{ data: PolicyVersion[]; meta: PolicyVersionMeta }>(`/policies/${policyId}/versions`, { params })

export const createPolicyVersion = (policyId: number, payload: { title?: string; content?: string; change_summary?: string }) =>
  apiClient.post<{ status: string; data: PolicyVersion }>(`/policies/${policyId}/versions`, payload)

export const getLatestPolicyVersion = (policyId: number) =>
  apiClient.get<{ status: string; data: PolicyVersion }>(`/policies/${policyId}/versions/latest`)

export const getPolicyVersion = (policyId: number, versionId: number) =>
  apiClient.get<{ status: string; data: PolicyVersion }>(`/policies/${policyId}/versions/${versionId}`)