import React, { useEffect, useState } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../hooks/useToast'
import { AppDataProvider } from '../context/AppDataContext'

export function AppProviders({ children }: { children: React.ReactNode }) {

  const [hydrated, setHydrated] = useState(false)


  // Delay hydration slightly to avoid localStorage mismatches during SSR-style renders.
  useEffect(() => {
    const timeout = window.setTimeout(() => setHydrated(true), 0)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!hydrated) return <div className="min-h-screen bg-slate-950" />

  return (
    <ToastProvider>
      <AuthProvider>
        <AppDataProvider>{children}</AppDataProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

