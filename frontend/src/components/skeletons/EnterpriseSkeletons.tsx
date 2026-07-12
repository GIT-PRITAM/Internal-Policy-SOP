import React from 'react'
import { Skeleton } from '../ui/Skeleton'

export function SkeletonBar({ className }: { className?: string }) {
  return <Skeleton className={className ?? 'h-4 w-full'} />
}

export function SkeletonHeaderBlock({
  titleClassName,
  subtitleClassName,
}: {
  titleClassName?: string
  subtitleClassName?: string
}) {
  return (
    <div className="space-y-3">
      <Skeleton className={titleClassName ?? 'h-4 w-52'} />
      <Skeleton className={subtitleClassName ?? 'h-3 w-96'} />
      <Skeleton className={subtitleClassName ? 'h-3 w-80' : 'h-3 w-80'} />
    </div>
  )
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-indigo-500/10 p-5 shadow-soft">
          <Skeleton className="h-3 w-28 text-indigo-200" />
          <div className="mt-4 flex items-center justify-between gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
          </div>
          <Skeleton className="mt-4 h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonChartBlock({ heightClass = 'h-44' }: { heightClass?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className={`mt-3 ${heightClass} w-full`}>
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  )
}

export function SkeletonPolicyCard({
  variant = 'default',
}: {
  variant?: 'default' | 'compact'
}) {
  // Mirrors PolicyCard shape:
  // container: rounded-2xl border bg-slate-950/20 p-4 shadow-soft
  const compact = variant === 'compact'
  return (
    <div
      className={
        compact
          ? 'group flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/20 p-3 shadow-soft'
          : 'group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/20 p-4 shadow-soft'
      }
      aria-busy="true"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className={compact ? 'h-4 w-40' : 'h-5 w-56'} />
          {!compact ? <Skeleton className="h-4 w-72" /> : null}
        </div>
        <Skeleton className={compact ? 'h-6 w-16 rounded-full' : 'h-7 w-18 rounded-full'} />
      </div>
      {!compact ? <Skeleton className="h-3 w-52" /> : null}
    </div>
  )
}

export function SkeletonPolicyCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonPolicyCard key={idx} />
      ))}
    </div>
  )
}

export function SkeletonTableRows({
  rowCount = 8,
  columns = 6,
}: {
  rowCount?: number
  columns?: number
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <tr key={idx} className="hover:bg-white/5 transition">
          <td className="py-3 px-3">
            <Skeleton className="h-4 w-40" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="py-3 px-3">
            <Skeleton className="h-7 w-20 rounded-full" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="py-3 px-3 space-x-2">
            <div className="flex items-center gap-2 justify-end">
              <Skeleton className="h-9 w-18 rounded-xl" />
              <Skeleton className="h-9 w-18 rounded-xl" />
            </div>
          </td>
          {/* keep TS/DOM consistent; columns is informational */}
          <td className="hidden" colSpan={columns} />
        </tr>
      ))}
    </>
  )
}

export function SkeletonDepartmentForm({ loading }: { loading?: boolean }) {
  if (!loading) return null
  return (
    <div className="mt-5 space-y-4" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  )
}

export function SkeletonDepartmentList({ count = 5 }: { count?: number }) {
  return (
    <div className="mt-5 space-y-3" aria-busy="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-20 rounded-2xl" />
              <Skeleton className="h-10 w-20 rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonUserTable({ rowCount = 6 }: { rowCount?: number }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <tr key={idx} className="hover:bg-white/5 transition">
          <td className="py-3 px-3">
            <Skeleton className="h-4 w-36" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-64" />
          </td>
          <td className="py-3 px-3">
            <Skeleton className="h-7 w-18 rounded-full" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-44" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="py-3 px-3 text-right">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-18 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

