export const LOGIN_FORM_DEFAULT_VALUES = {
  email: '',
  password: '',
} as const

export const LOGIN_ERROR_MESSAGES = {
  email: '이메일 형식으로 작성해 주세요.',
  password: '8자 이상 작성해 주세요.',
  submit: '비밀번호가 일치하지 않습니다.',
} as const
