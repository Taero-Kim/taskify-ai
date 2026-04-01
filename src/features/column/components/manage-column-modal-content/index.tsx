import { useMemo, useState } from 'react'

import { deleteColumn } from '@/features/column/apis/deleteColumn'
import type { Column } from '@/features/column/apis/column.types'
import { updateColumn } from '@/features/column/apis/updateColumn'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { useToast } from '@/shared/components/toast/useToast'

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

export const ManageColumnModalContent = ({
  column,
  existingTitles,
  onDeleted,
  onUpdated,
}: {
  column: Column
  existingTitles: string[]
  onDeleted?: () => void
  onUpdated?: () => void
}) => {
  const { closeAllModals, closeModal, openModal } = useModal()
  const { openToast } = useToast()
  const [title, setTitle] = useState(column.title)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const normalizedTitles = useMemo(
    () =>
      existingTitles
        .filter((existingTitle) => existingTitle !== column.title)
        .map((existingTitle) => existingTitle.trim().toLowerCase()),
    [column.title, existingTitles],
  )
  const isDuplicate = normalizedTitles.includes(title.trim().toLowerCase())
  const isUpdateDisabled =
    !title.trim() || title.trim() === column.title || isDuplicate || isSubmitting

  const handleUpdateColumn = async () => {
    if (isUpdateDisabled) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateColumn(column.id, { title: title.trim() })
      closeModal()
      onUpdated?.()
      openToast({
        title: '컬럼 이름이 변경되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '컬럼 수정에 실패했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteColumn = () => {
    openModal({
      actions: [
        { label: '취소', tone: 'neutral' },
        {
          label: '예',
          onClick: async () => {
            setIsDeleting(true)

            try {
              await deleteColumn(column.id)
              closeAllModals()
              onDeleted?.()
              openToast({
                title: '컬럼을 삭제했습니다.',
                tone: 'success',
              })
            } catch (error) {
              openToast({
                title: getErrorMessage(error, '컬럼 삭제에 실패했습니다.'),
                tone: 'error',
              })
            } finally {
              setIsDeleting(false)
            }
          },
          tone: 'danger',
        },
      ],
      description: '컬럼의 모든 카드가 삭제됩니다',
      title: isDeleting ? '삭제 중...' : '삭제하시겠습니까?',
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <Input
        errorMessage={isDuplicate ? '중복된 컬럼 이름입니다' : ''}
        label="컬럼 이름"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="컬럼 이름을 입력해 주세요"
        value={title}
      />
      <div className="flex items-center justify-between gap-3">
        <Button onClick={handleDeleteColumn} variant="outline">
          삭제하기
        </Button>
        <Button disabled={isUpdateDisabled} onClick={handleUpdateColumn}>
          {isSubmitting ? '변경 중...' : '변경'}
        </Button>
      </div>
    </div>
  )
}
