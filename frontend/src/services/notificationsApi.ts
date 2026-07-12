import { apiClient } from './apiClient'

export type NotificationItem = {
  id: number
  type: string
  title: string
  message: string
  is_read: boolean
  read_at: string | null
  created_at: string | null
  updated_at: string | null
  data?: Record<string, unknown> | null
}

export type NotificationsListResponse = {
  status: string
  data: {
    items: NotificationItem[]
    meta: {
      total: number
      per_page: number
      current_page: number
      last_page: number
    }
  }
}

export const listNotifications = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ status: string; data: NotificationItem[]; meta?: any }>('/notifications', { params })

export const unreadNotificationCount = () =>
  apiClient.get<{ status: string; data: { unread_count: number } }>('/notifications/unread-count')

export const markNotificationAsRead = (notificationId: number) =>
  apiClient.patch<{ status: string; message: string }>(`/notifications/${notificationId}/read`)

export const markAllNotificationsAsRead = () =>
  apiClient.patch<{ status: string; message: string }>(`/notifications/read-all`)

