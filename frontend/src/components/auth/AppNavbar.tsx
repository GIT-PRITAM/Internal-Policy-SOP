import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AppNavbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-slate-950/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
              aria-label="Go to home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 border border-white/10 shadow-soft grid place-items-center">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-white font-semibold tracking-tight">Internal Policy &amp; SOP</div>
                <div className="text-slate-300 text-xs">Policy governance platform</div>
              </div>
            </button>

            <div className="hidden sm:flex items-center gap-3 text-slate-300 text-sm">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Secure • Role-based • Auditable
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

