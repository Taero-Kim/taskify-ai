import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/button'
import { Dropdown } from '@/shared/components/dropdown'

/**
 * 대시보드 계열 화면 상단에 사용하는 헤더입니다.
 */
export const DashboardHeader = ({ actions, title }: { actions?: ReactNode; title?: ReactNode }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate(ROUTE_PATH.home)
  }

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link className="flex items-center gap-3" to={ROUTE_PATH.home}>
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-taskify-primary-600 text-base font-bold text-white shadow-sm">
            T
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">Taskify</span>
        </Link>
        {title ? <div className="min-w-0">{title}</div> : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {actions}
        <Dropdown
          content={
            <div className="flex flex-col gap-1">
              <Button
                className="w-full justify-start"
                onClick={() => navigate(ROUTE_PATH.myDashboard)}
                size="sm"
                variant="ghost"
              >
                내 대시보드
              </Button>
              <Button
                className="w-full justify-start"
                onClick={() => navigate(ROUTE_PATH.myPage)}
                size="sm"
                variant="ghost"
              >
                내 정보
              </Button>
              <Button
                className="w-full justify-start"
                onClick={handleLogout}
                size="sm"
                variant="ghost"
              >
                로그아웃
              </Button>
            </div>
          }
        >
          <button
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-slate-300 hover:bg-slate-100"
            type="button"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-taskify-primary-600 text-sm font-bold text-white">
              {user?.nickname.slice(0, 1).toUpperCase() ?? 'U'}
            </span>
            <span className="hidden text-sm font-semibold text-slate-800 md:block">
              {user?.nickname ?? '사용자'}
            </span>
          </button>
        </Dropdown>
      </div>
    </header>
  )
}
