type PasswordVisibilityButtonProps = {
  isVisible: boolean
  onClick: () => void
}

export const PasswordVisibilityButton = ({ isVisible, onClick }: PasswordVisibilityButtonProps) => {
  return (
    <button
      aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
      className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      onClick={onClick}
      type="button"
    >
      {isVisible ? (
        <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
          <path
            d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.9 5.3A10.9 10.9 0 0112 5c5.2 0 9 4.5 10 7-0.4 0.9-1.2 2.3-2.5 3.6M6.2 6.2C4.1 7.6 2.6 9.8 2 12c1 2.5 4.8 7 10 7 1.7 0 3.2-0.5 4.5-1.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      ) : (
        <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
          <path
            d="M2 12c1-2.5 4.8-7 10-7s9 4.5 10 7c-1 2.5-4.8 7-10 7S3 14.5 2 12z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )}
    </button>
  )
}
