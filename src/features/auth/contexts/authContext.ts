import { createContext } from 'react'

import type { AuthUser } from '@/features/auth/apis/getMyInfo'

export type LogoutOptions = {
  shouldRedirect?: boolean
}

export type AuthContextValue = {
  accessToken: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (nextAccessToken: string) => Promise<void>
  logout: (options?: LogoutOptions) => void
  refreshUser: () => Promise<void>
  user: AuthUser | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)
