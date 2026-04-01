import { useMemo, useState } from 'react'

import { createColumn } from '@/features/column/apis/createColumn'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { useToast } from '@/shared/components/toast/useToast'

const MAX_COLUMN_COUNT = 10

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return '컬럼 생성에 실패했습니다.'
}

export const CreateColumnModalContent = ({
  columnCount,
  dashboardId,
  existingTitles,
  onSuccess,
}: {
  columnCount: number
  dashboardId: number
  existingTitles: string[]
  onSuccess?: () => void
}) => {
  const { closeModal } = useModal()
  const { openToast } = useToast()
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const normalizedTitles = useMemo(
    () => existingTitles.map((existingTitle) => existingTitle.trim().toLowerCase()),
    [existingTitles],
  )

  const isOverLimit = columnCount >= MAX_COLUMN_COUNT
  const isDuplicate = normalizedTitles.includes(title.trim().toLowerCase())
  const isSubmitDisabled = isOverLimit || !title.trim() || isDuplicate || isSubmitting

  const handleCreateColumn = async () => {
    if (isSubmitDisabled) {
      return
    }

    setIsSubmitting(true)

    try {
      await createColumn({
        dashboardId,
        title: title.trim(),
      })
      closeModal()
      onSuccess?.()
      openToast({
        title: '컬럼이 생성되었습니다.',
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
        errorMessage={
          isOverLimit
            ? '컬럼은 최대 10개까지 생성할 수 있습니다.'
            : isDuplicate
              ? '중복된 컬럼 이름입니다'
              : ''
        }
        label="컬럼 이름"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="예: To Do"
        value={title}
      />
      <div className="flex justify-end">
        <Button disabled={isSubmitDisabled} onClick={handleCreateColumn}>
          {isSubmitting ? '생성 중...' : '생성'}
        </Button>
      </div>
    </div>
  )
}
