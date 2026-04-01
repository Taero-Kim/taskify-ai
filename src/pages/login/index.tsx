import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { login as loginRequest } from '@/features/auth/apis/login'
import { AuthFormLayout } from '@/features/auth/components/auth-form'
import { PasswordVisibilityButton } from '@/features/auth/components/password-visibility-button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { validateEmail } from '@/shared/utils/validateEmail'
import { validatePassword } from '@/shared/utils/validatePassword'

import { LOGIN_ERROR_MESSAGES, LOGIN_FORM_DEFAULT_VALUES } from '@/pages/login/login.constants'
import type { LoginField, LoginFormValues } from '@/pages/login/login.types'

type RedirectLocationState = {
  redirectTo?: string
}

const getLoginFieldError = (field: LoginField, values: LoginFormValues) => {
  if (field === 'email') {
    return validateEmail(values.email) ? '' : LOGIN_ERROR_MESSAGES.email
  }

  return validatePassword(values.password) ? '' : LOGIN_ERROR_MESSAGES.password
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { openModal } = useModal()
  const [values, setValues] = useState<LoginFormValues>(LOGIN_FORM_DEFAULT_VALUES)
  const [touchedFields, setTouchedFields] = useState<Record<LoginField, boolean>>({
    email: false,
    password: false,
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const errors = useMemo(
    () => ({
      email: getLoginFieldError('email', values),
      password: getLoginFieldError('password', values),
    }),
    [values],
  )

  const isSubmitDisabled =
    isSubmitting ||
    !values.email.trim() ||
    !values.password.trim() ||
    Boolean(errors.email || errors.password)

  const redirectTo =
    (location.state as RedirectLocationState | null)?.redirectTo ?? ROUTE_PATH.myDashboard

  const handleBlur = (field: LoginField) => {
    setTouchedFields((prevTouchedFields) => ({
      ...prevTouchedFields,
      [field]: true,
    }))
  }

  const handleChange = (field: LoginField, nextValue: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: nextValue,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouchedFields({ email: true, password: true })

    if (isSubmitDisabled) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await loginRequest(values)
      await login(response.accessToken)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 400
          ? LOGIN_ERROR_MESSAGES.submit
          : error instanceof Error
            ? error.message
            : '로그인에 실패했습니다.'

      openModal({
        actions: [{ label: '확인', tone: 'primary' }],
        description: '입력한 이메일과 비밀번호를 다시 확인해 주세요.',
        title: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFormLayout
      description="가족, 팀, 프로젝트의 일정을 함께 관리해 보세요."
      footer={
        <>
          회원이 아니신가요?{' '}
          <Link className="font-semibold text-taskify-primary-600" to={ROUTE_PATH.signup}>
            회원가입하기
          </Link>
        </>
      }
      title="로그인"
    >
      <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          errorMessage={touchedFields.password ? errors.password : ''}
          label="비밀번호"
          onBlur={() => handleBlur('password')}
          onChange={(event) => handleChange('password', event.target.value)}
          placeholder="비밀번호를 입력해 주세요"
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
        <Button className="mt-2 w-full" disabled={isSubmitDisabled} type="submit">
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>
      </form>
    </AuthFormLayout>
  )
}
