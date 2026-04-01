import type { ReactNode } from 'react'

/**
 * 헤더 + 사이드바 + 메인 영역을 조합하는 공통 대시보드 레이아웃입니다.
 */
export const DashboardLayout = ({
  children,
  header,
  sidebar,
}: {
  children: ReactNode
  header: ReactNode
  sidebar: ReactNode
}) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {header}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col md:min-h-[calc(100vh-73px)] md:flex-row">
        {sidebar}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
