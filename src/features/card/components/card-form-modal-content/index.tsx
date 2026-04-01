import { useMemo, useState } from 'react'

import { createCard } from '@/features/card/apis/createCard'
import { deleteCard } from '@/features/card/apis/deleteCard'
import type { Card } from '@/features/card/apis/card.types'
import { updateCard } from '@/features/card/apis/updateCard'
import { uploadCardImage } from '@/features/card/apis/uploadCardImage'
import type { Column } from '@/features/column/apis/column.types'
import type { DashboardMember } from '@/features/dashboard/apis/getMembers'
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

const getTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

const formatDueDateForInput = (value?: string | null) => {
  if (!value) {
    return ''
  }

  return value.replace(' ', 'T').slice(0, 16)
}

const formatDueDateForApi = (value: string) => {
  if (!value) {
    return null
  }

  return value.replace('T', ' ')
}

export const CardFormModalContent = ({
  card,
  columnId,
  columns,
  dashboardId,
  members,
  mode,
  onDeleted,
  onSubmitted,
}: {
  card?: Card
  columnId: number
  columns: Column[]
  dashboardId: number
  members: DashboardMember[]
  mode: 'create' | 'edit'
  onDeleted?: () => void
  onSubmitted?: (updatedCard?: Card) => void
}) => {
  const { closeAllModals, closeModal, openModal } = useModal()
  const { openToast } = useToast()
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [dueDate, setDueDate] = useState(formatDueDateForInput(card?.dueDate))
  const [tags, setTags] = useState(card?.tags.join(', ') ?? '')
  const [selectedColumnId, setSelectedColumnId] = useState(String(card?.columnId ?? columnId))
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(
    card?.assignee?.id ? String(card.assignee.id) : '',
  )
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const initialSnapshot = useMemo(
    () => ({
      assigneeId: card?.assignee?.id ? String(card.assignee.id) : '',
      columnId: String(card?.columnId ?? columnId),
      description: card?.description ?? '',
      dueDate: formatDueDateForInput(card?.dueDate),
      tags: card?.tags.join(', ') ?? '',
      title: card?.title ?? '',
    }),
    [card, columnId],
  )

  const isCreateDisabled = !title.trim() || !description.trim() || !dueDate.trim() || isSubmitting
  const isEditChanged =
    title !== initialSnapshot.title ||
    description !== initialSnapshot.description ||
    dueDate !== initialSnapshot.dueDate ||
    tags !== initialSnapshot.tags ||
    selectedAssigneeId !== initialSnapshot.assigneeId ||
    selectedColumnId !== initialSnapshot.columnId ||
    Boolean(selectedImageFile)

  const isEditDisabled = !isEditChanged || !title.trim() || !description.trim() || isSubmitting

  const handleSubmit = async () => {
    if ((mode === 'create' && isCreateDisabled) || (mode === 'edit' && isEditDisabled)) {
      return
    }

    setIsSubmitting(true)

    try {
      const resolvedColumnId = Number(selectedColumnId)
      const resolvedDueDate = formatDueDateForApi(dueDate)
      let imageUrl = card?.imageUrl ?? undefined

      if (selectedImageFile) {
        const uploadResponse = await uploadCardImage(resolvedColumnId, selectedImageFile)
        imageUrl = uploadResponse.imageUrl
      }

      const payload = {
        assigneeUserId: selectedAssigneeId ? Number(selectedAssigneeId) : undefined,
        columnId: resolvedColumnId,
        dashboardId,
        description: description.trim(),
        dueDate: resolvedDueDate ?? undefined,
        imageUrl,
        tags: getTags(tags),
        title: title.trim(),
      }

      const nextCard =
        mode === 'create'
          ? await createCard(payload)
          : await updateCard(card!.id, {
              assigneeUserId: payload.assigneeUserId ?? null,
              columnId: payload.columnId,
              description: payload.description,
              dueDate: payload.dueDate ?? null,
              imageUrl: payload.imageUrl ?? null,
              tags: payload.tags,
              title: payload.title,
            })

      closeModal()
      onSubmitted?.(nextCard)
      openToast({
        title: mode === 'create' ? '카드가 생성되었습니다.' : '카드가 수정되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      openToast({
        title: getErrorMessage(
          error,
          mode === 'create' ? '카드 생성에 실패했습니다.' : '카드 수정에 실패했습니다.',
        ),
        tone: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCard = () => {
    if (!card) {
      return
    }

    openModal({
      actions: [
        { label: '취소', tone: 'neutral' },
        {
          label: '삭제하기',
          onClick: async () => {
            setIsDeleting(true)

            try {
              await deleteCard(card.id)
              closeAllModals()
              onDeleted?.()
              openToast({
                title: '카드를 삭제했습니다.',
                tone: 'success',
              })
            } catch (error) {
              openToast({
                title: getErrorMessage(error, '카드 삭제에 실패했습니다.'),
                tone: 'error',
              })
            } finally {
              setIsDeleting(false)
            }
          },
          tone: 'danger',
        },
      ],
      description: '삭제된 카드는 복구할 수 없습니다.',
      title: isDeleting ? '삭제 중...' : '카드를 삭제할까요?',
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <Input
        label="카드 제목"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="예: 로그인 페이지 구현"
        value={title}
      />
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-800" htmlFor="card-description">
          카드 설명
        </label>
        <textarea
          className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-taskify-primary-500 focus:ring-2 focus:ring-taskify-primary-100"
          id="card-description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="카드 설명을 입력해 주세요"
          value={description}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="마감일"
          onChange={(event) => setDueDate(event.target.value)}
          type="datetime-local"
          value={dueDate}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="card-assignee">
            담당자
          </label>
          <select
            className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-taskify-primary-500 focus:ring-2 focus:ring-taskify-primary-100"
            id="card-assignee"
            onChange={(event) => setSelectedAssigneeId(event.target.value)}
            value={selectedAssigneeId}
          >
            <option value="">담당자 없음</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.nickname}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="card-column">
            컬럼
          </label>
          <select
            className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-taskify-primary-500 focus:ring-2 focus:ring-taskify-primary-100"
            id="card-column"
            onChange={(event) => setSelectedColumnId(event.target.value)}
            value={selectedColumnId}
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="태그"
          onChange={(event) => setTags(event.target.value)}
          placeholder="쉼표로 구분해 입력해 주세요"
          value={tags}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-800" htmlFor="card-image">
          카드 이미지 (선택)
        </label>
        <input
          accept="image/*"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
          id="card-image"
          onChange={(event) => setSelectedImageFile(event.target.files?.[0] ?? null)}
          type="file"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        {mode === 'edit' ? (
          <Button onClick={handleDeleteCard} variant="outline">
            삭제하기
          </Button>
        ) : (
          <span />
        )}
        <Button
          disabled={mode === 'create' ? isCreateDisabled : isEditDisabled}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? mode === 'create'
              ? '생성 중...'
              : '수정 중...'
            : mode === 'create'
              ? '생성'
              : '수정'}
        </Button>
      </div>
    </div>
  )
}
