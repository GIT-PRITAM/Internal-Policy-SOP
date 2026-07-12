import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Role } from '../context/AuthContext'

export function RoleGuard({ roles, children }: { roles: Role[]; children?: React.ReactNode }) {
  const { role } = useAuth()
  if (!role) return <Navigate to="/login" replace />
  if (!roles.includes(role)) return <Navigate to="/" replace />
  return <>{children}</>
}

