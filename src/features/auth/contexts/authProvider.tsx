import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/features/auth/apis/authStorage'
import { getMyInfo, type AuthUser } from '@/features/auth/apis/getMyInfo'
import {
  AuthContext,
  type AuthContextValue,
  type LogoutOptions,
} from '@/features/auth/contexts/authContext'
import { ApiError, setUnauthorizedHandler } from '@/shared/api/fetch'

const getInitialAccessToken = () => getAccessToken()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(getInitialAccessToken)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(Boolean(getInitialAccessToken()))

  const logout = useCallback((options: LogoutOptions = {}) => {
    const { shouldRedirect = false } = options

    clearAccessToken()
    setAccessTokenState(null)
    setUser(null)
    setIsInitializing(false)

    if (!shouldRedirect || typeof window === 'undefined') {
      return
    }

    if (window.location.pathname === ROUTE_PATH.login) {
      return
    }

    window.location.replace(ROUTE_PATH.login)
  }, [])

  const refreshUser = useCallback(async () => {
    const storedAccessToken = getAccessToken()

    if (!storedAccessToken) {
      setAccessTokenState(null)
      setUser(null)
      setIsInitializing(false)
      return
    }

    setAccessTokenState(storedAccessToken)
    setIsInitializing(true)

    try {
      const nextUser = await getMyInfo()
      setUser(nextUser)
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error('Failed to load current user.', error)
      }
    } finally {
      setIsInitializing(false)
    }
  }, [])

  const login = useCallback(async (nextAccessToken: string) => {
    setAccessToken(nextAccessToken)
    setAccessTokenState(nextAccessToken)
    setIsInitializing(true)

    try {
      const nextUser = await getMyInfo()
      setUser(nextUser)
    } catch (error) {
      clearAccessToken()
      setAccessTokenState(null)
      setUser(null)
      throw error
    } finally {
      setIsInitializing(false)
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout({ shouldRedirect: true })
    })

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [logout])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isInitializing,
      login,
      logout,
      refreshUser,
      user,
    }),
    [accessToken, isInitializing, login, logout, refreshUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
