import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'
import { PolicyCard } from '../../components/widgets/PolicyCard'

export default function EmployeeBookmarksPage() {
  const bookmarks = [
    { t: 'Remote Work SOP', b: 'Bookmarked' },
    { t: 'Incident Response Playbook', b: 'Bookmarked' },
    { t: 'Access Management Policy', b: 'Bookmarked' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-semibold">Bookmarks</div>
          <div className="text-slate-400 mt-1">Your saved policies for quick access.</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge tone="fuchsia">{bookmarks.length} saved</Badge>
              <div className="text-sm text-slate-300">Keep track of what matters.</div>
            </div>
            <div className="text-xs text-slate-400">Syncs with your account</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookmarks.map((p) => (
              <div key={p.t} className="transition hover:-translate-y-0.5">
                <PolicyCard title={p.t} badge="Bookmarked" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

