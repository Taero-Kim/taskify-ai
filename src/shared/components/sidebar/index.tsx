import { Link } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import type { Dashboard } from '@/features/dashboard/apis/dashboard.types'
import { Button } from '@/shared/components/button'
import { cn } from '@/shared/utils/cn'

const createDashboardPath = (dashboardId: number) =>
  ROUTE_PATH.dashboard.replace(':dashboardId', String(dashboardId))

type DashboardSidebarProps = {
  currentDashboardId?: number
  currentPage: number
  dashboards: Dashboard[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  onCreateDashboard: () => void
  onNextPage: () => void
  onPreviousPage: () => void
}

/**
 * 대시보드 목록과 생성 버튼을 표시하는 공통 사이드바입니다.
 */
export const DashboardSidebar = ({
  currentDashboardId,
  currentPage,
  dashboards,
  hasNextPage,
  hasPreviousPage,
  onCreateDashboard,
  onNextPage,
  onPreviousPage,
}: DashboardSidebarProps) => {
  return (
    <aside className="flex w-full flex-col gap-4 border-b border-slate-200 bg-white p-4 md:w-[280px] md:border-b-0 md:border-r md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Dash Boards
          </p>
          <p className="mt-1 text-sm text-slate-500">참여 중인 대시보드를 확인하세요.</p>
        </div>
        <Button onClick={onCreateDashboard} size="sm" variant="outline">
          +
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {dashboards.length ? (
          dashboards.map((dashboard) => (
            <Link
              className={cn(
                'flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition hover:border-slate-300 hover:bg-slate-50',
                currentDashboardId === dashboard.id
                  ? 'border-taskify-primary-500 bg-taskify-primary-100 text-taskify-primary-700'
                  : 'border-transparent text-slate-700',
              )}
              key={dashboard.id}
              to={createDashboardPath(dashboard.id)}
            >
              <span
                className="inline-flex size-3 rounded-full"
                style={{ backgroundColor: dashboard.color }}
              />
              <span className="flex-1 truncate">{dashboard.title}</span>
              {dashboard.createdByMe ? <span aria-hidden="true">👑</span> : null}
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-5 text-sm text-slate-400">
            표시할 대시보드가 없습니다.
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-sm text-slate-500">
        <Button disabled={!hasPreviousPage} onClick={onPreviousPage} size="sm" variant="ghost">
          이전
        </Button>
        <span>{currentPage} 페이지</span>
        <Button disabled={!hasNextPage} onClick={onNextPage} size="sm" variant="ghost">
          다음
        </Button>
      </div>
    </aside>
  )
}
