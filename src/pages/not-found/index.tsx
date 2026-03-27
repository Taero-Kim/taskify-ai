import { Link } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'

export const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="flex max-w-xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-10">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-taskify-primary-500">
          404
        </span>
        <h1 className="text-4xl font-bold">페이지를 찾을 수 없습니다.</h1>
        <Link className="text-sm font-medium text-taskify-primary-500" to={ROUTE_PATH.home}>
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
