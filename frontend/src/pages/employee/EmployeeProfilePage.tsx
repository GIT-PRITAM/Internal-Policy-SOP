import AppLayout from '../../layouts/AppLayout'
import { Badge } from '../../components/ui/Badge'

export default function EmployeeProfilePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-semibold">Profile</div>
          <div className="text-slate-400 mt-1">Account settings and department info.</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-semibold">Alex Morgan</div>
              <div className="text-slate-400 mt-1">alex.morgan@company.com</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="indigo">Employee</Badge>
                <Badge tone="slate">IT Operations</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Security</div>
              <div className="mt-2 rounded-xl border border-white/10 bg-slate-950/20 p-3 text-sm text-slate-200">Password ••••••••</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-slate-950/20 p-4">
              <div className="text-sm text-slate-400">Work location</div>
              <div className="mt-1 font-medium">Hybrid</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/20 p-4">
              <div className="text-sm text-slate-400">Notifications</div>
              <div className="mt-1 font-medium">Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

