export const SIGNUP_FORM_DEFAULT_VALUES = {
  agreeToTerms: false,
  email: '',
  nickname: '',
  password: '',
  passwordConfirmation: '',
} as const

export const SIGNUP_ERROR_MESSAGES = {
  email: '이메일 형식으로 작성해 주세요.',
  nickname: '열 자 이하로 작성해주세요.',
  password: '8자 이상 입력해주세요.',
  passwordConfirmation: '비밀번호가 일치하지 않습니다.',
  duplicateEmail: '이미 사용중인 이메일입니다',
  success: '가입이 완료되었습니다',
} as const
