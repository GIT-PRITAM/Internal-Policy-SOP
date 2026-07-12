import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl border border-white/10 bg-slate-950/30 flex items-center justify-center">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-200" />
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

