import { useAuth as useAuthCtx } from '../context/AuthContext'

export function useAuth() {
  return useAuthCtx()
}

