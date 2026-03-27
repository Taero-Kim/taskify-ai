import { Navigate, Outlet } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { RouteGateFallback } from '@/features/auth/components/route-gate-fallback'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * 로그인 이후 접근할 필요가 없는 공개 라우트를 처리합니다.
 */
export const PublicOnlyRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <RouteGateFallback />
  }

  if (isAuthenticated) {
    return <Navigate replace to={ROUTE_PATH.myDashboard} />
  }

  return <Outlet />
}
