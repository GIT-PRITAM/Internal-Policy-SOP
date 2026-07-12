import { PropsWithChildren } from 'react'

export default function AdminPageContainer({ children }: PropsWithChildren) {
  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="space-y-5 sm:space-y-6">{children}</div>
    </div>
  )
}

