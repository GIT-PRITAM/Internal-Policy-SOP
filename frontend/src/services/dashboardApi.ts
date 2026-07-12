import { apiClient } from './apiClient'

export type DashboardStatsCard = {
  title: string
  value: number | string
  description?: string
  delta?: string
  tone: 'indigo' | 'fuchsia' | 'amber' | 'green'
}

export type DashboardChartPayload = {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    tension?: number
    fill?: boolean
  }>
}

export type AdminDashboardResponse = {
  stats: DashboardStatsCard[]
  departmentAnalytics: Array<{ name: string; progress: number }>
  pendingReviews: Array<{
    id: number
    policy_document_id: number
    status: string
    comments: string | null
    approver_user_id: number
    approver?: { id: number; name: string; email: string } | null
  }>
  topPolicies: Array<{
    id: number
    title: string
    summary: string | null
    status: string
    department_id: number | null
  }>
  chart: DashboardChartPayload
}

export type EmployeeDashboardResponse = {
  stats: DashboardStatsCard[]
  pendingAcknowledgements: Array<{
    policy_title: string | null
    policy_summary: string | null
    badge: string
    badgeTone: 'indigo' | 'fuchsia' | 'amber' | 'green'
    policy_document_id: number
  }>
  recentUpdates: Array<{
    title: string
    badge: string
    badgeTone: 'indigo' | 'fuchsia' | 'amber' | 'green'
    description: string
    policy_document_id: number
  }>
  bookmarkedPolicies: Array<{
    title: string
    policy_document_id: number
    shared_by: string
  }>
  chart: DashboardChartPayload
}

export const getAdminDashboard = () =>
  apiClient.get<{ status: string; data: AdminDashboardResponse }>('/dashboard/admin')

export const getEmployeeDashboard = () =>
  apiClient.get<{ status: string; data: EmployeeDashboardResponse }>('/dashboard/employee')

