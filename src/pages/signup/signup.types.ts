export type SignupField = 'email' | 'nickname' | 'password' | 'passwordConfirmation'

export type SignupFormValues = {
  agreeToTerms: boolean
  email: string
  nickname: string
  password: string
  passwordConfirmation: string
}
