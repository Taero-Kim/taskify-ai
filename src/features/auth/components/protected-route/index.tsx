import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { RouteGateFallback } from '@/features/auth/components/route-gate-fallback'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * 로그인한 사용자만 접근 가능한 라우트를 보호합니다.
 */
export const ProtectedRoute = () => {
  const location = useLocation()
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <RouteGateFallback />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ redirectTo: `${location.pathname}${location.search}` }}
        to={ROUTE_PATH.login}
      />
    )
  }

  return <Outlet />
}
