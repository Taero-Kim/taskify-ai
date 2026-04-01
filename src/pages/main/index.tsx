import { Navigate, Link } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { RouteGateFallback } from '@/features/auth/components/route-gate-fallback'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { buttonVariants } from '@/shared/components/button/buttonVariants'
import { cn } from '@/shared/utils/cn'

const featureItems = [
  {
    description: '개인 일정부터 팀 협업 보드까지 한 화면에서 정리할 수 있습니다.',
    title: '간단한 일정 관리',
  },
  {
    description: '보드, 카드, 댓글 흐름으로 협업 상태를 빠르게 공유할 수 있습니다.',
    title: '실시간 협업 구조',
  },
  {
    description: '대시보드 초대와 멤버 관리로 프로젝트 공간을 유연하게 운영할 수 있습니다.',
    title: '초대 기반 워크스페이스',
  },
] as const

export const MainPage = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <RouteGateFallback />
  }

  if (isAuthenticated) {
    return <Navigate replace to={ROUTE_PATH.myDashboard} />
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 md:px-8 md:py-8">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <Link className="flex items-center gap-3" to={ROUTE_PATH.home}>
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-taskify-primary-600 text-lg font-bold text-white">
              T
            </span>
            <span className="text-lg font-semibold tracking-tight">Taskify</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              className={cn(
                buttonVariants({ size: 'sm', variant: 'ghost' }),
                'text-white hover:bg-white/10 hover:text-white',
              )}
              to={ROUTE_PATH.login}
            >
              로그인
            </Link>
            <Link
              className={buttonVariants({ size: 'sm', variant: 'primary' })}
              to={ROUTE_PATH.signup}
            >
              회원가입
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center gap-16 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit rounded-full border border-taskify-primary-500/40 bg-taskify-primary-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-taskify-primary-100">
                Simplify your tasks
              </span>
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
                  Taskify로 일정과 협업을 더 단순하게 관리하세요.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  대시보드, 컬럼, 카드 흐름으로 팀의 진행 상황을 공유하고 초대 기반 워크스페이스를
                  빠르게 시작할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className={buttonVariants({ size: 'lg', variant: 'primary' })}
                  to={ROUTE_PATH.signup}
                >
                  지금 시작하기
                </Link>
                <Link
                  className={buttonVariants({ size: 'lg', variant: 'outline' })}
                  to={ROUTE_PATH.login}
                >
                  로그인하기
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-taskify-primary-500/20 via-slate-900 to-slate-900 p-6 shadow-2xl">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-taskify-primary-100">My Workspace</p>
                    <p className="mt-1 text-lg font-bold text-white">Taskify 프로젝트 보드</p>
                  </div>
                  <span className="rounded-full bg-taskify-primary-500/20 px-3 py-1 text-xs font-semibold text-taskify-primary-100">
                    3개 컬럼
                  </span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {['To Do', 'In Progress', 'Done'].map((columnTitle, columnIndex) => (
                    <article
                      className="rounded-3xl border border-white/10 bg-white/5 p-4"
                      key={columnTitle}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-white">{columnTitle}</h2>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">
                          {columnIndex + 2}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-col gap-3">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                          <p className="text-sm font-semibold text-white">랜딩 페이지 정리</p>
                          <p className="mt-2 text-xs leading-5 text-slate-400">
                            카드와 댓글 흐름으로 작업을 공유하세요.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-dashed border-white/10 p-3 text-xs text-slate-400">
                          새로운 카드를 추가해 보세요.
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            {featureItems.map((featureItem) => (
              <article
                className="rounded-[28px] border border-white/10 bg-white/5 p-6"
                key={featureItem.title}
              >
                <h2 className="text-xl font-semibold text-white">{featureItem.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{featureItem.description}</p>
              </article>
            ))}
          </section>
        </section>
      </div>
    </main>
  )
}
