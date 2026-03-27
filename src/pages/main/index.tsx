import { Navigate } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { RouteGateFallback } from '@/features/auth/components/route-gate-fallback'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const MainPage = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <RouteGateFallback />
  }

  if (isAuthenticated) {
    return <Navigate replace to={ROUTE_PATH.myDashboard} />
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-taskify-primary-600">
          Taskify Bootstrap
        </span>
        <h1 className="text-4xl font-bold">메인 랜딩 페이지 스켈레톤</h1>
        <p className="text-base leading-7 text-slate-600">
          P2 단계에서 인증 기반 접근 제어까지 연결했습니다. 이후 Figma와 요구사항을 반영해 실제 랜딩
          UI로 교체합니다.
        </p>
      </div>
    </main>
  )
}
