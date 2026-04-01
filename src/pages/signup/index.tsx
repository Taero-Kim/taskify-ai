import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { AuthFormLayout } from '@/features/auth/components/auth-form'
import { PasswordVisibilityButton } from '@/features/auth/components/password-visibility-button'
import { createUser } from '@/features/user/apis/createUser'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { validateEmail } from '@/shared/utils/validateEmail'
import { validateNickname } from '@/shared/utils/validateNickname'
import { validatePassword } from '@/shared/utils/validatePassword'

import { SIGNUP_ERROR_MESSAGES, SIGNUP_FORM_DEFAULT_VALUES } from '@/pages/signup/signup.constants'
import type { SignupField, SignupFormValues } from '@/pages/signup/signup.types'

const getSignupFieldError = (field: SignupField, values: SignupFormValues) => {
  if (field === 'nickname') {
    if (!values.nickname.trim()) {
      return ''
    }

    return validateNickname(values.nickname) ? '' : SIGNUP_ERROR_MESSAGES.nickname
  }

  if (field === 'email') {
    return validateEmail(values.email) ? '' : SIGNUP_ERROR_MESSAGES.email
  }

  if (field === 'password') {
    return validatePassword(values.password) ? '' : SIGNUP_ERROR_MESSAGES.password
  }

  if (!values.passwordConfirmation.trim() || values.password !== values.passwordConfirmation) {
    return SIGNUP_ERROR_MESSAGES.passwordConfirmation
  }

  return ''
}

export const SignupPage = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const [values, setValues] = useState<SignupFormValues>(SIGNUP_FORM_DEFAULT_VALUES)
  const [touchedFields, setTouchedFields] = useState<Record<SignupField, boolean>>({
    email: false,
    nickname: false,
    password: false,
    passwordConfirmation: false,
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const errors = useMemo(
    () => ({
      email: getSignupFieldError('email', values),
      nickname: getSignupFieldError('nickname', values),
      password: getSignupFieldError('password', values),
      passwordConfirmation: getSignupFieldError('passwordConfirmation', values),
    }),
    [values],
  )

  const isSubmitDisabled =
    isSubmitting ||
    !values.nickname.trim() ||
    !values.email.trim() ||
    !values.password.trim() ||
    !values.passwordConfirmation.trim() ||
    !values.agreeToTerms ||
    Boolean(errors.nickname || errors.email || errors.password || errors.passwordConfirmation)

  const handleBlur = (field: SignupField) => {
    setTouchedFields((prevTouchedFields) => ({
      ...prevTouchedFields,
      [field]: true,
    }))
  }

  const handleChange = (field: SignupField, nextValue: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: nextValue,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouchedFields({
      email: true,
      nickname: true,
      password: true,
      passwordConfirmation: true,
    })

    if (isSubmitDisabled) {
      return
    }

    setIsSubmitting(true)

    try {
      await createUser({
        email: values.email,
        nickname: values.nickname,
        password: values.password,
      })

      openModal({
        actions: [
          {
            label: '로그인하기',
            onClick: () => navigate(ROUTE_PATH.login, { replace: true }),
            tone: 'primary',
          },
        ],
        description: '이제 로그인 후 Taskify를 바로 사용할 수 있습니다.',
        title: SIGNUP_ERROR_MESSAGES.success,
      })
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 409
          ? SIGNUP_ERROR_MESSAGES.duplicateEmail
          : error instanceof Error
            ? error.message
            : '회원가입에 실패했습니다.'

      openModal({
        actions: [{ label: '확인', tone: 'primary' }],
        title: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFormLayout
      description="초대와 협업을 바로 시작할 수 있도록 새로운 계정을 만드세요."
      footer={
        <>
          이미 회원이신가요?{' '}
          <Link className="font-semibold text-taskify-primary-600" to={ROUTE_PATH.login}>
            로그인하기
          </Link>
        </>
      }
      title="회원가입"
    >
      <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
        <Input
          errorMessage={touchedFields.nickname ? errors.nickname : ''}
          label="닉네임"
          onBlur={() => handleBlur('nickname')}
          onChange={(event) => handleChange('nickname', event.target.value)}
          placeholder="10자 이하로 입력해 주세요"
          value={values.nickname}
        />
        <Input
          autoComplete="email"
          errorMessage={touchedFields.email ? errors.email : ''}
          label="이메일"
          onBlur={() => handleBlur('email')}
          onChange={(event) => handleChange('email', event.target.value)}
          placeholder="taskify@example.com"
          type="email"
          value={values.email}
        />
        <Input
          autoComplete="new-password"
          errorMessage={touchedFields.password ? errors.password : ''}
          label="비밀번호"
          onBlur={() => handleBlur('password')}
          onChange={(event) => handleChange('password', event.target.value)}
          placeholder="8자 이상 입력해 주세요"
          rightAdornment={
            <PasswordVisibilityButton
              isVisible={isPasswordVisible}
              onClick={() =>
                setIsPasswordVisible((prevIsPasswordVisible) => !prevIsPasswordVisible)
              }
            />
          }
          type={isPasswordVisible ? 'text' : 'password'}
          value={values.password}
        />
        <Input
          autoComplete="new-password"
          errorMessage={touchedFields.passwordConfirmation ? errors.passwordConfirmation : ''}
          label="비밀번호 확인"
          onBlur={() => handleBlur('passwordConfirmation')}
          onChange={(event) => handleChange('passwordConfirmation', event.target.value)}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          rightAdornment={
            <PasswordVisibilityButton
              isVisible={isPasswordConfirmationVisible}
              onClick={() =>
                setIsPasswordConfirmationVisible(
                  (prevIsPasswordConfirmationVisible) => !prevIsPasswordConfirmationVisible,
                )
              }
            />
          }
          type={isPasswordConfirmationVisible ? 'text' : 'password'}
          value={values.passwordConfirmation}
        />

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <input
            checked={values.agreeToTerms}
            className="mt-1 size-4 rounded border-slate-300 text-taskify-primary-600 focus:ring-taskify-primary-500"
            onChange={(event) =>
              setValues((prevValues) => ({
                ...prevValues,
                agreeToTerms: event.target.checked,
              }))
            }
            type="checkbox"
          />
          <span>이용약관에 동의하고, Taskify의 일정 공유 기능을 사용하겠습니다.</span>
        </label>

        <Button className="mt-2 w-full" disabled={isSubmitDisabled} type="submit">
          {isSubmitting ? '가입 처리 중...' : '가입하기'}
        </Button>
      </form>
    </AuthFormLayout>
  )
}
