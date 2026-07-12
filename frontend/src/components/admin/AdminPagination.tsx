type AdminPaginationProps = {
  page: number
  lastPage: number
  onPrev: () => void
  onNext: () => void
  showingText?: string
  loading?: boolean
}

export default function AdminPagination({
  page,
  lastPage,
  onPrev,
  onNext,
  showingText,
  loading = false,
}: AdminPaginationProps) {
  return (
    <div className="mt-4 w-full overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        {showingText ? <span className="min-w-0">{showingText}</span> : <span />}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={onPrev}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={loading || page >= lastPage}
            onClick={onNext}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

