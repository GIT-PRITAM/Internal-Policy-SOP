import React from 'react'
import { Skeleton } from '../ui/Skeleton'

export function SearchBarSkeleton({ heightClass = 'h-11' }: { heightClass?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 px-4 py-2 ${heightClass} flex items-center gap-3`} aria-busy="true">
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <div className="flex-1" />
      <Skeleton className="h-4 w-6" />
    </div>
  )
}

export function FilterDropdownSkeleton({ widthClass = 'w-full' }: { widthClass?: string }) {
  return (
    <div className={`${widthClass} rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center gap-3`} aria-busy="true">
      <Skeleton className="h-4 w-24" />
      <div className="flex-1" />
      <Skeleton className="h-4 w-4" />
    </div>
  )
}

export function PaginationSkeleton() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3" aria-busy="true">
      <Skeleton className="h-4 w-56" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20 rounded-2xl" />
        <Skeleton className="h-9 w-20 rounded-2xl" />
      </div>
    </div>
  )
}

export function PolicyStatusBadgeSkeleton() {
  return <Skeleton className="h-7 w-20 rounded-full" />
}

export function PolicyTableRowSkeleton() {
  return (
    <tr className="hover:bg-white/5 transition" aria-busy="true">
      <td className="py-3 px-3">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="py-3 px-3 text-slate-300">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="py-3 px-3 text-slate-300">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-3 px-3">
        <PolicyStatusBadgeSkeleton />
      </td>
      <td className="py-3 px-3 text-slate-300">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-3 px-3 space-x-2">
        <div className="flex items-center gap-2 justify-end">
          <Skeleton className="h-9 w-16 rounded-xl" />
          <Skeleton className="h-9 w-16 rounded-xl" />
        </div>
      </td>
    </tr>
  )
}

export function PolicyEditorSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]" aria-busy="true">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />

          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full rounded-xl" />

          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-80 w-full rounded-xl" />

          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-11 w-48 rounded-2xl" />
            <Skeleton className="h-11 w-44 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
        <Skeleton className="h-5 w-32" />
        <div className="mt-5 space-y-4">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx}>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PolicyDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div>
        <Skeleton className="h-8 w-44" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="mt-3 h-4 w-96" />

        <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/20 p-4">
          <Skeleton className="h-5 w-40" />
          <div className="mt-3 space-y-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-80" />
        <Skeleton className="mt-4 h-36 w-full" />
      </div>
    </div>
  )
}

export function UserTableSkeleton({ rowCount = 8 }: { rowCount?: number }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <tr key={idx} className="hover:bg-white/5 transition" aria-busy="true">
          <td className="py-3 px-3">
            <Skeleton className="h-4 w-44" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-72" />
          </td>
          <td className="py-3 px-3">
            <Skeleton className="h-7 w-20 rounded-full" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-56" />
          </td>
          <td className="py-3 px-3 text-slate-300">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-3 px-3 text-right">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export function AvatarSkeleton() {
  return <Skeleton className="h-10 w-10 rounded-full" />
}

