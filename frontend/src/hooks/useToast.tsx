import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type ToastTone = 'success' | 'error' | 'info'
export type Toast = { id: string; tone: ToastTone; title: string; message?: string }

type ToastContextValue = {
  show: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { ...toast, id }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4500)
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] w-[min(24rem,calc(100vw-2rem))] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`rounded-2xl border p-4 shadow-soft ${
              toast.tone === 'error'
                ? 'border-red-500/30 bg-red-950 text-red-100'
                : toast.tone === 'success'
                  ? 'border-emerald-500/30 bg-emerald-950 text-emerald-100'
                  : 'border-indigo-500/30 bg-indigo-950 text-indigo-100'
            }`}
          >
            <div className="font-semibold">{toast.title}</div>
            {toast.message ? <div className="mt-1 text-sm opacity-90">{toast.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

