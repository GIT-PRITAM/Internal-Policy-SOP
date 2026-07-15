import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDataCache } from '../context/DataCacheContext'

export type UseCachedAsyncResult<T> = {
  data: T | null
  loading: boolean
  error: string | null
  refetch: (opts?: { force?: boolean }) => Promise<void>
}

export function useCachedAsync<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts?: {
    staleTimeMs?: number
    enabled?: boolean
    // If true, we will return cached data immediately even if stale.
    // Default is false (stale -> show skeleton).
    returnStaleImmediately?: boolean
  },
): UseCachedAsyncResult<T> {
  const staleTimeMs = opts?.staleTimeMs ?? 60_000
  const enabled = opts?.enabled ?? true
  const returnStaleImmediately = opts?.returnStaleImmediately ?? false

  const { getCached, setCached } = useDataCache()

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const mountedRef = useRef(false)

  const cached = useMemo(() => {
    if (!enabled) return null
    return getCached<T>(key, staleTimeMs)
  }, [enabled, getCached, key, staleTimeMs])

  const doFetch = useCallback(
    async (force?: boolean) => {
      if (!enabled) return

      const cachedNow = getCached<T>(key, staleTimeMs)
      const shouldUseCache = cachedNow && !cachedNow.isStale

      // If we have fresh cache and not forced, do not fetch.
      if (shouldUseCache && !force) {
        setData(cachedNow!.value)
        setError(null)
        setLoading(false)
        return
      }

      // If stale cache exists and user opted to show stale immediately, show it.
      if (cachedNow && cachedNow.isStale && returnStaleImmediately && !force) {
        setData(cachedNow.value)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const next = await fetcher()
        setData(next)
        setCached<T>(key, next)
      } catch (e: any) {
        setError(e?.message ?? 'Request failed')
      } finally {
        setLoading(false)
      }
    },
    [enabled, fetcher, getCached, key, returnStaleImmediately, setCached, staleTimeMs],
  )

  const refetch = useCallback(
    async (nextOpts?: { force?: boolean }) => {
      await doFetch(nextOpts?.force)
    },
    [doFetch],
  )

  useEffect(() => {
    if (!enabled) return
    mountedRef.current = true

    // Initial load: if we have fresh cache, load immediately without skeleton.
    // If we have no cache or cache is stale, we show skeleton while refetching.
    void doFetch(false)

    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key])

  // Keep data in sync with cache when key changes.
  useEffect(() => {
    if (!enabled) return
    if (cached?.value) {
      if (!cached.isStale) setData(cached.value)
    }
  }, [cached?.isStale, cached?.value, enabled])

  return { data, loading, error, refetch }
}

