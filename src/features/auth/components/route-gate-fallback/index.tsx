/**
 * 인증 초기화 동안 표시하는 공통 가드 fallback입니다.
 */
export const RouteGateFallback = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-700">
      <div className="flex w-full max-w-md flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-taskify-primary-600">
          Authenticating
        </span>
        <p className="text-base leading-7">인증 상태를 확인하고 있습니다.</p>
      </div>
    </main>
  )
}
