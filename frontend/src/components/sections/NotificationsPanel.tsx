import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'
import {
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  unreadNotificationCount,
  type NotificationItem,
} from '../../services/notificationsApi'
import { useToast } from '../../hooks/useToast'

export function NotificationsPanel() {
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  const [page, setPage] = useState(1)
  const perPage = 10

  const refresh = async () => {
    const [countRes, listRes] = await Promise.all([
      unreadNotificationCount(),
      listNotifications({ per_page: perPage, page, status: 'all' }),
    ])

    const nextCount = (countRes.data as any)?.data?.unread_count ?? 0
    setUnreadCount(nextCount)

    const data = (listRes.data as any)?.data
    // Backend currently returns {status, data: NotificationResource::collection, meta: {...}}.
    // Axios shape for resources is typically data: {data: ... , meta: ...} or direct array.
    // We keep this defensive.
    const nextItems: NotificationItem[] = Array.isArray(data) ? data : (data?.items ?? [])
    setItems(nextItems)
  }

  useEffect(() => {
    let cancelled = false
    async function boot() {
      setLoading(true)
      setError(null)
      try {
        await refresh()
      } catch {
        if (!cancelled) setError('Unable to load notifications.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const markOneRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      toast.show({ tone: 'success', title: 'Marked as read' })
      await refresh()
    } catch {
      toast.show({ tone: 'error', title: 'Failed', message: 'Unable to mark notification as read.' })
    }
  }

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead()
      toast.show({ tone: 'success', title: 'All read' })
      await refresh()
    } catch {
      toast.show({ tone: 'error', title: 'Failed', message: 'Unable to mark all as read.' })
    }
  }

  const header = useMemo(() => {
    if (unreadCount > 0) return <Badge tone="amber">{unreadCount} unread</Badge>
    return <Badge tone="slate">All caught up</Badge>
  }, [unreadCount])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold">Notifications</div>
          <div className="text-sm text-slate-400 mt-1">Updates that matter to you.</div>
        </div>
        <div className="flex items-center gap-2">
          {header}
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0 || loading}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
          >
            Mark all read
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 text-sm text-red-300">{error}</div> : null}

      <div className="mt-5 space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : items.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up." />
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-white/10 bg-slate-950/20 p-4 flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-slate-100">{n.title}</div>
                  {!n.is_read ? <Badge tone="amber">Unread</Badge> : <Badge tone="slate">Read</Badge>}
                </div>
                <div className="text-sm text-slate-300 mt-2">{n.message}</div>
                <div className="text-xs text-slate-400 mt-2">
                  {n.created_at ? new Date(n.created_at).toLocaleString() : '—'}
                </div>
              </div>
              <div>
                {!n.is_read ? (
                  <button
                    type="button"
                    onClick={() => markOneRead(n.id)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                  >
                    Mark read
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm text-slate-400">Page {page}</div>
        <button
          type="button"
          disabled={loading || items.length < perPage}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

