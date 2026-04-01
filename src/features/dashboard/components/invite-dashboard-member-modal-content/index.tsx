import { useState } from 'react'

import { createInvitation } from '@/features/dashboard/apis/createInvitation'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { useToast } from '@/shared/components/toast/useToast'
import { validateEmail } from '@/shared/utils/validateEmail'

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return '초대 전송에 실패했습니다.'
}

export const InviteDashboardMemberModalContent = ({
  dashboardId,
  onSuccess,
}: {
  dashboardId: number
  onSuccess?: () => void
}) => {
  const { closeModal } = useModal()
  const { openToast } = useToast()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const emailErrorMessage =
    isTouched && !validateEmail(email) ? '이메일 형식으로 작성해 주세요.' : ''
  const isSubmitDisabled = !email.trim() || !validateEmail(email) || isSubmitting

  const handleSubmit = async () => {
    setIsTouched(true)

    if (isSubmitDisabled) {
      return
    }

    setIsSubmitting(true)

    try {
      await createInvitation(dashboardId, { email: email.trim() })
      closeModal()
      onSuccess?.()
      openToast({
        title: '초대를 전송했습니다.',
        tone: 'success',
      })
    } catch (error) {
      openToast({
        title: getErrorMessage(error),
        tone: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Input
        errorMessage={emailErrorMessage}
        label="초대 이메일"
        onBlur={() => setIsTouched(true)}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="invite@example.com"
        type="email"
        value={email}
      />
      <div className="flex justify-end">
        <Button disabled={isSubmitDisabled} onClick={handleSubmit}>
          {isSubmitting ? '초대 중...' : '초대'}
        </Button>
      </div>
    </div>
  )
}
