import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

import type {
  AdminDashboardResponse,
} from '../services/dashboardApi'
import type {
  Department,
  PaginatedResponse,
  Policy,
  User,
} from '../services/api'
import type { ApprovalItem } from '../services/api'
import type {
  AcknowledgementPolicyItem,
  AcknowledgementsMeta,
} from '../services/acknowledgementsApi'

export type AppDataState = {
  // Admin
  adminDashboard: AdminDashboardResponse | null
  adminDepartments: Department[] | null
  adminUsers: {
    items: User[]
    meta: PaginatedResponse<User>['meta']
  } | null
  adminReviewBoard: { items: ApprovalItem[] } | null
  adminPolicies: {
    items: Policy[]
    meta: PaginatedResponse<Policy>['meta']
  } | null

  // Analytics
  adminAnalytics: AdminDashboardResponse | null

  // Employee
  employeeDashboard: any | null
  employeeBookmarks: Policy[] | null
  employeePolicies: {
    items: Policy[]
    meta: PaginatedResponse<Policy>['meta']
  } | null
  employeeAcknowledgementsPending: {
    items: AcknowledgementPolicyItem[]
    meta: AcknowledgementsMeta
  } | null
  employeeAcknowledgementsCompleted: {
    items: AcknowledgementPolicyItem[]
    meta: AcknowledgementsMeta
  } | null
}

const defaultState: AppDataState = {
  adminDashboard: null,
  adminDepartments: null,
  adminUsers: null,
  adminReviewBoard: null,
  adminPolicies: null,
  adminAnalytics: null,
  employeeDashboard: null,
  employeeBookmarks: null,
  employeePolicies: null,
  employeeAcknowledgementsPending: null,
  employeeAcknowledgementsCompleted: null,
}

type AppDataContextValue = {
  state: AppDataState
  setState: React.Dispatch<React.SetStateAction<AppDataState>>
  invalidateAll: () => void
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined)

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppDataState>(defaultState)

  const invalidateAll = useCallback(() => {
    setState(defaultState)
  }, [])

  const value = useMemo<AppDataContextValue>(
    () => ({ state, setState, invalidateAll }),
    [state, invalidateAll],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}

