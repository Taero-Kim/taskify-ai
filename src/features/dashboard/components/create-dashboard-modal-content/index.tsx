import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { createDashboard } from '@/features/dashboard/apis/createDashboard'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { useToast } from '@/shared/components/toast/useToast'
import { DASHBOARD_COLOR_OPTIONS } from '@/shared/constants/dashboard'

const createDashboardPath = (dashboardId: number) =>
  ROUTE_PATH.dashboard.replace(':dashboardId', String(dashboardId))

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return '대시보드 생성에 실패했습니다.'
}

export const CreateDashboardModalContent = () => {
  const navigate = useNavigate()
  const { closeModal } = useModal()
  const { openToast } = useToast()
  const [title, setTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSubmitDisabled = !title.trim() || !selectedColor || isSubmitting

  const handleCreateDashboard = async () => {
    if (isSubmitDisabled) {
      return
    }

    setIsSubmitting(true)

    try {
      const createdDashboard = await createDashboard({
        color: selectedColor,
        title: title.trim(),
      })

      closeModal()
      openToast({
        title: '대시보드가 생성되었습니다.',
        tone: 'success',
      })
      navigate(createDashboardPath(createdDashboard.id))
    } catch (error) {
      openToast({
        description: '대시보드 이름과 색상을 다시 확인해 주세요.',
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
        label="대시보드 이름"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="대시보드 이름을 입력해 주세요"
        value={title}
      />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-slate-800">색상 선택</p>
        <div className="flex flex-wrap gap-3">
          {DASHBOARD_COLOR_OPTIONS.map((dashboardColor) => {
            const isSelected = selectedColor === dashboardColor

            return (
              <button
                aria-label={`대시보드 색상 ${dashboardColor}`}
                className={`relative inline-flex size-11 items-center justify-center rounded-full border-2 transition ${
                  isSelected
                    ? 'border-slate-900 shadow-md'
                    : 'border-transparent hover:border-slate-300'
                }`}
                key={dashboardColor}
                onClick={() => setSelectedColor(dashboardColor)}
                style={{ backgroundColor: dashboardColor }}
                type="button"
              >
                {isSelected ? <span className="text-lg font-bold text-white">✓</span> : null}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={isSubmitDisabled} onClick={handleCreateDashboard}>
          {isSubmitting ? '생성 중...' : '생성'}
        </Button>
      </div>
    </div>
  )
}
