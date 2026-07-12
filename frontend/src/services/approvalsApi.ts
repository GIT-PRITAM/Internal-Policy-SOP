import { apiClient } from './apiClient'

export type DecideResponse = {
  status: string
  data: {
    approval_id: number
    policy_document_id: number
    status: string
  }
  message?: string
}

export const decideApproval = (approvalId: number, payload: { decision: 'Approved' | 'Rejected'; comments?: string | null }) =>
  apiClient.post<DecideResponse>(`/approvals/${approvalId}/decide`, payload)

export const submitPolicyForReview = (policyId: number, payload: { change_summary?: string }) =>
  apiClient.post<{ status: string; data: { policy: any; approval_id: number }; message: string }>(
    `/policies/${policyId}/submit-for-review`,
    payload
  )