import { useParams } from 'react-router-dom'

export const DashboardEditPage = () => {
  const { dashboardId } = useParams()

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-taskify-primary-600">
          /dashboard/:dashboardId/edit
        </span>
        <h1 className="text-3xl font-bold">대시보드 수정 페이지 스켈레톤</h1>
        <p className="text-base leading-7 text-slate-600">
          현재 편집 대상 dashboardId는 <strong>{dashboardId ?? '미지정'}</strong> 입니다.
        </p>
      </div>
    </main>
  )
}
