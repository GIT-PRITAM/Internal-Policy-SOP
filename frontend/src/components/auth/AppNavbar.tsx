import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AppNavbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur px-4 py-3">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
              aria-label="Go to home"
            >
              <div className="h-10 w-10 rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/20 flex items-center justify-center">
                <div className="h-3.5 w-3.5 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(129,140,248,0.6)]" />
              </div>
              <div>
                <div className="font-semibold leading-tight">Corporate Policy &amp; SOP</div>
                <div className="text-xs text-slate-400">Internal Compliance Platform</div>
              </div>
            </button>
          </div>

          {/* Center */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a className="transition hover:text-white" href="#">
              Secure Access
            </a>
            <a className="transition hover:text-white" href="#">
              Official Guidelines
            </a>
            <a className="transition hover:text-white" href="#">
              Smart Repository
            </a>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(168,85,247,0.25)] ring-1 ring-white/10 hover:brightness-110 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            >
              Employee Login
              <span aria-hidden className="text-white/90 font-bold">
                →
              </span>
            </button> */}
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


