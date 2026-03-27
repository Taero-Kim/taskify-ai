export const MyPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-taskify-primary-600">
          /mypage
        </span>
        <h1 className="text-3xl font-bold">마이페이지 스켈레톤</h1>
        <p className="text-base leading-7 text-slate-600">
          프로필 수정과 비밀번호 변경은 이후 단계에서 API와 함께 연결합니다.
        </p>
      </div>
    </main>
  )
}
