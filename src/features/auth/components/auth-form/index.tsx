import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'

/**
 * 인증 페이지에서 공통으로 사용하는 로고/제목/푸터 레이아웃입니다.
 *
 * @example
 * ```tsx
 * <AuthFormLayout footer={<Link to="/signup">회원가입</Link>} title="로그인">
 *   <LoginForm />
 * </AuthFormLayout>
 * ```
 */
export const AuthFormLayout = ({
  children,
  description,
  footer,
  title,
}: {
  children: ReactNode
  description: string
  footer: ReactNode
  title: string
}) => {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 md:px-8 md:py-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link
            className="inline-flex flex-col items-center gap-2 rounded-3xl px-4 py-3 transition hover:bg-white"
            to={ROUTE_PATH.home}
          >
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-taskify-primary-600 text-xl font-bold text-white shadow-sm">
              T
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Taskify</span>
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {children}
        </section>

        <div className="text-center text-sm text-slate-500">{footer}</div>
      </div>
    </main>
  )
}
