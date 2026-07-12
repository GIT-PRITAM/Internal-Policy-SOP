import { apiClient } from './apiClient'

export const acknowledgePolicy = (policyId: number) =>
  apiClient.post<{ status: string; data: { acknowledgement_id: number; policy_id: number; acknowledged_at: string } }>(
    '/acknowledgements/ack',
    { policy_id: policyId }
  )

export type AcknowledgementsMeta = {
  total: number
  per_page: number
  current_page: number
  last_page: number
}

export type AcknowledgementPolicyItem = {
  id: number
  title: string
  summary: string | null
  status: string
  visibility: 'Public' | 'Department' | 'Private'
  mandatory: boolean
  updated_at: string | null
}

export const listPendingAcknowledgements = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: { items: AcknowledgementPolicyItem[] } & any; meta: AcknowledgementsMeta }>(
    '/acknowledgements/pending',
    { params }
  )

export const listCompletedAcknowledgements = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: { items: AcknowledgementPolicyItem[] } & any; meta: AcknowledgementsMeta }>(
    '/acknowledgements/completed',
    { params }
  )

