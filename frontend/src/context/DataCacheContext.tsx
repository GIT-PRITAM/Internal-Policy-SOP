import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type CacheEntry<T> = {
  value: T
  fetchedAt: number
}

type GetResult<T> = { value: T; isStale: boolean } | null

type DataCacheContextValue = {
  getCached: <T>(key: string, maxAgeMs?: number) => GetResult<T>
  setCached: <T>(key: string, value: T) => void
  invalidate: (keyPrefix: string) => void
  invalidateAll: () => void
  isHydrated: boolean
}

const DataCacheContext = createContext<DataCacheContextValue | undefined>(undefined)

function now() {
  return Date.now()
}

export function DataCacheProvider({ children }: { children: React.ReactNode }) {
  // In-memory cache for the lifetime of the SPA session.
  const [cache, setCache] = useState<Map<string, CacheEntry<any>>>(() => new Map())
  const [isHydrated] = useState(true)

  const getCached = useCallback(
    <T,>(key: string, maxAgeMs: number = 60_000): GetResult<T> => {
      const entry = cache.get(key) as CacheEntry<T> | undefined
      if (!entry) return null
      const age = now() - entry.fetchedAt
      return { value: entry.value, isStale: age > maxAgeMs }
    },
    [cache],
  )

  const setCached = useCallback(
    <T,>(key: string, value: T) => {
      setCache((prev) => {
        const next = new Map(prev)
        next.set(key, { value, fetchedAt: now() })
        return next
      })
    },
    [],
  )

  const invalidate = useCallback((keyPrefix: string) => {
    setCache((prev) => {
      const next = new Map(prev)
      for (const k of next.keys()) {
        if (k.startsWith(keyPrefix)) next.delete(k)
      }
      return next
    })
  }, [])

  const invalidateAll = useCallback(() => {
    setCache(new Map())
  }, [])

  const value = useMemo<DataCacheContextValue>(
    () => ({
      getCached,
      setCached,
      invalidate,
      invalidateAll,
      isHydrated,
    }),
    [getCached, setCached, invalidate, invalidateAll, isHydrated],
  )

  return <DataCacheContext.Provider value={value}>{children}</DataCacheContext.Provider>
}

export function useDataCache(): DataCacheContextValue {
  const ctx = useContext(DataCacheContext)
  if (!ctx) throw new Error('useDataCache must be used within DataCacheProvider')
  return ctx
}

