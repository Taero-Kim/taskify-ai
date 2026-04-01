import { fetchData } from '@/shared/api/fetch'

import type { Card } from '@/features/card/apis/card.types'

type CreateCardRequest = {
  assigneeUserId?: number
  columnId: number
  dashboardId: number
  description: string
  dueDate?: string
  imageUrl?: string
  tags?: string[]
  title: string
}

export const createCard = (body: CreateCardRequest) => {
  return fetchData<Card, CreateCardRequest>({
    body,
    method: 'POST',
    path: '/cards',
    requiresAuth: true,
  })
}
